# DapengKernel 博客使用手册

这份文档讲的是网站上能看到的几个主要入口怎么维护：文章、首页、归档、分类、标签、关于页、评论和导航。平时写博客不用碰主题代码，大多数内容都靠 Markdown 文件顶部的 front-matter 控制。

## 1. 你平时主要改哪里

最常用的是这个目录：

```text
D:\Acodes\dapengblog2.0\myblog\source\_posts
```

这里放所有文章。推荐用 Obsidian 或 Typora 直接打开它。

现在文章目录是这样分的：

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

这些文件夹只是本地整理用的，方便你自己找文章。网站上的“分类”和“标签”由文章顶部的 front-matter 决定，不是由文件夹名决定。

## 2. 新建文章

推荐用项目里的脚本创建文章，因为它会自动生成 front-matter 和图片文件夹。

进入博客目录：

```bash
cd /d/Acodes/dapengblog2.0/myblog
```

新建 Java 文章：

```bash
npm run new-post -- "Java 线程池基础" java
```

新建 Linux 文章：

```bash
npm run new-post -- "Linux 端口排查记录" linux
```

可用专题：

```text
java
linux
mysql
redis
spring-boot
blog
drafts
```

生成结果大概是：

```text
source/_posts/java/java-thread-pool-basics.md
source/_posts/java/java-thread-pool-basics/
```

`.md` 是文章。同名文件夹用来放这篇文章的图片。

## 3. 文章顶部的设置怎么写

每篇文章最顶部必须是 `---` 开始的 front-matter，中间不能有任何正文、空标题或说明。

正确写法：

```yaml
---
title: Java 线程池基础
date: 2026-09-10 20:30:00
updated: 2026-09-10 20:30:00
categories:
  - Java
tags:
  - Java
  - 并发
  - 线程池
description: 记录 Java 线程池的核心参数、执行流程和常见坑。
---
```

错误写法：

```markdown
# Java 线程池基础
---
title: Java 线程池基础
---
```

错的原因是：front-matter 没在文件最开头，Hexo 不会正确识别 `title`、`date`、`categories`、`tags`。

常用字段说明：

| 字段 | 作用 | 会影响哪里 |
| --- | --- | --- |
| `title` | 文章标题 | 首页文章卡片、文章详情、归档列表 |
| `date` | 发布时间 | 首页排序、归档年份月份、文章详情 |
| `updated` | 更新时间 | 文章详情里的“更新于” |
| `categories` | 分类 | 分类页、首页卡片分类、文章详情分类 |
| `tags` | 标签 | 标签页、首页卡片标签、文章详情标签 |
| `description` | 摘要 | 搜索、分享信息、部分页面摘要 |

## 4. 首页文章怎么控制

首页显示的是所有文章，默认按 `date` 从新到旧排序。

你可以通过 `date` 控制顺序：

```yaml
date: 2026-09-10 20:30:00
```

日期越新，越靠前。

首页摘要由 `<!-- more -->` 控制。它上面的内容会作为摘要展示，下面的内容进入文章详情页。

```markdown
这篇文章记录一次 Redis 缓存穿透问题的排查过程。

<!-- more -->

## 问题现象

这里开始写正文。
```

如果不写 `<!-- more -->`，主题会自动截取正文前面一段，但效果不如自己控制稳定。

## 5. 归档怎么来的

归档页地址：

```text
https://dapengblog.com/archives/
```

归档页不需要手动编辑。它会根据每篇文章的 `date` 自动按年份和日期排列。

比如三篇文章：

```yaml
date: 2026-09-10 10:00:00
```

```yaml
date: 2026-09-09 10:00:00
```

```yaml
date: 2025-12-20 10:00:00
```

归档页就会自动分成：

```text
2026
  09-10  文章 A
  09-09  文章 B

2025
  12-20  文章 C
```

如果你觉得归档里某篇文章位置不对，优先检查这篇文章的 `date`。

如果你想让归档更像“学习路线”，不要靠归档来做。归档适合按时间回看；学习路线更适合以后单独做一个页面，比如 `/roadmap/`。

## 6. 分类怎么用

分类页地址：

```text
https://dapengblog.com/categories/
```

分类适合放“大方向”，建议一篇文章只放一个主分类。比如：

```yaml
categories:
  - Java
```

```yaml
categories:
  - Linux
```

```yaml
categories:
  - MySQL
```

推荐你先固定这些分类：

```text
Java
Linux
MySQL
Redis
Spring Boot
博客记录
随笔
```

分类不要写得太碎。比如“线程池”“索引”“缓存穿透”这种更适合做标签。

可以写多级分类，但前期不建议这么复杂：

```yaml
categories:
  - Java
  - 并发
```

这会让分类结构变深，文章少的时候反而显得乱。

## 7. 标签怎么用

标签页地址：

```text
https://dapengblog.com/tags/
```

标签适合描述文章的关键词，一篇文章可以有多个标签。

例如：

```yaml
tags:
  - Java
  - 并发
  - 线程池
  - 面试
```

标签可以比分类细。推荐规则：

- 分类回答“这篇文章属于哪个大方向”。
- 标签回答“这篇文章具体讲了哪些点”。

示例：

```yaml
categories:
  - Redis
tags:
  - Redis
  - 缓存穿透
  - 布隆过滤器
  - 高并发
```

再比如：

```yaml
categories:
  - MySQL
tags:
  - MySQL
  - 索引
  - 执行计划
  - SQL 优化
```

## 8. 文章 URL 怎么来的

当前博客文章链接格式是：

```text
https://dapengblog.com/年份/月/日/文件名/
```

由 `_config.yml` 里的这个配置控制：

```yaml
permalink: :year/:month/:day/:name/
```

比如文件是：

```text
source/_posts/java/thread-pool.md
```

日期是：

```yaml
date: 2026-09-10 20:30:00
```

最后链接就是：

```text
https://dapengblog.com/2026/09/10/thread-pool/
```

注意：`java` 这个本地目录不会出现在 URL 里。

## 9. 图片怎么放

推荐每篇文章一个同名图片文件夹。

文章：

```text
source/_posts/java/thread-pool.md
```

图片：

```text
source/_posts/java/thread-pool/thread-flow.png
```

Markdown 引用：

```markdown
![线程池执行流程](./thread-pool/thread-flow.png)
```

图片文件名建议用英文、小写、短横线：

```text
thread-flow.png
redis-cache-penetration.png
mysql-index-leftmost-prefix.png
```

少用中文、空格、括号。能用，但以后迁移和部署更容易出小问题。

## 10. 关于页怎么编辑

关于页文件在：

```text
D:\Acodes\dapengblog2.0\myblog\source\about\index.md
```

你可以用 Typora 或 Obsidian 打开它，像普通 Markdown 一样编辑。

这个页面对应导航里的“关于”：

```text
https://dapengblog.com/about/
```

## 11. 导航栏怎么改

导航配置在：

```text
D:\Acodes\dapengblog2.0\myblog\_config.redefine.yml
```

找到这段：

```yaml
navbar:
  links:
    归档:
      path: /archives/
      icon: fa-solid fa-box-archive
```

如果想改显示文字，比如把“归档”改成“时间线”，就改这里的名字：

```yaml
navbar:
  links:
    时间线:
      path: /archives/
      icon: fa-solid fa-box-archive
```

如果想隐藏某个导航，先不要直接删，建议在前面加 `#` 注释掉。以后想恢复也方便。

## 12. 评论怎么控制

评论系统现在用的是 Waline。配置在：

```text
D:\Acodes\dapengblog2.0\myblog\_config.redefine.yml
```

对应位置：

```yaml
comment:
  enable: true
  system: waline
  config:
    waline:
      serverUrl: https://comment.dapengblog.com:8443
      lang: zh-CN
```

想关闭全站评论：

```yaml
comment:
  enable: false
```

想恢复：

```yaml
comment:
  enable: true
```

一般不用改 `serverUrl`，这个已经指向你的服务器评论服务。

## 13. 本地预览

在博客目录运行：

```bash
cd /d/Acodes/dapengblog2.0/myblog
npm run server
```

打开：

```text
http://localhost:4000
```

如果改了配置或者页面不刷新，先清理再预览：

```bash
npm run clean
npm run server
```

正式构建检查：

```bash
npm run build
node tools/verify-local.cjs
```

## 14. 发布到线上

写完文章后，在外层仓库提交：

```bash
cd /d/Acodes/dapengblog2.0
git status
git add .
git commit -m "post: add redis cache note"
git push
```

推送后 GitHub Actions 会自动部署到服务器。等 Actions 跑完，访问：

```text
https://dapengblog.com
```

## 15. 推荐写作习惯

一篇技术文章建议这样组织：

```markdown
---
title: Redis 缓存穿透怎么处理
date: 2026-09-10 20:30:00
updated: 2026-09-10 20:30:00
categories:
  - Redis
tags:
  - Redis
  - 缓存穿透
  - 布隆过滤器
description: 记录缓存穿透的原因、常见解决方案和实际项目里的取舍。
---

这篇文章记录 Redis 缓存穿透问题的成因和处理方式。

<!-- more -->

## 问题是什么

## 为什么会发生

## 常见解决方案

## 项目里怎么选

## 总结
```

前期建议你先把分类控制少一点，标签稍微细一点。等文章多了，再考虑加“专题页”或“学习路线页”。
