# 自托管

把 `dist/` 作为静态站点根目录。服务器需以 JavaScript MIME 类型提供 `.mjs`，以 `application/wasm` 提供 `.wasm`。图包导入依赖浏览器的 Web Crypto 与 IndexedDB。公网请使用 HTTPS，本机可使用 `http://127.0.0.1`。单机模式只需要静态站点。

## 账户与多人房间

`node account/server.mjs` 启动账户服务。通过环境变量配置 `ACCOUNT_DB`、`ACCOUNT_BACKUP_DIR`、`PUBLIC_ORIGIN`、`NG_ORIGIN`、`COOKIE_DOMAIN`、`SESSION_SECRET`、`PROXY_SECRET` 及 Discord 应用的 `DISCORD_CLIENT_ID`、`DISCORD_CLIENT_SECRET`、`DISCORD_GUILD_ID` 和 `DISCORD_ROLE_ID`。Discord 回调地址使用本站的 `/account/callback`。各部署自行生成密钥。

`node multiplayer/server/multiplayer.mjs` 启动房间服务，使用 `MP_DB`、`MP_HOST`、`MP_PORT`、`PUBLIC_ORIGIN`、`NG_ORIGIN` 与相同的 `SESSION_SECRET`。服务端的 `multiplayer/web/` 与房间逻辑配套。

在同一站点把 `/account/` 转发到账户服务（默认 `127.0.0.1:18530`），把 `/multiplayer/api/` 转发到房间服务（默认 `127.0.0.1:18536`）。可信代理负责覆盖账户服务要求的 `X-MB-Proxy` 请求头，值取自服务端的 `PROXY_SECRET`。多人房间的事件流需要关闭响应缓冲。数据库和备份目录放在静态站点目录之外。
