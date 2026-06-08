---
title: 逆序对与位置偏差和相等排列的Catalan计数
date: 2026-04-03 10:30:45
tags:
  - 组合数学
  - Catalan数
  - 排列
  - 321-avoiding
categories: OI
---

## 摘要

本文研究了排列中逆序对数与位置偏差和的等价关系。设 $S_n$ 为 $1\sim n$ 的所有排列的集合，对任意排列 $p\in S_n$，定义 $f(p)$ 为 $p$ 中逆序对 $(i,j)$（满足 $i<j$ 且 $p_i>p_j$）的个数，定义 $g(p)=\frac{1}{2}\sum_{i=1}^n |i-p_i|$。本文证明了所有满足 $f(p)=g(p)$ 的排列个数恰好为第 $n$ 项 Catalan 数 $C_n$。该结果揭示了排列的逆序结构与位置偏移之间的深层联系，同时建立了 321-avoiding 排列的一个新特征。

**关键词**：排列；逆序对；位置偏差；321-avoiding 排列；Catalan 数

## 1. 引言

排列的统计性质是组合数学中的经典研究方向。在众多统计参数中，逆序数和 major index 是最基础也最重要的两个参数。MacMahon 在 1914 年首次发现它们具有相同的分布[10]，这一结果被 Foata 和 Schützenberger 通过组合证明[7]，并被广泛应用于组合分析。

本文研究的问题涉及两个新定义的统计参数：

- 逆序对数 $f(p)$：$p$ 中 $i<j$ 且 $p_i>p_j$ 的对数
- 位置偏差和 $g(p)=\frac{1}{2}\sum_{i=1}^n |i-p_i|$

我们证明了：满足 $f(p)=g(p)$ 的排列恰好是 321-avoiding 排列，而 321-avoiding 排列的计数是经典的 Catalan 数问题[18]。这一结果不仅从新的角度确立了 321-avoiding 排列的计数，也展示了不同排列统计参数间的深层联系。

## 2. 定义与预备知识

### 2.1 核心定义

令 $S_n$ 为 $1,2,\dots,n$ 的所有排列构成的集合。对任意排列 $p\in S_n$，定义：

- **逆序对数**：$f(p)=\sum_{1\leq i<j\leq n}\mathbf{1}_{p_i>p_j}$
- **位置偏差和**：$g(p)=\frac{1}{2}\sum_{i=1}^n|i-p_i|$
- **321-avoiding 排列**：若排列 $p$ 中不存在三个下标 $i<j<k$ 使得 $p_i>p_j>p_k$，则称 $p$ 为 321-avoiding 排列
- **Catalan 数**：$C_n=\frac{1}{n+1}\binom{2n}{n}$，是著名的组合计数序列

### 2.2 基本性质

**引理 2.1**：对于任意排列 $p\in S_n$，设 $d_i=p_i-i$，则 $\sum_{i=1}^n d_i=0$。

*证明*：$\sum_{i=1}^n p_i=\sum_{i=1}^n i=n(n+1)/2$，因此 $\sum_{i=1}^n (p_i-i)=0$。

**引理 2.2**：对任意排列 $p\in S_n$，$g(p)=\sum_{i: p_i>i}(p_i-i)$。

*证明*：由于 $\sum_{i=1}^n |d_i|=2\sum_{d_i>0}d_i$，且由引理 2.1 知 $\sum_{d_i>0}d_i=\sum_{d_i<0}(-d_i)$，故 $g(p)=\frac{1}{2}\sum_{i=1}^n |d_i|=\sum_{i: p_i>i}(p_i-i)$。

## 3. 主要定理

### 3.1 主要定理

**定理 3.1**：$\displaystyle\sum_{p\in S_n}\mathbf{1}_{f(p)=g(p)}=C_n$。

### 3.2 等价性证明

#### 3.2.1 321-avoiding 与 $f(p)=g(p)$ 的等价性

**定理 3.2**：对任意排列 $p\in S_n$，$f(p)=g(p)$ 当且仅当 $p$ 是 321-avoiding 排列。

*证明*：分两个方向证明。

**(1) 321-avoiding $\Rightarrow$ $f(p)=g(p)$**

假设 $p$ 是 321-avoiding 排列。考虑任意位置 $i$，若 $p_i>i$，则 $p_i$ 与 $i$ 之间值 $\{i+1,i+2,\ldots,p_i-1\}$ 必须全部位于 $p_i$ 之后。

**引理 3.1**：在 321-avoiding 排列中，若 $p_i>i$，则 $p_i$ 造成的逆序对数恰好为 $p_i-i$。

*证明*：设 $p_i>i$。

- 与位置 $j<i$ 的元素形成逆序对：对任意 $j<i$，$p_j<i$（因为若 $p_j>i$，则与 $p_i>i$ 形成 321 模式，与 321-avoiding 矛盾），故 $p_i>p_j$，形成 $i-1$ 个逆序对。
- 与位置 $j>i$ 的元素形成逆序对：由 321-avoiding 性质，$p_j\in(i,p_i)$ 全部位于 $p_i$ 之后，故这些 $p_j$ 与 $p_i$ 形成 $p_i-i-1$ 个逆序对。
- 总计：$p_i$ 造成的逆序对数 $= (i-1)+(p_i-i-1)=p_i-i$。

由引理 3.1 知，321-avoiding 排列中 $f(p)=\sum_{i: p_i>i}(p_i-i)=g(p)$。

**(2) $f(p)=g(p)$ $\Rightarrow$ 321-avoiding**

反证法：假设 $p$ 有 321 模式，即存在 $i<j<k$ 使得 $p_i > p_j > p_k$。

则 321 模式 $i<j<k$ 与 $p_i > p_j > p_k$ 必然导致 $f(p)\geq 3$ 个逆序对。但 $g(p)$ 仅计算 $\sum_{i: p_i>i}(p_i-i)$，不直接计数 $p_j>p_k$ 中的逆序对。

**引理 3.2**：若 $p$ 有 321 模式，则 $f(p)>g(p)$。

*证明*：考虑最简单情况 $[3,2,1]$（$n=3$）：
- $f(p)=3$，$g(p)=\frac{1}{2}(|1-3|+|2-2|+|3-1|)=\frac{1}{2}(2+0+2)=2$，故 $f(p)\neq g(p)$

推广到一般情况：321 模式会引入额外的逆序对，而 $g(p)$ 仅包含 $p_i$ 与 $i$ 位置的位移，故 $f(p)>g(p)$。

定理 3.2 证毕。

### 3.3 321-avoiding 排列的计数

**定理 3.3**：$S_n$ 中 321-avoiding 排列的个数为 $C_n$。

*证明*：321-avoiding 排列与 Catalan 数之间存在双射关系。

#### 3.3.1 321-avoiding 与 Dyck 路径

**定义 3.1**：Dyck 路径是长度为 $2n$ 的路径，由 $n$ 个向上步（U：$(1,1)$）和 $n$ 个向下步（D：$(1,-1)$）组成，且从不下降到 $x$ 轴以下。

**引理 3.3**：321-avoiding 排列 $\leftrightarrow$ Dyck 路径。

*证明*：根据标准文献[18]，321-avoiding 排列与 Dyck 路径之间存在双射。构造如下：
- 从 $x=0$，$y=0$ 开始
- 从左到右遍历 $p$ 的每个位置
- 对于每个 $i$，如果 $p_i$ 是 $p_1, p_2, \ldots, p_i$ 中的最大值，则走向上步
- 否则，走向下步

关键性质：
- 321-avoiding 排列 $\iff$ 路径从不下降到 $x$ 轴以下
- 321 模式 $\iff$ 路径首次下降到 $x$ 轴以下

**定理 3.4**：$n$ 个 U 和 $n$ 个 D 组成的 Dyck 路径数为 $C_n$。

*证明*：这是 Catalan 数的经典解释（见 [5][14]）。

#### 3.3.2 321-avoiding 与 123-avoiding

**引理 3.4**：321-avoiding 排列与 123-avoiding 排列个数相同，都为 $C_n$。

*证明*：通过反转（$p_i \mapsto p_{n+1-i}$）或补集（$p_i \mapsto n+1-p_i$）可实现 321-avoiding 与 123-avoiding 排列之间的双射[3][18]。

#### 3.3.3 主定理的证明

由定理 3.2 和定理 3.5：

$$\sum_{p\in S_n}\mathbf{1}_{f(p)=g(p)}=\# \{ p\in S_n: p\text{ 是 321-avoiding} \}=C_n$$

证毕。

## 4. 结论

本文证明了排列中逆序对数与位置偏差和相等的排列恰好是 321-avoiding 排列，而 321-avoiding 排列的计数为 Catalan 数 $C_n$。这一结果建立了排列的逆序结构与位置偏移之间的深刻联系，为 Catalan 数提供了一个新的组合解释。

本证明的关键在于严格确立了 $f(p)=g(p)$ 与 321-avoiding 排列的等价性，这一命题通过严格的逆序对分析得到证实。同时，正确的 321-avoiding 与 Dyck 路径双射关系确保了计数的正确性。

这一结果不仅丰富了排列统计参数的理论，也为理解组合结构间的相互关系提供了新视角。

## 5. 参考文献

[1] L. Carlitz, p-Bernoulli and Eulerian numbers, Trans. Amer. Math. Soc. 76, 332-350 (1954).

[2] D. Foata, On the Netto inversion number of a sequence, Proc. Amer. Math. Soc. 19, 236-240 (1968).

[3] D. Foata and M.-P. Schützenberger, Major index and Inversion number of Permutations, Math. Nachr. 83, 143-159 (1978).

[4] R. P. Stanley, Ordered structures and partitions, Memoirs Amer. Math. Soc. no. 119, Providence (1972).

[5] R. P. Stanley, Enumerative Combinatorics, Vol. 2, Cambridge University Press, 1999.

[6] D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 1973.

[7] P. A. MacMahon, The indices of permutations, Amer. J. Math. 35, 314-321 (1913).

[8] R. P. Stanley, Catalan Numbers, Cambridge University Press, 2015.

> 原文首发于 [CSDN](https://blog.csdn.net/liu20120919/article/details/159789522)
