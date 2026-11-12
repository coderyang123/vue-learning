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

## 演示到的语法点

| 语法 | 位置 |
| --- | --- |
| `v-model` + `.trim` 修饰符 | `src/App.vue` 的新增输入框 |
| `@submit.prevent` 修饰符 | `src/App.vue` 的表单 |
| `v-for` + `:key`（用稳定 id，不用 index） | `src/App.vue` 的任务列表 |
| `v-if` / `v-else` 空状态 | `src/App.vue` 的列表区域 |
| 动态 class（对象语法） | `src/components/TaskItem.vue`、`TaskFilterBar.vue` |
| `props` / `emits` | `src/components/TaskItem.vue` |
| `defineModel` 双向绑定 | `src/components/TaskFilterBar.vue` |
| 组件事件通信 | `src/App.vue` ↔ `TaskItem.vue` |
| `computed` vs 普通函数对照 | `src/App.vue` 顶部的「实算次数」表格 |

## 对照实验：computed vs 普通函数

页面顶部有一张对照表，两种写法算的是同一个「剩余未完成数」：

- `computed`（`src/App.vue` 的 `remaining`）：依赖不变就返回缓存，**只在依赖变化时重算**。
- 普通函数（`src/App.vue` 的 `remainingByMethod`）：**每次被调用都重算**。

点「触发一次重渲染」按钮（它只改一个跟派生数据无关的状态 `renderTick`），观察「实算次数」：

| 操作                                 | computed | 普通函数 |
| ------------------------------------ | -------- | -------- |
| 首次挂载                             | +1       | +1       |
| 点「触发一次重渲染」（派生数据没变） | **+0**   | **+1**   |
| 切换筛选条件 `filter`（派生数据没变） | **+0**   | **+1**   |
| 新增一条任务 / 勾选一条任务          | +1       | +1       |

结论：**差别在「算几次」，不在「会不会更新」**——函数写在模板里一样是响应式的。

> 计数器用普通变量而不是 `ref`：在 `computed` 的 getter 里写 `ref` 会自触发递归，Vue 会直接报
> Maximum recursive updates exceeded。

## 留给第 2 章的问题

1. `computed` 的缓存到底是怎么实现的？Vue 3.5 的 `refreshComputed` 在什么条件下才 `bump` 依赖版本号？
2. 为什么「依赖变了但派生值没变」时，下游组件不会重渲染？
3. `tasks.value.unshift(...)` 触发了几次渲染？为什么只渲染了一次？
4. 如果把 `filter` 从 `ref` 改成 `reactive` 的写法，会发生什么？
