# DapengKernel 博客写作说明

这个博客现在已经清空旧文章，可以从零开始写。当前没有任何文章时，首页仍会正常显示原来的 hero 区域；等你发布第一篇文章后，首页会自动显示文章列表。以后你主要只需要关心两个地方：

```text
D:\Acodes\dapengblog2.0\myblog\source\_posts
D:\Acodes\dapengblog2.0\myblog\WRITING.md
```

`source/_posts` 是文章区，推荐直接用 Obsidian 或 Typora 打开这个目录写。`WRITING.md` 就是这份说明，忘了流程时回来看看就行。

## 目录怎么用

现在保留了这些空目录：

```text
source/_posts/
  java/          Java、JVM、并发、后端基础
  linux/         Linux、服务器、排障、命令记录
  mysql/         MySQL、索引、SQL、数据库问题
  redis/         Redis、缓存、分布式相关
  spring-boot/   Spring Boot、项目结构、工程实践
  blog/          博客折腾记录、部署、主题修改
  drafts/        草稿区，还没准备发布的文章
```

这些目录只是为了让你本地写作更舒服。网站里的“分类”和“标签”不是由目录决定的，而是由每篇文章开头的 front-matter 决定。

比如一篇文章放在：

```text
source/_posts/java/thread-pool.md
```

但它页面里真正显示的分类来自文章顶部：

```yaml
categories:
  - Java

tags:
  - 并发
  - 线程池
```

## 推荐的新建文章方式

在 Git Bash 里进入博客目录：

```bash
cd /d/Acodes/dapengblog2.0/myblog
```

新建一篇 Java 文章：

```bash
npm run new-post -- "Java 线程池基础" java
```

新建一篇 Linux 文章：

```bash
npm run new-post -- "Linux 排障记录" linux
```

第二个参数就是专题目录，可以用：

```text
java
linux
mysql
redis
spring-boot
blog
drafts
```

脚本会自动创建两个东西：

```text
source/_posts/java/java-thread-pool-basics.md
source/_posts/java/java-thread-pool-basics/
```

`.md` 是文章正文；同名文件夹是这篇文章专用的图片文件夹。

## 文章开头怎么写

每篇文章最上面都有一段 front-matter，长这样：

```yaml
---
title: Java 线程池基础
date: 2026-09-10 20:30:00
updated: 2026-09-10 20:30:00
categories:
  - Java
tags:
  - 并发
  - 线程池
description: 记录 Java 线程池的核心参数、执行流程和常见坑。
---
```

常用字段说明：

- `title`：文章标题，页面上会显示。
- `date`：发布时间。
- `updated`：更新时间，改文章后可以手动更新。
- `categories`：分类，建议一篇文章只放一个主分类。
- `tags`：标签，可以放多个。
- `description`：文章摘要，首页和搜索里会用到。

正文里建议在开头一两段后放一个分隔标记：

```markdown
<!-- more -->
```

这个标记前面的内容会作为首页摘要，后面的内容进入文章详情页。

## 图片怎么放

推荐每篇文章的图片都放到文章同名文件夹里。比如文章是：

```text
source/_posts/java/thread-pool.md
```

图片就放这里：

```text
source/_posts/java/thread-pool/thread-flow.png
```

Markdown 里这样引用：

```markdown
![线程池执行流程](./thread-pool/thread-flow.png)
```

图片文件名建议用英文、小写、短横线，比如：

```text
thread-flow.png
redis-cache-penetration.png
mysql-index-leftmost-prefix.png
```

不建议图片文件名里带中文、空格、括号。不是不能用，是以后迁移、部署、复制路径时更容易出小毛病。

## 用 Obsidian 写

最简单的方式：

1. 用 Obsidian 打开这个目录：

   ```text
   D:\Acodes\dapengblog2.0\myblog\source\_posts
   ```

2. 新文章先用命令创建，别直接手动新建空白 md。这样 front-matter 和图片文件夹都会自动准备好。

3. 在 Obsidian 里打开生成的 `.md` 文件，正常写 Markdown。

4. 要插图时，把图片复制到文章同名文件夹，再用相对路径引用。

Obsidian 很适合长期写笔记。你的这些专题目录以后会越来越像一个知识库，博客只是从里面挑文章发布出去。

## 用 Typora 写

Typora 也可以直接打开：

```text
D:\Acodes\dapengblog2.0\myblog\source\_posts
```

建议流程和 Obsidian 一样：先用命令创建文章，再用 Typora 打开生成的 `.md` 文件。

插入图片时，推荐手动把图片复制进同名文件夹，然后在文章里写相对路径。这样部署到服务器后图片一定能跟着文章一起走。

## 本地预览

写完后，在博客目录运行：

```bash
cd /d/Acodes/dapengblog2.0/myblog
npm run server
```

然后打开：

```text
http://localhost:4000
```

如果页面没刷新，可以先停掉服务，再运行：

```bash
npm run clean
npm run server
```

检查生产构建：

```bash
npm run build
node tools/verify-local.cjs
```

这一步能提前发现一些明显问题，比如资源路径丢失、图片没有被生成出来、评论配置被改坏等。

## 发布到线上

你的项目已经关联 GitHub Actions。平时写完文章后，在外层仓库提交并推送：

```bash
cd /d/Acodes/dapengblog2.0
git status
git add .
git commit -m "post: add java thread pool article"
git push
```

推送成功后，GitHub Actions 会自动构建并部署到服务器。等 Actions 跑完，访问：

```text
https://dapengblog.com
```

## 草稿怎么处理

如果文章还没写完，可以先放在：

```text
source/_posts/drafts
```

但注意：只要 `.md` 文件在 `source/_posts` 下面，Hexo 默认就会生成到网站。也就是说，`drafts` 只是本地目录名，不代表不会发布。

如果你想暂时不发布，有两个办法：

1. 先不要提交这篇草稿。
2. 把文件名临时改成 `.txt`，写完后再改回 `.md`。

最省心的做法是：写完、预览没问题，再提交推送。

## 删除文章

删除一篇文章时，删两个东西：

```text
source/_posts/java/thread-pool.md
source/_posts/java/thread-pool/
```

也就是文章 `.md` 和它的同名图片文件夹都删掉。然后提交并推送即可。

## 不要改哪些东西

日常写博客时，尽量只动这些：

```text
source/_posts/**
source/images/**
```

不要手动改：

```text
public/**
node_modules/**
themes/**
.github/workflows/**
```

`public` 是 Hexo 自动生成的成品目录，GitHub Actions 部署时会重新生成。你平时写文章，不需要管它。

## 一次完整写作流程

下面是一篇文章从创建到发布的完整例子：

```bash
cd /d/Acodes/dapengblog2.0/myblog
npm run new-post -- "Redis 缓存穿透怎么处理" redis
```

打开生成的文件：

```text
D:\Acodes\dapengblog2.0\myblog\source\_posts\redis\redis-cache-penetration.md
```

写正文，放图片，预览：

```bash
npm run server
```

确认没问题后发布：

```bash
cd /d/Acodes/dapengblog2.0
git add .
git commit -m "post: add redis cache penetration"
git push
```

然后等 GitHub Actions 跑完，网站就会更新。

