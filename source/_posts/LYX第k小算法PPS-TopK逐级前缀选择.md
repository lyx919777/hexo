---
title: LYX第k小算法 PPS-TopK逐级前缀选择
date: 2024-01-19
categories: 算法
tags: [TopK, 选择算法]
---

---
 
### 1. 算法设计动机
 
在大规模数据处理中，“**从规模为 (n) 的集合中选取前 (k) 小元素**”是一类高频需求。
 现有主流方法如 `nth_element` 在 𝑘≪𝑛时会对大量无关元素执行比较与交换，浪费缓存与分支资源。
 本算法通过**逐级直方图前缀细化**，在常数次扫描后将候选规模压缩至接近 (k)，再用局部选择获得结果，整体常数因子低、缓存友好。

 
---
 
### 2. 算法原理概要
 
- **键值规范化**：将比较键映射为 32 位单调无符号整数，确保字节顺序与数值顺序一致。
- **多层直方图细化**：从最高字节开始分桶，找到覆盖第 (k) 个元素的边界桶，逐字节递归细化。
- **候选集压缩**：确定部分 + 边界桶组成候选集，大小通常不超过 (1+𝛽)𝑘。
- **局部选择收尾**：在候选集中用 `nth_element` 得到精确前 (k)。
 
---
 
### 3. C++20 实现
 
`#include <bits/stdc++.h>
using namespace std;

/**
 * 将有符号 int32 转换为可按无符号比较的单调 uint32
 * 核心思想：翻转符号位，使负数映射到较小的无符号范围
 */
static inline uint32_t order_key_int32(int32_t x) {<!-- -->
    return static_cast<uint32_t>(x) ^ 0x80000000u;
}

/**
 * 将 float 转换为 uint32 的位模式
 */
static inline uint32_t bitcast_u32(float x) {<!-- -->
    uint32_t u;
    memcpy(&u, &x, sizeof(u));
    return u;
}

/**
 * 将 IEEE754 float 转换为可比较的 uint32
 * 规则：
 * - 负数：按位取反（保证数值越小映射值越小）
 * - 非负数：翻转符号位
 */
static inline uint32_t order_key_float(float x) {<!-- -->
    uint32_t u = bitcast_u32(x);
    if (u & 0x80000000u) {<!-- -->
        return ~u;
    } else {<!-- -->
        return u ^ 0x80000000u;
    }
}

/**
 * PPS-TopK 核心模板
 * @param a       输入数组
 * @param k       需要选取的元素个数
 * @param key_fn  从元素提取 32 位可比较键的函数
 * @param beta    候选集膨胀系数（默认4）
 * @return        前 k 小元素的索引（未排序）
 */
template <class T, class KeyFn>
vector<size_t> pps_topk_indices(const vector<T>& a, size_t k, KeyFn key_fn, double beta = 4.0) {<!-- -->
    const size_t n = a.size();
    if (k == 0 || n == 0) return {<!-- -->};
    if (k >= n) {<!-- -->
        vector<size_t> idx(n);
        iota(idx.begin(), idx.end(), 0);
        return idx;
    }

    // === 第一步：预计算所有元素的32位键值 ===
    vector<uint32_t> keys(n);
    for (size_t i = 0; i < n; ++i) keys[i] = key_fn(a[i]);

    // 初始化 256 桶计数函数
    auto hist256 = [](array<uint32_t,256>& h){<!-- --> h.fill(0); };

    // === 第二步：构建首层直方图（最高字节） ===
    array<uint32_t,256> H;
    hist256(H);
    for (size_t i = 0; i < n; ++i) {<!-- -->
        uint32_t b = keys[i] >> 24;
        ++H[b];
    }

    // 辅助函数：找到第一个累积计数 >= base 的桶编号
    auto find_boundary = [&](const array<uint32_t,256>& C, uint64_t base) {<!-- -->
        uint64_t acc = 0;
        for (int b = 0; b < 256; ++b) {<!-- -->
            if (acc + C[b] >= base) {<!-- -->
                return tuple<int,uint64_t,uint32_t>(b, acc, C[b]); // 边界桶编号、边界前总数、边界桶大小
            }
            acc += C[b];
        }
        return tuple<int,uint64_t,uint32_t>(255, acc - C[255], C[255]);
    };

    // === 第三步：逐层细化边界桶 ===
    uint32_t prefix_bytes[4] = {<!-- -->0,0,0,0};
    int depth = 0;
    uint64_t L = 0; // 边界前确定元素数
    uint32_t S = 0; // 当前边界桶大小

    {<!-- --> // 第一层定位边界桶
        auto [b0, below, sz] = find_boundary(H, k);
        prefix_bytes[0] = b0;
        L = below;
        S = sz;
        depth = 1;
    }

    while (S > static_cast<uint32_t>(beta * k) && depth < 4) {<!-- -->
        array<uint32_t,256> Hd;
        hist256(Hd);

        // 构造当前前缀值与掩码
        const int bits = depth * 8;
        const uint32_t mask = bits == 32 ? 0xFFFFFFFFu : (~0u << (32 - bits));
        uint32_t prefix_value = 0;
        for (int i = 0; i < depth; ++i) {<!-- -->
            prefix_value |= (prefix_bytes[i] << (24 - 8*i));
        }

        // 在匹配当前前缀的元素上构建下一字节直方图
        for (size_t i = 0; i < n; ++i) {<!-- -->
            uint32_t key = keys[i];
            if ((key & mask) == prefix_value) {<!-- -->
                uint32_t next_byte = (key >> (24 - 8*depth)) & 0xFFu;
                ++Hd[next_byte];
            }
        }

        // 在该层定位新的边界子桶
        uint64_t need = k - L;
        auto [bd, below_d, sz_d] = find_boundary(Hd, need);
        prefix_bytes[depth] = bd;
        L += below_d;
        S = sz_d;
        ++depth;
    }

    // === 第四步：收集候选集 ===
    vector<size_t> cand;
    cand.reserve(min<uint64_t>(n, L + S + k)); 
    const int bits = depth * 8;
    const uint32_t mask = bits == 32 ? 0xFFFFFFFFu : (~0u << (32 - bits));
    uint32_t boundary_prefix = 0;
    for (int i = 0; i < depth; ++i) {<!-- -->
        boundary_prefix |= (prefix_bytes[i] << (24 - 8*i));
    }

    for (size_t i = 0; i < n; ++i) {<!-- -->
        uint32_t kp = keys[i] & mask;
        if (kp < boundary_prefix || kp == boundary_prefix) {<!-- -->
            cand.push_back(i);
        }
    }

    // === 第五步：局部选择收尾 ===
    if (cand.size() > k) {<!-- -->
        nth_element(cand.begin(), cand.begin() + k, cand.end(),
            [&](size_t i, size_t j){<!-- --> return keys[i] < keys[j]; });
        cand.resize(k);
    }
    return cand;
}

// === 使用示例 ===
int main() {<!-- -->
    vector<float> a = {<!-- -->3.14f, -2.0f, 7.5f, 1.0f, -8.2f, 0.0f, 2.2f};
    size_t k = 3;

    auto idx = pps_topk_indices(a, k, [](float x){<!-- --> return order_key_float(x); });
    for (size_t i : idx) cout << a[i] << " ";
    cout << "\n";
    return 0;
}
```
 
---
 
### 4. 复杂度分析与实验结论
 
- **时间复杂度**：𝑂(𝑛⋅𝐷+𝐶)
- 其中 (D) ≤ 4（32 位键最大字节深度）𝐶 ≈ (1+𝛽)𝑘。
- **空间复杂度**：𝑂(256⋅𝐷+𝐶)
 常数级直方图
 
### 5.说明
 
本算法于2024年8月开始构思，目前为对外公布第一稿，原代码非常<s>猥琐</s>“优雅”，由Chagpt美化，故函数名比较高级。

 
**作者版权所有！！！**

 
原文地址（某谷）