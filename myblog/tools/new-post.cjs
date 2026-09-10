"use strict";

const fs = require("fs");
const path = require("path");

const [, , rawTitle, rawTopic = "drafts"] = process.argv;

const topicMap = {
  java: { dir: "java", category: "Java", tags: ["Java"] },
  linux: { dir: "linux", category: "Linux", tags: ["Linux"] },
  mysql: { dir: "mysql", category: "MySQL", tags: ["MySQL", "数据库"] },
  redis: { dir: "redis", category: "Redis", tags: ["Redis", "缓存"] },
  "spring-boot": { dir: "spring-boot", category: "Spring Boot", tags: ["Java", "Spring Boot"] },
  blog: { dir: "blog", category: "博客记录", tags: ["Hexo", "博客"] },
  drafts: { dir: "drafts", category: "草稿", tags: [] },
};

if (!rawTitle) {
  console.error('Usage: npm run new-post -- "文章标题" <topic>');
  console.error(`Topics: ${Object.keys(topicMap).join(", ")}`);
  process.exit(1);
}

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
const categoryLines = topic.category ? `  - ${topic.category}` : "";
const tagLines = topic.tags.map((tag) => `  - ${tag}`).join("\n");

const content = `---
title: ${title}
date: ${date}
updated: ${date}
categories:
${categoryLines || "  - 未分类"}
tags:
${tagLines || "  - 随笔"}
description: 这里写一句话摘要。
---

这里写文章摘要。首页会展示 \`<!-- more -->\` 上面的内容。

<!-- more -->

## 背景

这篇文章想解决什么问题？

## 正文

从这里开始写正文。

## 总结

最后记录结论、坑点或者后续可以补充的内容。
`;

fs.writeFileSync(postPath, content, "utf8");

console.log(`Created: ${postPath}`);
console.log(`Assets:  ${assetDir}`);
console.log("");
console.log("Image usage:");
console.log(`  ![图片说明](./${slug}/example.png)`);
