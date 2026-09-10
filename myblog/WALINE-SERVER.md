# DapengKernel 评论服务

服务器：43.130.28.104，Debian 13。部署目录：`/opt/waline`。

## 已配置

- Waline + PostgreSQL 17，通过 Docker Compose 运行，镜像固定到本次拉取的 digest。
- PostgreSQL 数据目录：`/opt/waline/postgres`；数据库没有向公网映射端口。
- Waline 只监听 `127.0.0.1:8360`；Xray 原有的 443 端口保持不变。
- Nginx 已配置 80 端口的证书验证路径；8443 HTTPS 配置已准备，等待域名解析和证书。
- 管理员邮箱：`wangpengju2026@163.com`。随机生成的独立登录密码仅保存在服务器 `/opt/waline/admin-credentials.txt`，权限为 600；未使用服务器 root 密码。
- 容器自动重启、Nginx 开机启动、证书续期 timer 与续期后 Nginx reload hook 已配置。
- 每天服务器当地时间 04:15 自动备份 PostgreSQL，保留约两周；目录 `/opt/waline/backups`。这是本机备份，重要数据建议另存至异地。
- 最初 SQLite 方案在官方镜像中触发 native addon 异常，已改用 PostgreSQL；`/opt/waline/data` 是停用的初始化文件，不是当前数据源。

## 你完成域名解析后

1. 新增 A 记录：`comment` → `43.130.28.104`。保留原有其他解析。若使用 Cloudflare，初次验证先选择仅 DNS；不要添加指向其他机器的 AAAA 记录。
2. 云服务器安全组允许公网 TCP 80、8443。不要将 8360 或数据库端口开放到公网。
3. SSH 登录服务器执行：

```bash
bash /opt/waline/enable-https.sh
```

脚本会先检查 DNS，再用 Certbot 申请证书；首次申请按提示处理服务条款。成功后会启用 HTTPS 8443，测试 Nginx 配置并重新加载。不会停止 Xray，也不会配置 Nginx 监听 443。

4. 管理后台为 `https://comment.dapengblog.com:8443/ui`。在你自己的 SSH 终端读取登录信息：

```bash
cat /opt/waline/admin-credentials.txt
```

请不要把这份密码文件提交到博客仓库或贴进聊天。邮箱通知尚未配置；登录邮箱并不等于已接入 SMTP。

## 博客端

`_config.redefine.yml` 的 `comment.config.waline.serverUrl` 已设置为 `https://comment.dapengblog.com:8443`，保留你当前开启的评论开关。DNS 和证书完成之前，页面可能显示评论加载失败；这是尚未完成公网接入，不是后端未启动。

接通后，在本地重新生成博客，在文章下提交测试评论，刷新确认可见，再去后台删除测试评论。当前没有部署博客到服务器。

## 日常维护

```bash
cd /opt/waline
docker compose ps
docker compose logs --tail 50 waline
systemctl list-timers waline-backup.timer certbot.timer
bash /opt/waline/backup.sh
```

后台登录信息与数据库密钥存放在服务器上，请不要分享完整 `docker inspect` 或展开后的 `docker compose config` 输出，它们可能包含密钥。

更新镜像前先备份数据库，显式选择新版本并更新 compose.yaml 的镜像 digest；不要删除 postgres 目录。HTTPS 接通后可运行 `certbot renew --dry-run` 检查续期。
