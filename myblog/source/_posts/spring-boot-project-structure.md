---
title: Spring Boot 项目分层：先把职责边界说清楚
date: 2026-09-09 15:10:00
categories: [后端实践]
tags: [Java, Spring Boot, 系统设计]
description: 用一个订单模块梳理接口层、业务层和数据访问层，避免目录整齐但职责混乱。
---

项目分层的意义，是让修改落在容易预期的位置。目录名称只是起点，代码之间的依赖关系才决定维护成本。

<!-- more -->

## 一个够用的起点

```text
com.dapeng.blog
├── BlogApplication.java
├── order
│   ├── OrderController.java
│   ├── OrderService.java
│   ├── OrderRepository.java
│   └── CreateOrderRequest.java
└── shared
    └── error
```

启动类放在根包，业务代码位于它的子包中，便于默认组件扫描覆盖。Spring Boot 不强制某一种项目布局，可参考[官方代码组织说明](https://docs.spring.io/spring-boot/reference/using/structuring-your-code.html)。

## 按变化原因划分职责

我的起步方案是：Controller 处理请求与响应，Service 表达用例，Repository 隔离数据访问。创建订单涉及的业务校验集中在用例中，不能只依赖网页上的校验。

请求对象也不必直接等于数据库实体。比如数据库新增内部审核字段，不应顺带让外部接口接受这个字段。

## 避免过早拆分

小模块可以先保留三层，不需要为每一个类再创建接口。等出现多种实现、独立测试边界或复杂领域规则，再增加抽象。

评审时我会问：修改一个业务规则需要找到几个位置？接口层是否了解 SQL 细节？共享目录是否装进了本应属于订单的逻辑？这些问题比目录是否对称更有帮助。
