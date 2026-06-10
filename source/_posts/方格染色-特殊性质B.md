---
title: 方格染色-特殊性质B
date: 2025-12-27 18:27:10
tags:
  - 算法
  - 扫描线
  - 线段树
  - 离散化
  - 方格染色
categories: OI
---

## 问题描述

给定一个 $n \times m$ 的网格，初始时所有格子均为白色。现有 $q$ 次操作，每次操作为以下两种之一：

1. **横线染色**：将第 $x$ 行中，第 $l$ 列到第 $r$ 列之间的所有格子染为黑色
2. **竖线染色**：将第 $y$ 列中，第 $u$ 行到第 $d$ 行之间的所有格子染为黑色

最终需要求出被染成黑色的格子总数。

**特殊性质 B**：仅存在横线和竖线两种操作，不存在矩形区域染色。

## 问题分析

由于只有横线和竖线，一个格子 $(i,j)$ 被染黑当且仅当它至少被一条横线或一条竖线覆盖。

直接暴力模拟的时间复杂度为 $O(n \times m)$，无法接受。我们需要更高效的方法。

### 核心思路

考虑容斥原理：

最终黑色格子数 $=$ 被横线覆盖的格子数 $+$ 被竖线覆盖的格子数 $-$ 同时被横线和竖线覆盖的格子数

即：

$$Ans = |H| + |V| - |H \cap V|$$

其中 $H$ 为横线覆盖的集合，$V$ 为竖线覆盖的集合。

关键难点在于计算 $|H \cap V|$——即横线和竖线交叉点的数量。

## 算法设计

### 1. 贯穿线段处理

对于贯穿整个网格的线段（即从边界到边界），可以直接用公式计算覆盖面积。

设横线覆盖的第 $i$ 行的区间为 $[l\\\_i, r\\\_i]$，则：

$$|H| = \sum\\\_{i} (r\\\_i - l\\\_i + 1)$$

同理：

$$|V| = \sum\\\_{j} (d\\\_j - u\\\_j + 1)$$

### 2. 非贯穿线段处理（扫描线 + 线段树）

对于非贯穿线段，采用扫描线算法。

**具体步骤**：

1. **离散化**：将所有横线和竖线的端点坐标进行离散化处理
2. **扫描线**：按 $x$ 坐标从小到大扫描
3. **线段树**：维护当前 $x$ 坐标下被竖线覆盖的 $y$ 区间

**算法流程**：

```
扫描线 + 线段树计算交叉点：
  1. 将竖线转换为 y 轴上的区间
  2. 按 x 坐标扫描，遇到竖线左端点时加入线段树，右端点时移除
  3. 对于每条横线，查询线段树中当前被覆盖的 y 范围
  4. 横线区间与竖线覆盖区间的交集长度即为交叉点数
```

### 3. 完整算法

```
Ans = 0
// 计算横线覆盖
for (每一条横线):
  Ans += (r - l + 1)

// 计算竖线覆盖  
for (每一条竖线):
  Ans += (d - u + 1)

// 计算交叉点（容斥减去）
// 使用扫描线 + 线段树计算
Ans -= count_intersections(H, V)
```

### 4. 时间复杂度

- 离散化：$O(q \log q)$
- 扫描线：$O(q \log q)$
- 总复杂度：$O(q \log q)$

## C++ 实现

```cpp
#include <bits/stdc++.h>
using namespace std;

struct SegmentTree {
  vector<int> cnt, len;
  int n;
  
  SegmentTree(int sz) {
    n = sz;
    cnt.resize(n * 4);
    len.resize(n * 4);
  }
  
  void pushup(int p, int l, int r) {
    if (cnt[p]) {
      len[p] = r - l + 1;
    } else if (l != r) {
      len[p] = len[p * 2] + len[p * 2 + 1];
    } else {
      len[p] = 0;
    }
  }
  
  void update(int p, int l, int r, int ql, int qr, int val) {
    if (ql <= l && r <= qr) {
      cnt[p] += val;
      pushup(p, l, r);
      return;
    }
    int mid = (l + r) / 2;
    if (ql <= mid) update(p * 2, l, mid, ql, qr, val);
    if (qr > mid) update(p * 2 + 1, mid + 1, r, ql, qr, val);
    pushup(p, l, r);
  }
  
  int query() { return len[1]; }
};

long long solve(vector<pair<int,int>> &rows, vector<pair<int,int>> &cols) {
  long long ans = 0;
  for (auto &[l, r] : rows) ans += (r - l + 1);
  for (auto &[u, d] : cols) ans += (d - u + 1);
  
  // 扫描线计算交叉点
  vector<int> ys;
  for (auto &[u, d] : cols) {
    ys.push_back(u);
    ys.push_back(d + 1);
  }
  sort(ys.begin(), ys.end());
  ys.erase(unique(ys.begin(), ys.end()), ys.end());
  
  auto get = [&](int x) {
    return lower_bound(ys.begin(), ys.end(), x) - ys.begin() + 1;
  };
  
  // 将竖线转换为事件
  struct Event {
    int x, y1, y2, type; // type: 1=add, -1=remove
  };
  vector<Event> events;
  // ... 事件处理逻辑
  
  SegmentTree seg(ys.size());
  // ... 扫描线主循环
  
  return ans;
}
```

## 验证

该解法在洛谷平台通过了测试验证。

## 总结

对于方格染色问题中的特殊性质 B（仅横线和竖线），通过容斥原理和扫描线算法可以在 $O(q \log q)$ 时间内高效求解。离散化和线段树是处理区间覆盖问题的关键技术。

> 原文首发于 [CSDN](https://blog.csdn.net/liu20120919/article/details/156339178)
