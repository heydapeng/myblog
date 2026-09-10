---
title: MySQL 联合索引：从查询条件出发
date: 2026-09-09 15:30:00
categories: [数据与缓存]
tags: [MySQL]
description: 用订单查询理解联合索引的列顺序，并通过执行计划检查自己的判断。
---

给每个查询字段单独建索引，并不意味着查询就会变快。先写清筛选和排序方式，再考虑索引顺序。

<!-- more -->

## 从一条查询开始

```sql
SELECT id, created_at
FROM orders
WHERE user_id = 42
ORDER BY created_at DESC
LIMIT 20;
```

对于这个查询，可以在测试库评估 `(user_id, created_at)`：先按用户缩小范围，再沿时间顺序读取。这只是候选设计，效果还与数据分布和已有索引有关。

```sql
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at);
EXPLAIN SELECT id, created_at
FROM orders
WHERE user_id = 42
ORDER BY created_at DESC
LIMIT 20;
```

## 列顺序不能随意交换

联合索引可以使用最左侧的连续列前缀。`(user_id, created_at)` 与 `(created_at, user_id)` 支持的访问路径不同。只按时间查全部订单，不能直接照搬按用户查询的判断。基础规则见 [MySQL 8.4 联合索引文档](https://dev.mysql.com/doc/refman/8.4/en/multiple-column-indexes.html)。

## 看证据再保留索引

在接近实际规模的数据上，记录执行计划与响应时间，比较新增索引前后表现。也要观察写入成本和索引占用，避免为了很少执行的查询不断堆叠索引。

示例中的表和数据需要自行准备；这里没有跑出某个固定的性能倍数。实际评估时应同时保存表结构、数据量和测试条件，方便以后复查。
