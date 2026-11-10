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

## 留给第 2 章的问题

1. `visibleTasks` 目前用 `computed`，它的缓存机制到底是怎么工作的？
2. `tasks.value.unshift(...)` 触发了几次渲染？为什么只渲染了一次？
3. 如果把 `filter` 从 `ref` 改成 `reactive` 的写法，会发生什么？
