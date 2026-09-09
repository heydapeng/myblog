# DapengKernel 本地维护

本次沿用 Hexo 8 + Redefine 2.9，保留 Hello World 正文，新增六篇起步笔记。没有推送或部署。

## 文件说明

- `_config.yml`：统一标题、作者、关键词。站点 URL 与原主题已有的 `https://dapengblog.com` 对齐；这是沿用配置，不代表本次已验证域名归属或上线状态。
- `_config.redefine.yml`：配置本地标志、青色强调色、页脚、样式注入；保留原头像 `/images/h.png` 和原有固定背景 Hero 首屏及下滑效果；关闭作者等级、评论占位服务、访问统计和运行计时。
- `source/about/index.md`：个人介绍、技术方向、写作目的、内容范围、已有 GitHub 与未公开 Email 说明。
- `source/categories/index.md`、`source/tags/index.md`：中文标题、明确的 `type` 和说明；列表及数量仍由真实文章生成。
- `source/_posts/hello-world.md`：只补充日期、分类、标签、描述。日期沿用修改前 Hexo 数据库记录，正文保留。
- `source/_posts/` 中另外六篇 Markdown：JVM、Java 并发、Spring Boot、Redis、MySQL、Linux 起步笔记，日期为本次整理日，不冒充历史写作。
- `source/images/logo.svg`、`favicon.svg`：本地绘制的几何 D 标志，深蓝底、白色 D、青绿色内核方块。
- `source/images/apple-touch-icon.png`：180×180 图标；`social-card.png`：1200×630 分享卡片。
- `source/css/custom.css`：品牌对齐、正文宽度与留白、标签清晰度、页脚居中与窄屏细节。
- `themes/redefine/layout/components/header/head.ejs`：移除把 SVG 错报成 PNG 的重复声明，独立接入 Apple 图标；favicon 由 Hexo helper 根据 SVG 路径输出。
- `themes/redefine/layout/components/header/navbar.ejs`：Logo 补充替代文本与尺寸。
- `scaffolds/post.md`：为后续新文章预留分类、标签和摘要。
- `tools/verify-local.cjs`：检查生成页面、静态资源、文章数量以及隐藏统计项。
- `db.json`、`public/`：Hexo 自动生成，不要手工改。

## 继续写作

执行 `npx hexo new "文章标题"`，填写新文章的 `categories`、`tags` 和 `description`。建议每篇使用一个主分类和少量相关标签，沿用已有拼写；只有真正写到 Docker 时再添加 Docker 标签。

在正文引言后插入 `<!-- more -->`，首页会把之前的文字作为摘要。不要为增加计数而创建空分类或空标签。多项平铺分类需要使用 Hexo 的嵌套数组语法，普通数组会建立分类层级。

## 本地检查

```bash
npx hexo clean
npx hexo generate
node tools/verify-local.cjs
npx hexo server --ip 127.0.0.1 --port 4000
```

浏览 `http://127.0.0.1:4000/`，以及 `/archives/`、`/categories/`、`/tags/`、`/about/` 和任意文章。修改主配置后重启预览服务。主题联网检查新版本失败不影响静态生成。

## 统计的来源

文章数取自主题原有 `site.posts.length`；侧栏分类数和标签数分别使用 `site.categories.length`、`site.tags.length`。分类、标签详情页也由 Hexo 生成，无手写统计数字。

默认访问服务为 Vercount，兼容 busuanzi DOM ID。本次未验证正式站点的统计归属和准确性，因此设置 `global.website_counter.enable: false`，不加载计数脚本、不展示访问数字。以后核实服务与正式域名后，再通过这一原生配置开启，并检查响应和展示；不要手填数字。

建站日期尚未确认，`footer.runtime: false` 且 `footer.start` 留空。未来若恢复计时，先填写真实日期。未安装字数插件，因此文章字数/阅读时间关闭；页脚本身在缺少字数 helper 时不展示字数。

## 更新主题时

大部分定制在站点配置和 source 下。更新 Redefine 后，检查两个 header 模板的少量修改是否仍保留，重新构建并检查图标。站点路径当前按根域名部署设计；若以后改为子目录，需同步调整注入 CSS 和 About 内部链接路径。本次不涉及部署。
