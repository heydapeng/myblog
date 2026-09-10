# 写作工作流

推荐用 Obsidian 或 Typora 直接打开这个目录：

```text
D:\Acodes\dapengblog2.0\myblog\source\_posts
```

文章按专题放在子目录里：

```text
source/_posts/
  java/
  linux/
  mysql/
  redis/
  spring-boot/
  blog/
  drafts/
```

目录只负责本地文件管理；网站上的分类和标签仍然由每篇文章开头的 front-matter 决定。
文章网址使用文件名生成，不会把专题目录带进 URL。

## 新建文章

在 `myblog` 目录执行：

```powershell
npm run new-post -- "文章标题" java
```

第二个参数是专题目录，可选：

```text
java
linux
mysql
redis
spring-boot
blog
drafts
```

脚本会同时生成：

```text
source/_posts/java/文章-slug.md
source/_posts/java/文章-slug/
```

图片放到同名文件夹里，在 Markdown 中用相对路径引用：

```markdown
![图片说明](./文章-slug/example.png)
```

## 编辑和预览

用 Obsidian 或 Typora 修改 `.md` 文件即可。预览网站效果：

```powershell
npm run server
```

浏览器打开：

```text
http://localhost:4000
```

## 发布

写完后在外层 Git 仓库目录提交：

```powershell
cd D:\Acodes\dapengblog2.0
git add .
git commit -m "post: add article"
git push
```

GitHub Actions 会自动构建并部署到服务器。
