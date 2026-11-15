# 01 · 模板语法（Template Syntax）

本示例演示 Vue 3 的模板语法与最基础的响应式用法，**不引入** Router / Pinia / UI 库，聚焦「写对模板」这件事。

- 配套教程：`../../docs/01-Vue3-核心与模板.md`
- 贯穿主题：**待办清单**（后续章节会继续演进为任务看板）

## 运行

```bash
pnpm install          # 在仓库根目录执行一次即可（pnpm workspace）
pnpm --filter @example/01-template-syntax dev
```

或在本目录内 `pnpm install && pnpm dev`（端口 5171）。

## 两个入口

| 地址                                 | 内容                                  |
|--------------------------------------|---------------------------------------|
| <http://localhost:5171/>             | 待办清单主示例（§3 代码精读的对象）   |
| <http://localhost:5171/#/demos>      | 示例工作台：§1 每一节的可运行示例目录 |
| <http://localhost:5171/#/demos/1-15> | 直接跳到某一节，例如 1.15 `computed`  |

文档 `docs/01-Vue3-核心与模板.md` 里每节开头都有「▶️ 运行示例」链接，指向的就是上面这些地址。

## 示例工作台

`src/demos/` 下**一个语法点一个 `.vue` 文件**，共 16 个（对应 §1 的 ③～⑱）：

```
src/
├── demos/
│   ├── registry.ts          # 示例索引：小节号 → 组件 + 源码文件路径
│   ├── DemoInterpolation.vue # 1.3 ③ 插值
│   ├── DemoVBind.vue         # 1.4 ④ v-bind
│   ├── ...
│   └── DemoTypescript.vue    # 1.18 ⑱ TypeScript 类型标注
├── views/DemoWorkbench.vue  # 工作台：左侧目录 + 右侧运行效果 + 源码对照
├── Root.vue                 # 入口：按 hash 决定显示主示例还是工作台
└── composables/useHashRoute.ts
```

几个约定：

- **示例是自包含的**：每个 `.vue` 只讲一个语法点，能单独打开、单独读懂，不依赖别的示例。
- **必须有可见效果**：每个示例都要能点、能看见差别（计数器、状态、日志、真实 DOM 行为），
  而不是只把代码摆在那儿。
- **界面保持极简**：只用原生标签，不堆装饰性 class 和 `<style scoped>`；只有「知识点本身就是
  样式」时才写少量 CSS（如 1.11 动态 class）。示例是拿来读代码的，界面丑没关系。
- **跳转用 hash 路由**（`#/demos/1-3`），不引入 vue-router —— 本章刻意不引 Router（第 04 章再学）。

## 演示到的语法点

| 语法                                      | 位置                                               |
|-------------------------------------------|----------------------------------------------------|
| `v-model` + `.trim` 修饰符                | `src/App.vue` 的新增输入框                         |
| `@submit.prevent` 修饰符                  | `src/App.vue` 的表单                               |
| `v-for` + `:key`（用稳定 id，不用 index） | `src/App.vue` 的任务列表                           |
| `v-if` / `v-else` 空状态                  | `src/App.vue` 的列表区域                           |
| 动态 class（对象语法）                    | `src/components/TaskItem.vue`、`TaskFilterBar.vue` |
| `props` / `emits`                         | `src/components/TaskItem.vue`                      |
| `defineModel` 双向绑定                    | `src/components/TaskFilterBar.vue`                 |
| 组件事件通信                              | `src/App.vue` ↔ `TaskItem.vue`                     |
| `computed` vs 普通函数对照                | `src/App.vue` 顶部的「实算次数」表格               |

§1 每节对应的独立示例见 `src/demos/`（见上面的「示例工作台」）。

## 对照实验：computed vs 普通函数

页面顶部有一张对照表，两种写法算的是同一个「剩余未完成数」：

- `computed`（`src/App.vue` 的 `remaining`）：依赖不变就返回缓存，**只在依赖变化时重算**。
- 普通函数（`src/App.vue` 的 `remainingByMethod`）：**每次被调用都重算**。

点「触发一次重渲染」按钮（它只改一个跟派生数据无关的状态 `renderTick`），观察「实算次数」：

| 操作                                  | computed | 普通函数 |
|---------------------------------------|----------|----------|
| 首次挂载                              | +1       | +1       |
| 点「触发一次重渲染」（派生数据没变）  | **+0**   | **+1**   |
| 切换筛选条件 `filter`（派生数据没变） | **+0**   | **+1**   |
| 新增一条任务 / 勾选一条任务           | +1       | +1       |

结论：**差别在「算几次」，不在「会不会更新」**——函数写在模板里一样是响应式的。

> 计数器用普通变量而不是 `ref`：在 `computed` 的 getter 里写 `ref` 会自触发递归，Vue 会直接报
> Maximum recursive updates exceeded。

## 留给第 2 章的问题

1. `computed` 的缓存到底是怎么实现的？Vue 3.5 的 `refreshComputed` 在什么条件下才 `bump` 依赖版本号？
2. 为什么「依赖变了但派生值没变」时，下游组件不会重渲染？
3. `tasks.value.unshift(...)` 触发了几次渲染？为什么只渲染了一次？
4. 如果把 `filter` 从 `ref` 改成 `reactive` 的写法，会发生什么？
