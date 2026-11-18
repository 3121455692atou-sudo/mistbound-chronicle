import { createHash, randomBytes } from 'node:crypto';
import { ACCESS_COPY as TEXT } from '../web/multiplayer-copy.mjs';

export const agentCookie = 'mb_dot';
export const agentId = id => `dot:${id}`;
export const agentRef = id => String(id || '').replace(/^dot:/,'').slice(0,8).toUpperCase();
const hash = value => createHash('sha256').update(value).digest('hex');
const TOKEN = /^[A-Za-z0-9_-]{43}$/;
const SESSION = /^([a-f0-9]{24})\.([A-Za-z0-9_-]{43})$/;

/** Delegated, room-bound identities. These are not OpenAI/OIDC identities or account-service sessions. */
export function createAgentAccess({ db, now, publicOrigin, requireThat }) {
  db.exec(`CREATE TABLE IF NOT EXISTS mp_agents(
    id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, code TEXT NOT NULL, name TEXT NOT NULL,
    invite_hash TEXT UNIQUE NOT NULL, session_hash TEXT, created_at INTEGER NOT NULL,
    invite_expires INTEGER NOT NULL, redeemed_at INTEGER, expires_at INTEGER, revoked_at INTEGER);
    CREATE INDEX IF NOT EXISTS mp_agents_owner ON mp_agents(owner_id);
    CREATE INDEX IF NOT EXISTS mp_agents_room ON mp_agents(code);`);
  if(!db.prepare('PRAGMA table_info(mp_agents)').all().some(c=>c.name==='issued_name'))
    db.exec('ALTER TABLE mp_agents ADD COLUMN issued_name TEXT');
  db.exec('UPDATE mp_agents SET issued_name=name WHERE issued_name IS NULL');
  const sql = {
    invite: db.prepare('SELECT * FROM mp_agents WHERE invite_hash=?'),
    get: db.prepare('SELECT * FROM mp_agents WHERE id=?'),
    owner: db.prepare('SELECT * FROM mp_agents WHERE owner_id=? ORDER BY created_at DESC'),
    live: db.prepare('SELECT * FROM mp_agents WHERE revoked_at IS NULL AND coalesce(expires_at,invite_expires)>?'),
    room: db.prepare(`SELECT json_extract(data,'$.status') AS status, json_extract(data,'$.closed') AS closed,
      json_extract(data,'$.title') AS title, json_extract(data,'$.edition') AS edition,
      (json_extract(data,'$.hostAccount')=? OR EXISTS(SELECT 1 FROM json_each(data,'$.seats')
        WHERE json_extract(value,'$.account')=?)) AS issuer_member FROM mp_rooms WHERE code=?`),
    insert: db.prepare('INSERT INTO mp_agents(id,owner_id,code,name,issued_name,invite_hash,created_at,invite_expires) VALUES(?,?,?,?,?,?,?,?)'),
    redeem: db.prepare('UPDATE mp_agents SET session_hash=?, name=?, redeemed_at=?, expires_at=? WHERE id=? AND redeemed_at IS NULL AND revoked_at IS NULL AND invite_expires>?'),
    revoke: db.prepare('UPDATE mp_agents SET revoked_at=?, session_hash=NULL WHERE id=? AND owner_id=? AND revoked_at IS NULL'),
    revokeRoom: db.prepare('UPDATE mp_agents SET revoked_at=?, session_hash=NULL WHERE code=? AND revoked_at IS NULL'),
    revokeUnused: db.prepare('UPDATE mp_agents SET revoked_at=?, session_hash=NULL WHERE owner_id=? AND code=? AND redeemed_at IS NULL AND revoked_at IS NULL'),
    rename: db.prepare('UPDATE mp_agents SET name=? WHERE id=? AND revoked_at IS NULL'),
    prune: db.prepare('DELETE FROM mp_agents WHERE coalesce(expires_at, invite_expires)<?'),
  };
  const active = row => row && !row.revoked_at && (row.redeemed_at ? row.expires_at : row.invite_expires) > now();
  const roomFor = row => row && sql.room.get(row.owner_id,row.owner_id,row.code);
  const playing = room => room && !room.closed && ['waiting','playing'].includes(room.status);
  const pending = row => active(row) && !row.redeemed_at && playing(roomFor(row)) && roomFor(row).issuer_member;
  const valid = row => {
    const room=roomFor(row);
    return active(row) && row.redeemed_at && row.session_hash && room && !room.closed;
  };
  const cleanName = name => {
    requireThat(typeof name==='string' && name.trim().length>=1 && name.trim().length<=24
      && !/[\u0000-\u001f\u007f]/.test(name),400,'bad-agent-name',TEXT.agentBadName);
    return name.trim();
  };
  const userFor = row => ({ id: agentId(row.id), name: row.name, kind: 'dot',
    ref:agentRef(row.id), grantId: row.id, roomCode: row.code, expires: row.expires_at });
  function inviteFor(token) {
    requireThat(typeof token==='string' && TOKEN.test(token),403,'agent-invite-invalid',TEXT.agentInvalid);
    const row=sql.invite.get(hash(token));
    requireThat(pending(row),403,'agent-invite-invalid',TEXT.agentInvalid);
    return row;
  }
  return {
    cookie(token = '', expires = 0) {
      const secure = new URL(publicOrigin).protocol === 'https:' ? '; Secure' : '';
      return `${agentCookie}=${token}; Path=/multiplayer; HttpOnly; SameSite=Strict; Max-Age=${Math.max(0, Math.floor((expires - now()) / 1000))}${secure}`;
    },
    read(token) {
      const match = typeof token === 'string' && token.length < 200 && token.match(SESSION);
      const row = match && sql.get.get(match[1]);
      return valid(row) && hash(match[2]) === row.session_hash ? userFor(row) : null;
    },
    isValid(user) {
      if (user.kind !== 'dot') return user.expires > now();
      const row = sql.get.get(user.grantId);
      return !!valid(row) && row.expires_at === user.expires;
    },
    validAccount(account) {
      if (!account?.startsWith('dot:')) return true;
      return !!valid(sql.get.get(account.slice(4)));
    },
    list(user, code) {
      return sql.owner.all(user.id).filter(row => (!code || row.code===code) && (pending(row)||valid(row))).map(row=>{
        const room=roomFor(row);
        return {id:row.id,ref:agentRef(row.id),code:row.code,name:row.name,issuedName:row.issued_name,
          used:!!row.redeemed_at,roomTitle:room.title,roomStatus:room.status,quota:playing(room),
          expires:row.redeemed_at?row.expires_at:row.invite_expires};
      });
    },
    create(user, room, name, replaceId = null) {
      name=cleanName(name);
      if(replaceId) {
        const previous=sql.get.get(String(replaceId));
        requireThat(previous?.owner_id===user.id && previous.code===room.code,404,'agent-not-found',TEXT.agentNotFound);
        requireThat(!previous.redeemed_at,409,'agent-replace-used',TEXT.agentReplaceUsed);
        requireThat(!previous.revoked_at,403,'agent-invite-invalid',TEXT.agentInvalid);
      }
      const used=sql.owner.all(user.id).filter(row=>row.code===room.code && row.id!==replaceId
        && playing(roomFor(row)) && (pending(row)||valid(row))).length;
      requireThat(used<3,409,'agent-limit',TEXT.agentLimit);
      const id = randomBytes(12).toString('hex'), token = randomBytes(32).toString('base64url');
      if(replaceId)sql.revoke.run(now(),replaceId,user.id);
      sql.insert.run(id,user.id,room.code,name,name,hash(token),now(),now()+30*60000);
      const url = new URL('/multiplayer.html', publicOrigin);
      // The bearer invitation stays in the fragment, outside HTTP URLs, logs and Referer headers.
      url.hash = `dot=${token}`;
      return {id,ref:agentRef(id),name,code:room.code,roomTitle:room.title,url:url.href,expires:now()+30*60000};
    },
    inspect(token) {
      const row=inviteFor(token),room=roomFor(row);
      return {name:row.name,ref:agentRef(row.id),code:row.code,roomTitle:room.title,expires:row.invite_expires};
    },
    redeem(token, getRoom, name = undefined) {
      const row=inviteFor(token);
      const room = getRoom(row.code, 'sfw');
      requireThat(room.status !== 'finished', 409, 'game-finished', TEXT.agentAlreadyFinished);
      const session = randomBytes(32).toString('base64url'), expires = now() + 12 * 3600000;
      const result = sql.redeem.run(hash(session),name===undefined?row.name:cleanName(name),now(),expires,row.id,now());
      requireThat(result.changes === 1, 403, 'agent-invite-invalid', TEXT.agentInvalid);
      return { token: `${row.id}.${session}`, expires, code: row.code };
    },
    revoke(user, id) {
      const row = sql.get.get(String(id));
      requireThat(row?.owner_id === user.id, 404, 'agent-not-found', TEXT.agentNotFound);
      sql.revoke.run(now(), row.id, user.id);
      return { account: agentId(row.id), code:row.code };
    },
    revokeAll(user) {
      const rows=sql.owner.all(user.id).filter(active);
      for(const row of rows)sql.revoke.run(now(),row.id,user.id);
      return rows.map(row=>({account:agentId(row.id),code:row.code}));
    },
    revokeUnused(owner,code) {sql.revokeUnused.run(now(),owner,code);},
    closeRoom(code) {sql.revokeRoom.run(now(),code);},
    rename(user,name) {
      const row=sql.get.get(user.grantId);
      requireThat(valid(row),401,'agent-session-ended',TEXT.agentExpired);
      sql.rename.run(cleanName(name),row.id);
      return userFor(sql.get.get(row.id));
    },
    end(user) {
      const row = sql.get.get(user.grantId);
      if (row) sql.revoke.run(now(), row.id, row.owner_id);
    },
    reconcile() {
      for(const row of sql.live.all(now())) {
        const room=roomFor(row);
        if(!room || room.closed || (!row.redeemed_at && !pending(row)))sql.revoke.run(now(),row.id,row.owner_id);
      }
    },
    cleanup() {sql.prune.run(now()-7*86400000);},
  };
}
