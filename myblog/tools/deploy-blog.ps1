$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$archive = Join-Path $root "deploy-dapengblog-public.tar.gz"
$remote = "root@43.130.28.104"
$remoteArchive = "/tmp/dapengblog-public.tar.gz"

Push-Location $root
try {
  node node_modules/hexo/bin/hexo clean
  node node_modules/hexo/bin/hexo generate
  tar -czf $archive -C public .
  scp -o UserKnownHostsFile=NUL -o StrictHostKeyChecking=accept-new $archive "${remote}:${remoteArchive}"
  ssh -o UserKnownHostsFile=NUL -o StrictHostKeyChecking=accept-new $remote @'
set -e
release="/var/www/dapengblog/releases/$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$release" /var/www/dapengblog/releases
tar -xzf /tmp/dapengblog-public.tar.gz -C "$release"
chown -R www-data:www-data /var/www/dapengblog
ln -sfn "$release" /var/www/dapengblog/current
nginx -t
systemctl reload nginx
find /var/www/dapengblog/releases -mindepth 1 -maxdepth 1 -type d | sort | head -n -5 | xargs -r rm -rf
curl -H "Host: dapengblog.com" -I --max-time 10 http://127.0.0.1/
'@
}
finally {
  Pop-Location
}
