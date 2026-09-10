"use strict";

const fs = require("fs");
const path = require("path");

const [, , rawTitle, rawTopic = "drafts"] = process.argv;

if (!rawTitle) {
  console.error('Usage: npm run new-post -- "文章标题" <topic>');
  console.error("Topics: java, linux, mysql, redis, spring-boot, blog, drafts");
  process.exit(1);
}

const topicMap = {
  java: { dir: "java", category: "Java 基础", tags: ["Java"] },
  linux: { dir: "linux", category: "运行与排障", tags: ["Linux"] },
  mysql: { dir: "mysql", category: "数据与缓存", tags: ["MySQL"] },
  redis: { dir: "redis", category: "数据与缓存", tags: ["Redis"] },
  "spring-boot": { dir: "spring-boot", category: "后端实践", tags: ["Java", "Spring Boot"] },
  blog: { dir: "blog", category: "博客记录", tags: ["Hexo"] },
  drafts: { dir: "drafts", category: "", tags: [] },
};

const topic = topicMap[rawTopic] || topicMap.drafts;
const title = rawTitle.trim();

const slug = title
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
  .replace(/^-+|-+$/g, "") || `post-${Date.now()}`;

const postsDir = path.join(process.cwd(), "source", "_posts", topic.dir);
const assetDir = path.join(postsDir, slug);
const postPath = path.join(postsDir, `${slug}.md`);

if (fs.existsSync(postPath)) {
  console.error(`Post already exists: ${postPath}`);
  process.exit(1);
}

fs.mkdirSync(assetDir, { recursive: true });

const now = new Date();
const pad = (value) => String(value).padStart(2, "0");
const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
const categories = topic.category ? `[${topic.category}]` : "[]";
const tags = topic.tags.length ? `[${topic.tags.join(", ")}]` : "[]";

const content = `---
title: ${title}
date: ${date}
categories: ${categories}
tags: ${tags}
description:
---

在这里写摘要。首页会展示 more 上面的内容。

<!-- more -->

## 小标题

正文从这里开始。
`;

fs.writeFileSync(postPath, content, "utf8");

console.log(`Created: ${postPath}`);
console.log(`Assets:  ${assetDir}`);
console.log("");
console.log("Image usage:");
console.log(`  ![图片说明](./${slug}/example.png)`);
