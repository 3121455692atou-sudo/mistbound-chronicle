/** Experimental explicit append-only checkpoints. Never reads localStorage or game UI state. */
import {encodeRegionCheckpoint,decodeRegionCheckpoint,ARCHIVE_MAX_BYTES} from './region-checkpoint-codec.mjs?v=1118-1603';
const STORES=['blobs','manifests','records'],HASH=/^[a-f0-9]{64}$/;
function failure(message,phase='open',committed=false,cause){const error=new Error(message,{cause});Object.assign(error,{phase,committed,verified:false});return error;}
function bytes(value){if(!(value instanceof Uint8Array)||value.byteLength>ARCHIVE_MAX_BYTES)throw Error('Invalid or oversized checkpoint bytes.');return new Uint8Array(value);}
function same(a,b){return a.length===b.length&&a.every((v,i)=>v===b[i]);}
function hash(value){if(typeof value!=='string'||!HASH.test(value))throw Error('Invalid checkpoint digest.');return value;}

/** Explicit dedicated name required. No default database or automatic head. */
export function openBrowserRegionCheckpoints({name}={}){
  return new Promise((resolve,reject)=>{
    if(typeof name!=='string'||!/^mistbound-checkpoints-[a-zA-Z0-9_-]{1,100}$/.test(name)){reject(failure('A dedicated checkpoint database name is required.'));return;}
    if(!globalThis.indexedDB?.open){reject(failure('IndexedDB capability is unavailable.'));return;}
    let request,settled=false;
    const fail=error=>{if(settled)return;settled=true;reject(error);};
    try{request=globalThis.indexedDB.open(name,1);}catch(error){fail(failure('Cannot open checkpoint database.','open',false,error));return;}
    request.onblocked=()=>fail(failure('Checkpoint database upgrade is blocked. Close other connections.','blocked'));
    request.onerror=()=>fail(failure('Checkpoint database open failed.','open',false,request.error));
    request.onupgradeneeded=event=>{
      if(settled){request.transaction.abort();return;}
      if(event.oldVersion!==0){request.transaction.abort();return;}
      for(const store of STORES)request.result.createObjectStore(store);
    };
    request.onsuccess=()=>{
      const db=request.result;
      if(settled){db.close();return;}
      if([...db.objectStoreNames].join('|')!==[...STORES].sort().join('|')){db.close();fail(failure('Unexpected checkpoint database schema.'));return;}
      settled=true;resolve(connection(db));
    };
  });
}
function connection(db){
  let closed=false;const active=new Set();
  function close(){if(closed)return;closed=true;for(const tx of active){try{tx.abort();}catch{}}db.close();}
  db.onversionchange=close;db.onclose=()=>{closed=true;};
  function transaction(stores,mode,queue){
    if(closed)return Promise.reject(failure('Checkpoint connection is closed.','closed'));
    return new Promise((resolve,reject)=>{
      let tx,result,problem;
      try{tx=db.transaction(stores,mode);active.add(tx);}catch(error){reject(failure('Cannot start checkpoint transaction.','transaction',false,error));return;}
      const abort=error=>{problem=error;try{tx.abort();}catch{}};
      tx.oncomplete=()=>{active.delete(tx);resolve(result);};
      tx.onabort=()=>{active.delete(tx);reject(failure(problem?.message||tx.error?.message||'Checkpoint transaction aborted.','transaction',false,problem||tx.error));};
      // Request errors retain their default abort behavior. No early success signal.
      tx.onerror=()=>{};
      try{queue(tx,value=>{result=value;},abort);}catch(error){abort(error);}
    });
  }
  const get=(store,key)=>transaction([store],'readonly',(tx,done)=>{const request=tx.objectStore(store).get(key);request.onsuccess=()=>done(request.result);});
  async function read(checkpoint){
    hash(checkpoint);
    const record=await get('records',checkpoint);
    if(!record||record.checkpoint!==checkpoint)throw failure('Checkpoint record is missing or corrupt.','verification');
    const manifestBytes=bytes(await get('manifests',checkpoint));
    const verified=await decodeRegionCheckpoint({checkpoint,manifestBytes,readBlob:async(digest,length)=>{const value=bytes(await get('blobs',digest));if(value.length!==length)throw Error('Checkpoint dependency length mismatch.');return value;}});
    if(record.stateSha256!==verified.stateSha256)throw failure('Checkpoint record does not match its captured state.','verification');
    return verified;
  }
  async function save(text){
    // A string is an immutable capture. Never consult a later state object.
    if(closed)throw failure('Checkpoint connection is closed.','closed');
    const captured=text,blobs=new Map();let encoded;
    try{encoded=await encodeRegionCheckpoint({text:captured,writeBlob:(digest,value)=>blobs.set(digest,bytes(value)),readBlob:digest=>blobs.get(digest)});}
    catch(error){throw failure('Checkpoint encoding failed.','encode',false,error);}
    const record={checkpoint:encoded.checkpoint,stateSha256:encoded.stateSha256};
    await transaction(STORES,'readwrite',(tx,done,abort)=>{
      const entries=[...blobs].map(([key,value])=>['blobs',key,value]);entries.push(['manifests',encoded.checkpoint,encoded.bytes],['records',encoded.checkpoint,record]);
      // All requests are queued synchronously; callbacks only issue native requests.
      for(const [storeName,key,value]of entries){
        const store=tx.objectStore(storeName),request=store.get(key);
        request.onsuccess=()=>{
          try{
            if(request.result===undefined){store.add(value,key);return;}
            if(storeName==='records'){
              if(JSON.stringify(request.result)!==JSON.stringify(value))throw Error('Existing checkpoint record is corrupt.');
            }else if(!same(bytes(request.result),bytes(value)))throw Error('Existing content-addressed checkpoint object is corrupt.');
          }catch(error){abort(error);}
        };
      }
      done(record);
    });
    // oncomplete above is the commit acknowledgement, not a physical-disk promise.
    try{const verified=await read(encoded.checkpoint);return {...record,verified:true,committed:true,dependencies:verified.dependencies,dependencyBytes:verified.dependencyBytes};}
    catch(error){throw Object.assign(failure('Checkpoint committed, but readback verification failed.','verification',true,error),record);}
  }
  function list({limit=100,after}={}){
    if(!Number.isInteger(limit)||limit<1||limit>1000)return Promise.reject(failure('List limit must be1..1000.','list'));
    if(after!==undefined)hash(after);
    return transaction(['records'],'readonly',(tx,done,abort)=>{
      const rows=[],request=tx.objectStore('records').openCursor(after===undefined?undefined:IDBKeyRange.lowerBound(after,true));
      request.onsuccess=()=>{try{const cursor=request.result;if(!cursor||rows.length>=limit){done(rows);return;}const row=cursor.value;if(!row||row.checkpoint!==cursor.key)throw Error('Corrupt checkpoint listing record.');hash(row.checkpoint);hash(row.stateSha256);rows.push({...row,verified:false});if(rows.length===limit){done(rows);return;}cursor.continue();}catch(error){abort(error);}};
    });
  }
  return Object.freeze({name:db.name,save,read,list,close});
}
