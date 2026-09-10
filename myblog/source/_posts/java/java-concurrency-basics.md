---
title: Java 并发基础：可见性不等于原子性
date: 2026-09-09 15:50:00
categories: [Java 基础]
tags: [Java, 并发]
description: 从 count++ 出发，分清 volatile、同步与共享状态的边界。
---

并发代码最容易误判的地方，是把“一行代码”当成“一次不可分割的操作”。计数器就是很小但很典型的例子。

<!-- more -->

## 为什么 volatile 仍然会丢计数

```java
private volatile int count = 0;

void increment() {
    count++;
}
```

`count++` 包含读取、计算和写回。两个线程可能都读到 0，然后都写入 1。`volatile` 建立相应的可见性和顺序保证，但不会把这几个动作合成一次原子操作。同步语义参见 [Java 语言规范第 17 章](https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html)。

## 先定义要保护的状态

一个简单的锁方案如下。所有读写都经过同一实例的同步方法：

```java
final class Counter {
    private int count;

    synchronized void increment() {
        count++;
    }

    synchronized int value() {
        return count;
    }
}
```

关键是多个线程共享同一个 `Counter`。若业务要同时维护数量和金额，就应围绕这组状态的不变量设计保护范围，不能只盯住其中一个字段。

## 验证时不要依赖运气

让两个线程各执行若干次累加，并在主线程等待它们结束后检查总数，是一个起点。但有问题的实现偶尔得到正确结果，不代表它正确；应先分析共享访问与同步关系，再用测试寻找反例。

实际使用还要考虑整数范围。这个小例子用于解释同步边界，不是无限增长计数器的完整实现。
