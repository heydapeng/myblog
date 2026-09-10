// Run after generation: node tools/verify-local.cjs
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const yaml = require('js-yaml');

const db = JSON.parse(fs.readFileSync('db.json', 'utf8')).models;
const theme = yaml.load(fs.readFileSync('_config.redefine.yml', 'utf8'));

assert.equal(theme.global.website_counter.enable, false);

if (theme.comment.enable) {
  assert.equal(theme.comment.system, 'waline');
  assert.equal(theme.comment.config.waline.serverUrl, 'https://comment.dapengblog.com:8443');
}

const files = ['index.html', 'archives/index.html', 'categories/index.html', 'tags/index.html', 'about/index.html'];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

files.push(
  ...walk('public/2026')
    .filter((file) => file.endsWith('.html'))
    .map((file) => path.relative('public', file))
);

for (const file of files) {
  const htmlPath = path.join('public', file);
  assert.ok(fs.existsSync(htmlPath), `missing generated page: ${file}`);

  const html = fs.readFileSync(htmlPath, 'utf8');

  assert.ok(html.includes('DapengKernel'), file);
  assert.ok(html.includes('/css/custom.css'), file);
  assert.equal(html.includes('id="runtime_days"'), theme.footer.runtime === true, file);
  assert.ok(!html.includes('id="busuanzi_value_site_uv"'), file);
  assert.ok(!html.includes('src="https://cn.vercount.one/js"'), file);
  assert.ok(html.includes(`共撰写了 ${db.Post.length} 篇文章`), file);

  for (const match of html.matchAll(/(?:src|href)="(\/(?!\/)[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const local = decodeURIComponent(match[1]);
    const resolved = path.join('public', local);
    const exists = fs.existsSync(resolved) || fs.existsSync(path.join(resolved, 'index.html'));
    assert.ok(exists, `${file}: missing ${local}`);
  }
}

for (const [model, route] of [['Category', 'categories'], ['Tag', 'tags']]) {
  const html = fs.readFileSync(`public/${route}/index.html`, 'utf8');
  for (const item of db[model]) assert.ok(html.includes(item.name), item.name);
}

console.log(`Verified ${files.length} pages; ${db.Post.length} posts, ${db.Category.length} categories, ${db.Tag.length} tags. Local resources resolve.`);
