// Run after generation: node tools/verify-local.cjs
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const yaml = require('js-yaml');
const db = JSON.parse(fs.readFileSync('db.json', 'utf8')).models;
const theme = yaml.load(fs.readFileSync('_config.redefine.yml', 'utf8'));
assert.equal(theme.global.website_counter.enable, false);
assert.equal(theme.footer.runtime, false);
assert.equal(theme.comment.enable, false);
const files = ['index.html', 'archives/index.html', 'categories/index.html', 'tags/index.html', 'about/index.html'];
function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
}
files.push(...walk('public/2026').filter(f => f.endsWith('.html')).map(f => path.relative('public',f)));
for (const file of files) {
  const html = fs.readFileSync(path.join('public', file), 'utf8');
  assert.ok(html.includes('DapengKernel'), file);
  assert.ok(html.includes('/css/custom.css'), file);
  assert.ok(!html.includes('id="runtime_days"'), file);
  assert.ok(!html.includes('id="busuanzi_value_site_uv"'), file);
  assert.ok(!html.includes('src="https://cn.vercount.one/js"'), file);
  assert.ok(html.includes(`共撰写了 ${db.Post.length} 篇文章`), file);
  for (const match of html.matchAll(/(?:src|href)="(\/(?!\/)[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const local = decodeURIComponent(match[1]);
    assert.ok(fs.existsSync(path.join('public',local)), `${file}: missing ${local}`);
  }
}
for (const [model, route] of [['Category','categories'], ['Tag','tags']]) {
  const html = fs.readFileSync(`public/${route}/index.html`, 'utf8');
  for (const item of db[model]) assert.ok(html.includes(item.name), item.name);
}
console.log(`Verified ${files.length} pages; ${db.Post.length} posts, ${db.Category.length} categories, ${db.Tag.length} tags. Local resources resolve.`);
