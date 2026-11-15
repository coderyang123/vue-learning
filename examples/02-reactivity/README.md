# 02 · 响应式系统（Reactivity）

本示例演示 Vue 3 的响应式系统：**数据变了，界面凭什么跟着变**。不引入 Router / Pinia / UI 库，聚焦「响应式这一层」。

- 配套教程：`../../docs/02-响应式系统.md`
- 贯穿主题：**响应式实验室**（四组对照实验）

## 运行

```bash
pnpm install          # 在仓库根目录执行一次即可（pnpm workspace）
pnpm --filter @example/02-reactivity dev
```

或在本目录内 `pnpm install && pnpm dev`（端口 5172）。

## 两个入口

| 地址                                | 内容                                        |
|-------------------------------------|---------------------------------------------|
| <http://localhost:5172/>            | 响应式实验室主示例（§3 代码精读的对象）     |
| <http://localhost:5172/#/demos>     | 示例工作台：§1 每一节的可运行示例目录       |
| <http://localhost:5172/#/demos/2-3> | 直接跳到某一节，例如 2.3 `toRef` / `toRefs` |

文档 `docs/02-响应式系统.md` 里每节开头都有「▶️ 运行示例」链接，指向的就是上面这些地址。

## 示例工作台

`src/demos/` 下**一个语法点一个 `.vue` 文件**，共 11 个（对应 §1 的 ①～⑪）：

```
src/
├── demos/
│   ├── registry.ts            # 示例索引：小节号 → 组件 + 源码文件路径
│   ├── DemoRef.vue            # 2.1 ① ref 与模板自动解包
│   ├── DemoReactive.vue       # 2.2 ② reactive 与 Proxy
│   ├── DemoToRef.vue          # 2.3 ③ toRef / toRefs / toRaw / unref
│   ├── DemoComputedCache.vue  # 2.4 ④ computed 的惰性求值与缓存
│   ├── DemoWritableComputed.vue # 2.5 ⑤ 可写 computed（get / set）
│   ├── DemoWatch.vue          # 2.6 ⑥ watch 的三个选项
│   ├── DemoWatchEffect.vue    # 2.7 ⑦ watchEffect 与自动依赖收集
│   ├── DemoOnCleanup.vue      # 2.8 ⑧ onCleanup 副作用清理
│   ├── DemoNextTick.vue       # 2.9 ⑨ 调度机制与 nextTick
│   ├── DemoShallow.vue        # 2.10 ⑩ shallowRef / shallowReactive / markRaw
│   └── DemoTemplateRef.vue    # 2.11 ⑪ useTemplateRef
├── reactive.ts                # ★ 手写的迷你响应式系统（Proxy + 依赖表）
├── views/DemoWorkbench.vue    # 工作台：目录 + 运行效果
├── Root.vue                   # 入口：按 hash 决定显示主示例还是工作台
└── composables/useHashRoute.ts
```

几个约定（与第 01 章一致）：

- **示例是自包含的**：每个 `.vue` 只讲一个语法点，能单独打开、单独读懂，不依赖别的示例。
- **必须有可见效果**：每个示例都要能点、能看见差别（计数器、状态、日志、真实 DOM 行为）。
- **界面保持极简**：只用原生标签，不堆装饰性 class 和 `<style scoped>`；需要左右并排对照时才用
  `class="demo-cols"`。示例是拿来读代码的，界面丑没关系。
- **不提前使用后面章节的语法**：每个示例里出现的 API，都在第 01 章或本章当前小节教过。
- **跳转用 hash 路由**（`#/demos/2-3`），不引入 vue-router —— 本章刻意不引 Router（第 04 章再学）。

## 手写响应式系统：`src/reactive.ts`

Vue 的响应式再复杂，骨架也是四步：**读的时候记账（`track`），写的时候通知（`trigger`）**。
这个文件把这套机制手写一遍：

| 文件里的东西     | 对应 Vue 源码                            |
|------------------|------------------------------------------|
| `depsMap`        | `targetMap`（依赖表）                    |
| `track`          | `track(target, isRead)`                  |
| `trigger`        | `trigger(target, type, key)`             |
| `effect`         | `ReactiveEffect`                         |
| `createReactive` | `baseHandlers.ts` 里的 `mutableHandlers` |

写完再回头对照 Vue 源码（`packages/reactivity/src/`），会看到真实实现多出来的东西：
依赖去重、版本号 `bump`、调度器、`readonly` 劫持、`shallow` 标记。

主示例页面的「手写 createReactive」板块接的就是这个文件：
点按钮 → 代理的 `set` 拦截器 → `trigger` → 依赖表里取出副作用 → 重新执行 → 日志多一行。

## 四组对照实验（主示例 `src/App.vue`）

| 实验                          | 对照的两边                   | 能在页面上看到的差别                   |
|-------------------------------|------------------------------|----------------------------------------|
| 一 · `ref` vs `reactive`      | 脚本里要不要写 `.value`      | 写法不同，模板写法一样                 |
| 二 · 解构 vs `toRefs`         | 解构丢响应性 / `toRefs` 接住 | 同一个按钮，左栏纹丝不动、右栏跟着变   |
| 三 · `computed` vs 函数       | 缓存 / 不缓存                | 「实算次数」表格，触发重渲染时次数不变 |
| 四 · `watch` vs `watchEffect` | 写明监听谁 / 自动收集依赖    | 两个计数器，以及各自触发的时机         |

## 留给第 3 章的问题

1. `watchEffect` 里读了一个 `ref`，再在同一个 `watchEffect` 里写它，会发生什么？
2. `computed` 的 getter 和普通函数，读的都是同一批数据，差别到底在哪一层？
3. `shallowRef` 里放一个数组，用 `push` 改它，界面会更新吗？为什么？
4. `nextTick` 和 `flush: 'post'` 的 `watch`，谁先执行？各适合什么场景？
