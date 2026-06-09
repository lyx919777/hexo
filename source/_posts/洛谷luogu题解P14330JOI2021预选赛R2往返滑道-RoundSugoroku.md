---
title: 题解 P14330 JOI2021 预选赛 R2 往返滑道 Round Sugoroku
date: 2024-03-21
categories: 算法竞赛 题解
tags: [题解, JOI]
---

原题传送门

 
### 题意简述
 
滑道长度为 (N+2)，编号从 (0) 到 (N+1)，其中：

 
- (S_0 = S_{N+1} = \texttt{x})：两端为墙。
- (S_1 \sim S_N)：可能是字母、`.` 或 `#`。
- 棋子初始在位置 (A)，方向向右，且 (S_A) 是字母。
 
每秒棋子向当前方向移动一格，规则如下：

 
- 落在 `x`：反转方向。
- 落在 `#`：反转方向 + 变为 `.`（只触发一次）。
- 落在 `.`：无变化。
 
目标：清除所有 `#` 所需的时间。

 
---
 
### 解法思路
 
#### 核心观察
 
每个 `#` 只能清除一次，且每次清除都会反转方向。棋子在滑道上来回穿梭，形成“往返”路径。

 
#### 分治策略
 
将所有 `#` 分为左右两部分：

 
- 左侧：位置 (< A)
- 右侧：位置 (> A)
 
每次向当前方向移动到最近的 `#`，清除后反转方向。若当前方向没有 `#`，则先移动到端点，再转向另一侧。

 
---
 
### 简洁代码（码风优良）
 
`#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main() {<!-- -->
    ios::sync_with_stdio(0);
    cin.tie(0);

    int n, a;
    string s;
    cin >> n >> a >> s;

    vector<int> l, r;
    for (int i = 0; i < n; i++)
        if (s[i] == '#')
            (i + 1 < a ? l : r).push_back(i + 1);

    sort(l.rbegin(), l.rend());
    sort(r.begin(), r.end());

    int p = a, d = 1;
    long long t = 0;

    while (!l.empty() || !r.empty()) {<!-- -->
        if (d == 1) {<!-- -->
            if (!r.empty()) {<!-- -->
                t += r[0] - p;
                p = r[0];
                r.erase(r.begin());
            } else {<!-- -->
                t += (n + 1 - p) + (l.empty() ? 0 : n + 1 - l[0]);
                p = l.empty() ? 0 : l[0];
                d = -1;
                continue;
            }
        } else {<!-- -->
            if (!l.empty()) {<!-- -->
                t += p - l[0];
                p = l[0];
                l.erase(l.begin());
            } else {<!-- -->
                t += p + (r.empty() ? 0 : r[0]);
                p = r.empty() ? n + 1 : r[0];
                d = 1;
                continue;
            }
        }
        d *= -1;
    }

    cout << t << '\n';
}
```
 
---
 
### 时间复杂度
 
- 初始遍历：(O(N))
- 每次清除一个 `#`：最多 (O(K))，其中 (K) 是 `#` 的数量
- 总复杂度：(O(N + K))，线性级别
 
---
 
### 总结
 
这题的关键在于：

 
- 每次只处理一个 `#`，清除后反转方向。
- 当前方向没有 `#` 时，合理计算到端点再转向的时间。
- 用两个有序数组维护左右 `#`，避免逐步模拟。
 
### 后记
 
我写了暴力、链表、数学方法以后，终于作出了正解。

 
<img src="https://i-blog.csdnimg.cn/img_convert/6abdf7397b6f371a2b633aba3054354f.png" alt="" />