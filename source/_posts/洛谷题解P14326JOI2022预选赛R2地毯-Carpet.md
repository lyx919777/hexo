---
title: 题解 P14326 JOI2022 预选赛 R2 地毯 Carpet
date: 2024-03-21
categories: 算法竞赛 题解
tags: [题解, JOI]
---

原题链接

 
### 前言
 
由于开了学术模式，也没看算法标签和难度，于是直接选择了BFS。

 
### BFS思路
 
由于每走一步的路径长度都为 <span class="katex--inline">$1
       
      
      
       1$<span class="mord">1 ，也就是说明当前路径长和访问序列的顺序是相同的，题目要求最短路，也就是最短路径是最早到达的路径。

 
这就正好符合了队列（queue）的FIFO（先进先出）的性质。

 
众所又周知，BFS以及和BFS相同思路的图论算法都和队列相关。比如01BFS使用的deque（双端队列），Dijkstra（著名单源最短路算法）的priority_queue（优先队列）。

 
所以，这道题的BFS思路就呼之欲出了（致DFS老祖，触雷致歉），BFS是 <span class="katex--inline">$O
       
       
        (
       
       
        n
       
       
        )
       
      
      
       O(n)$<span style="margin-right: 0.0278em;" class="mord mathnormal">O<span class="mopen">(<span class="mord mathnormal">n<span class="mclose">) ，DFS是 <span class="katex--inline">$O
       
       
        (
       
       
        
         n
        
        
         2
        
       
       
        )
       
      
      
       O(n^2)$<span style="margin-right: 0.0278em;" class="mord mathnormal">O<span class="mopen">(<span class="mord"><span class="mord mathnormal">n<span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.8141em;"><span class="" style="top: -3.063em; margin-right: 0.05em;"><span class="pstrut" style="height: 2.7em;"><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2<span class="mclose">) （ <span class="katex--inline">$n
       
      
      
       n$<span class="mord mathnormal">n 为 <span class="katex--inline">$h
       
       
        ∗
       
       
        w
       
      
      
       h*w$<span class="mord mathnormal">h<span class="mspace" style="margin-right: 0.2222em;"><span class="mbin">∗<span class="mspace" style="margin-right: 0.2222em;"><span class="base"><span class="strut" style="height: 0.4306em;"><span style="margin-right: 0.0269em;" class="mord mathnormal">w ）。

 
##### BFS代码（AC，33ms，码风<s>优良</s>）:
 
`#include<bits/stdc++.h>

using namespace std;

const int N=505;
int h,w,dis[N][N];
string s[N];
int dx[]={<!-- -->1,-1,0,0},dy[]={<!-- -->0,0,1,-1};

int main(){<!-- -->
    scanf("%d%d",&h,&w);
    for(int i=0;i<h;i++)cin>>s[i];
    memset(dis,-1,sizeof dis);
    queue<pair<int,int>>q;
    dis[0][0]=0;
    q.push({<!-- -->0,0});
    while(q.size()){<!-- -->
        auto [x,y]=q.front();q.pop();
        for(int d=0;d<4;d++){<!-- -->
            int nx=x+dx[d],ny=y+dy[d];
            if(nx<0||nx>=h||ny<0||ny>=w)continue;
            if(s[nx][ny]==s[x][y])continue;
            if(dis[nx][ny]!=-1)continue;
            dis[nx][ny]=dis[x][y]+1;
            q.push({<!-- -->nx,ny});
        }
    }
    printf("%d",dis[h-1][w-1]);
    return 0;
}

```
 
#### 完结撒花！！！
 
#### 了吗？？？
 
上面讲到了01BFS和Dijkstra，于是我又为了<s>装13</s>让大家看1得3，来说一下另外两种思路：

 
#### Dijkstra 算法
 
Dijkstra 是解决单源最短路径问题的经典算法，适用于 **所有边权非负** 的图。它通过贪心策略，每次选择当前距离最小的节点进行扩展，确保最短路径的正确性。

 
##### 特点
 
- 使用优先队列维护当前最短距离。
- 时间复杂度为 $O((V + E) \log V) $，其中 <span class="katex--inline">$V
        
       
       
        V$<span style="margin-right: 0.2222em;" class="mord mathnormal">V 是点数，<span class="katex--inline">$E
        
       
       
        E$<span style="margin-right: 0.0576em;" class="mord mathnormal">E 是边数。
- 支持任意非负边权，适用于复杂图结构。
 
##### 适用场景
 
- 地图导航、网络路由、资源调度等。
- 图中边权分布广泛，非 0/1 权值。
 
##### 代码（AC，87ms）：
 
`#include<bits/stdc++.h>

usingnamespace std;

const int N=260000;
int h,w,s,t,dis[N];
vector<pair<int,int>>g[N];
struct node{<!-- -->
    int u,dis;
    bool operator>(const node&a)const{<!-- -->return dis>a.dis;}
};
int id(int x,int y){<!-- -->return x*w+y;}

int main(){<!-- -->
    scanf("%d%d",&h,&w);
    vector<string>smap(h);
    for(int i=0;i<h;i++)cin>>smap[i];
    for(int i=0;i<h;i++){<!-- -->//建图
        for(int j=0;j<w;j++){<!-- -->
            int u=id(i,j);
            if(i+1<h&&smap[i][j]!=smap[i+1][j])g[u].push_back({<!-- -->id(i+1,j),1});
            if(i-1>=0&&smap[i][j]!=smap[i-1][j])g[u].push_back({<!-- -->id(i-1,j),1});
            if(j+1<w&&smap[i][j]!=smap[i][j+1])g[u].push_back({<!-- -->id(i,j+1),1});
            if(j-1>=0&&smap[i][j]!=smap[i][j-1])g[u].push_back({<!-- -->id(i,j-1),1});
        }
    }
    s=id(0,0);
    t=id(h-1,w-1);
    priority_queue<node,vector<node>,greater<node>>pq;
    memset(dis,0x3f,sizeof dis);
    dis[s]=0;
    pq.push({<!-- -->s,0});
    while(pq.size()){<!-- -->//Dijkstra模板
        int u=pq.top().u,d=pq.top().dis;
        pq.pop();
        if(d>dis[u])continue;
        for(auto&nt:g[u]){<!-- -->
            int v=nt.first,w=nt.second;
            if(d+w<dis[v]){<!-- -->
                dis[v]=d+w;
                pq.push({<!-- -->v,dis[v]});
            }
        }
    }
    printf("%d",dis[t]==0x3f3f3f3f?-1:dis[t]);
}

```
 
#### 01BFS 算法
 
01BFS 是一种特殊的 BFS 变种，专门用于边权仅为 **0 或 1** 的图。它使用双端队列（deque）代替普通队列，根据边权将节点插入队首或队尾，从而实现更高效的最短路径搜索。

 
##### 特点
 
- 时间复杂度为 <span class="katex--inline">$O
        
        
         (
        
        
         V
        
        
         +
        
        
         E
        
        
         )
        
       
       
        O(V + E)$<span style="margin-right: 0.0278em;" class="mord mathnormal">O<span class="mopen">(<span style="margin-right: 0.2222em;" class="mord mathnormal">V<span class="mspace" style="margin-right: 0.2222em;"><span class="mbin">+<span class="mspace" style="margin-right: 0.2222em;"><span class="base"><span class="strut" style="height: 1em; vertical-align: -0.25em;"><span style="margin-right: 0.0576em;" class="mord mathnormal">E<span class="mclose">) ，比 Dijkstra 更快。
- 利用 deque 实现边权优先扩展。
- 仅适用于边权为 0 或 1 的图。
 
##### 适用场景
 
- 状态转移代价为 0/1 的问题，如： 
  - 图像处理中的像素跳跃
- 字符串编辑距离（某些操作免费）
- 网格图中颜色切换代价为 0，移动代价为 1
 
 
##### 代码（AC，33ms）：
 
`#include<bits/stdc++.h>
using namespace std;
const int N=505;
int h,w,dis[N][N];
string s[N];
int dx[]={<!-- -->1,-1,0,0},dy[]={<!-- -->0,0,1,-1};

int main(){<!-- -->
    // 读入地毯尺寸
    scanf("%d%d",&h,&w);
    for(int i=0;i<h;i++)cin>>s[i];

    // 初始化距离数组为 -1，表示未访问
    memset(dis,-1,sizeof dis);

    // 双端队列用于 01BFS
    deque<pair<int,int>>q;
    dis[0][0]=0;
    q.push_front({<!-- -->0,0});

    while(q.size()){<!-- -->
        auto [x,y]=q.front();q.pop_front();
        for(int d=0;d<4;d++){<!-- -->
            int nx=x+dx[d],ny=y+dy[d];
            if(nx<0||nx>=h||ny<0||ny>=w)continue;

            // 只能移动到颜色不同的格子
            if(s[nx][ny]==s[x][y])continue;

            // 如果已经访问过，跳过
            if(dis[nx][ny]!=-1)continue;

            // 因为所有边权都是 1，这里统一放到队尾
            dis[nx][ny]=dis[x][y]+1;
            q.push_back({<!-- -->nx,ny});
        }
    }

    // 输出结果：若无法到达则为 -1
    printf("%d",dis[h-1][w-1]);
}

```
 
#### 对比分析
 
| 属性 | Dijkstra | 01BFS 
| 边权要求 | 非负整数 | 仅限 0 或 1 
| 数据结构 | 优先队列 | 双端队列 
| 时间复杂度 | $ O((V+E)\log V) $ | $ O(V+E) $ 
| 实现复杂度 | 中等 | 简单 
| 应用场景 | 通用图 | 特殊边权图 

#### 总结
 
- 若边权为 0 或 1，优先使用 01BFS，效率更高。
- 若边权为任意非负值，使用 Dijkstra 更稳妥。
- 两者都能保证最短路径的正确性，但选择合适算法能显著提升性能。
 
#### 后记
 
Dijkstra老祖泪目了<img src="https://i-blog.csdnimg.cn/img_convert/5e70d7571aff44cbc8d591109dcbf92d.png" alt="https://cdn.luogu.com.cn/upload/image_hosting/ruvmgybe.png" />