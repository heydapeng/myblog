# DapengKernel 部署说明

当前博客静态文件已部署到服务器：

- 服务器：43.130.28.104
- 站点目录：/var/www/dapengblog/current
- 发布版本目录：/var/www/dapengblog/releases
- Nginx 站点：/etc/nginx/sites-available/dapengblog-http
- HTTP 会自动跳转到 HTTPS
- HTTPS 访问域名：https://dapengblog.com 和 https://www.dapengblog.com

## DNS

在域名解析里设置：

```text
dapengblog.com      A     43.130.28.104
www.dapengblog.com  A     43.130.28.104
```

目前根域名和 www 都已指向新服务器。

## 安全组

云服务器安全组入站需要放行：

```text
TCP 22
TCP 80
TCP 443
TCP 8443
TCP 2053
```

来源可以先用 `0.0.0.0/0`。`2053` 是当前 Xray 代理端口，`443` 是博客 HTTPS 端口，`8443` 是评论后台 HTTPS 端口。

## 更新博客

在本地博客目录执行：

```powershell
powershell -ExecutionPolicy Bypass -File tools\deploy-blog.ps1
```

脚本会重新生成 Hexo 静态文件，上传到服务器，创建新的发布时间目录，并让 Nginx 指向新版本。

## GitHub Actions 自动部署

项目已添加 `.github/workflows/deploy.yml`。推送到 GitHub 的 `master` 分支后，Actions 会自动：

```text
npm ci
npx hexo clean && npx hexo generate
打包 public
上传到服务器
切换 /var/www/dapengblog/current
重载 Nginx
```

GitHub 仓库需要配置这些 Secrets：

```text
DEPLOY_HOST=43.130.28.104
DEPLOY_PORT=22
DEPLOY_USER=root
DEPLOY_SSH_KEY=部署私钥内容
```

不要把服务器密码写进 GitHub，也不要把私钥提交到仓库。

生成部署密钥的推荐方式：

```powershell
ssh-keygen -t ed25519 -C "github-actions-dapengblog" -f .deploy-key -N ""
type .deploy-key.pub
```

把 `.deploy-key.pub` 输出的一整行追加到服务器：

```bash
mkdir -p /root/.ssh
chmod 700 /root/.ssh
echo '这里粘贴 .deploy-key.pub 的整行内容' >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
```

再把 `.deploy-key` 的完整内容填到 GitHub 的 `DEPLOY_SSH_KEY` Secret。填完后可以删除本地 `.deploy-key` 和 `.deploy-key.pub`。

## HTTPS 说明

当前已经给 `dapengblog.com` 和 `www.dapengblog.com` 申请了 Let's Encrypt 证书，并配置到 Nginx 的标准 `443` 端口：

```text
https://dapengblog.com
https://www.dapengblog.com
```

Xray 已从 `443` 挪到 `2053`，所以代理客户端需要使用新的代理端口。
