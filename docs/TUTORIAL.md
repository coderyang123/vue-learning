# Vue 3 及周边生态学习教程大纲

> 目标：把仓库从「Vite 官方模板」改造成一套**多示例工程 + 贯穿式实战项目**的学习体系，在实战中吃透 Vue
> 3 核心、响应式、组件化、Vue Router、Pinia、VueUse、Element Plus + Tailwind CSS。
>
> **贯穿项目：待办清单 / 任务看板（Todo
> Board）**——从第 04 章开始建立，之后每章都在它之上继续演进，最终是一个可运行、可测试、可部署的完整应用。

## 四条既定约定

1. **每章一个独立示例工程**：`examples/NN-xxx/` 各自是完整的 Vite 项目，可以单独拷走单独跑。
2. **贯穿项目单列**：`examples/08-todo-board/` 是主战场，第 04→08 章持续改造它，不重复建工程。
3. **文档与代码同步推进**：每写完一章文档，就实现对应代码；文档里的「参考实现」直接链接到 `src/`
   中的真实文件路径。
4. **先语法、后代码**：每章文档固定使用 §4 的 7 段式模板——**先把本章要用的语法讲透，再带着语法逐行读真实代码**。第 01
   章是这套结构的样板。
5. **每节配一个可运行示例**：§1 的每条语法都有一个独立的 `.vue`
   示例，文档里放链接直接跳过去看效果（详见 §4「配套可运行示例」）。

---

## 0. 技术栈与版本基线（2026-11 核对 npm registry）

| 依赖                            | 版本    | 说明                                             |
|---------------------------------|---------|--------------------------------------------------|
| vue                             | ^3.5.44 | `<script setup>` + `defineModel`（3.4+）         |
| vue-router                      | ^5.4.0  | peer: vue `^3.5.34 \|\| ^4`                      |
| pinia                           | ^4.1.0  | peer: vue `^3.5.11`、typescript `>=5.6`          |
| @vueuse/core                    | ^15.0.0 | 要求 Node >= 22                                  |
| element-plus                    | ^2.14.7 | peer: vue `^3.3.7`                               |
| tailwindcss / @tailwindcss/vite | ^4.3.4  | CSS-first 配置，`@tailwindcss/vite` 支持 Vite 8  |
| typescript                      | ~6.0.3  | `paths` 直接相对 tsconfig 解析，不需要 `baseUrl` |
| vite                            | ^8.3.5  | Rolldown 内核                                    |

安装命令（在对应示例工程目录内执行）：

```bash
pnpm add vue-router@^5 pinia@^4 @vueuse/core@^15 element-plus@^2.14 @element-plus/icons-vue
pnpm add -D tailwindcss@^4 @tailwindcss/vite@^4 unplugin-vue-components unplugin-auto-import vitest @vue/test-utils jsdom
```

工具链：ESLint 9 flat config + `eslint-plugin-vue` + `typescript-eslint` + Prettier、Vue
DevTools、`vue-tsc` 类型检查。

> 环境提示：仓库根的 `.npmrc` 设了 `verify-deps-before-run=false`，让 `pnpm run`
> 不因校验依赖而联网——学习项目依赖变动少，这样脚本跑得快、离线也能跑。想恢复pnpm 默认行为就删掉这个文件。

---

## 1. 仓库结构

```
vue-learning/
├── package.json              # workspace 根：只做脚本编排
├── pnpm-workspace.yaml       # 声明 examples/* 为成员
├── .npmrc                    # verify-deps-before-run=false
├── docs/                     # 教程正文，一章一篇
│   ├── 00-工程化基线.md      ✅
│   ├── 01-Vue3-核心与模板.md  ✅
│   ├── 02-响应式系统.md       ⬜ 待写
│   ├── 03-组件化设计.md       ⬜ 待写
│   ├── 04-Vue-Router.md       ⬜ 待写
│   ├── 05-Pinia-状态管理.md   ⬜ 待写
│   ├── 06-VueUse.md           ⬜ 待写
│   ├── 07-Element-Plus-与-Tailwind.md ⬜ 待写
│   └── 08-综合实战与工程化.md  ⬜ 待写
├── examples/
│   ├── 01-template-syntax/        # 模板语法（独立工程，✅ 已完成）
│   ├── 02-reactivity/             # 响应式系统（⬜ 待建）
│   ├── 03-components/             # 组件化设计（⬜ 待建）
│   ├── 04-router/                 # 路由（⬜ 待建）
│   ├── 05-pinia/                  # 状态管理（⬜ 待建）
│   ├── 06-vueuse/                 # 组合式函数（⬜ 待建）
│   ├── 07-element-plus-tailwind/  # UI 与样式（⬜ 待建）
│   └── 08-todo-board/             # ★ 贯穿项目：待办看板（⬜ 待建）
└── .vscode/  .idea/               # 编辑器配置
```

### 示例工程的固定骨架

每个 `examples/NN-xxx/` 都包含：

```
package.json          # 独立依赖，可单独安装运行
vite.config.ts        # @ 路径别名 + 独立端口（5171 起递增）
tsconfig.json / .app.json / .node.json
eslint.config.js      # flat config，prettier 放最后
.prettierrc.json
index.html
src/
├── main.ts
├── App.vue
├── components/       # base/（通用） + business/（业务）
├── composables/      # useXxx 自定义组合式函数
├── stores/           # pinia
├── router/
├── api/              # 数据请求层
├── types/            # 类型定义
├── utils/
└── styles/           # tailwind.css / element 主题
```

### 统一约定

- 视图放 `views/`、可复用组件放 `components/`、逻辑复用放 `composables/`、**跨页面状态**才进
  `stores/`。
- 所有异步状态统一暴露 `{ data, loading, error }`。
- 类型一律显式定义在 `types/`，禁止 `any`；每个示例都要通过 `pnpm typecheck`。
- **代码风格**：分号/引号归 Prettier，箭头函数与返回类型归 ESLint（组件内用箭头，模块层用
  `export function`）。

---

## 2. 章节大纲与示例映射

> 每章下面都注明了 **§1 语法课清单**（这一章要先讲透的语法/API）和
> **§3 代码精读对象**（要逐行精读哪些文件）——这两栏就是该章文档的施工图。

### 阶段 0 · 工程化基线（0.5 天）→ `examples/01-template-syntax` 的工程配置

- Vite 8 与 Rolldown、项目结构与 dev server 原理。
- TypeScript：`project references`、`vue-tsc -b`、TS 6 废弃 `baseUrl`。
- `@` 别名：Vite 与 TS 两侧都要配。
- ESLint 9 flat config + Prettier 的组合顺序；分号归谁管。
- **产出**：lint / typecheck / build 三条流水线。

**文档**：[`docs/00-工程化基线.md`](00-工程化基线.md) ✅（本章是配置速查，不套 7 段式模板）

---

### 阶段 1 · Vue 3 核心与模板语法（2 天）→ `examples/01-template-syntax`

- SFC 与 `<script setup>`：编译宏（`defineProps` / `defineEmits` / `defineModel`）。
- `v-model` 与修饰符、`v-for` 与 `:key`、`v-if` vs `v-show`、动态 class/style、动态参数。
- 表单双向绑定、事件修饰符（`.prevent` / `.stop`）。
- 组件通信第一课：`props` 向下、`emits` 向上、`defineModel` 双向。
- **产出**：待办清单最小版（可增删、可筛选、有统计）+ `computed`
  vs 普通函数的对照实验面板（页面顶部能直接看到「实算次数」的差异）+ **§1 每节一个可运行示例**
  （`src/demos/` 下 16 个 `.vue`，文档里逐节给链接）。

**文档**：[`docs/01-Vue3-核心与模板.md`](01-Vue3-核心与模板.md) ✅ · **代码**：`examples/01-template-syntax/`

**示例工作台**：`examples/01-template-syntax/src/views/DemoWorkbench.vue` · 目录
<http://localhost:5171/#/demos>

**本章文档结构（7 段式样板）**

- §1 语法课（18 条，编号 ①～⑱）：SFC 结构、顶层变量暴露、插值、`v-bind`、`v-on`
  与修饰符、`v-model`、`v-for`、`:key`、`v-if`/
  `v-else`、`v-show`、动态 class、`defineProps`、`defineEmits`、`ref`、`computed`、组件 props/事件、组件上的
  `v-model` 与 `defineModel`、TS 类型标注。
- §2 数据流图：App ↔ TaskItem ↔ TaskFilterBar 的单向数据流。
- §3 代码精读：`src/App.vue`、`src/components/TaskItem.vue`、`src/components/TaskFilterBar.vue`
  逐段标注编号。
- ✅ 附带校验：写完后用脚本把三个源文件的每一行拿去文档里比对，确保逐行一致 →
  `pnpm run check:doc-sync`。

---

### 阶段 2 · 响应式系统（3 天 · 重点章）→ `examples/02-reactivity`

- 底层机制：`Proxy` / `Reflect`、依赖收集与触发、`effect` 与 `track/trigger`。
- `ref` vs `reactive`；`reactive` 解构丢响应性的原因；`toRef` / `toRefs` / `toRaw` / `unref`。
- `computed` 的惰性求值与缓存；可写 computed（get/set）。
- `watch`（`immediate` / `deep` / `flush`）vs `watchEffect`，副作用清理 `onCleanup`。
- 调度机制：微任务队列、`nextTick`、连续修改只触发一次。
- `shallowRef` / `shallowReactive` / `markRaw`；`useTemplateRef`（3.5 新 API）。
- **动手实验**：手写一个 30~50 行的 `createReactive`，再回头对照 Vue 源码。

**§1 语法课清单**：① `ref` 与模板自动解包 ② `reactive` 与 Proxy ③ `toRef`/`toRefs`/`toRaw`/`unref` ④
`computed` 惰性求值与缓存 ⑤ 可写 computed（get/set）⑥ `watch` 三个选项 ⑦ `watchEffect`
与自动依赖收集 ⑧ `onCleanup` 副作用清理 ⑨ 调度机制与 `nextTick` ⑩ `shallowRef`/`markRaw` ⑪
`useTemplateRef`

**§3 代码精读对象**：`src/reactive.ts`（手写 `createReactive`，逐行标注编号）·
`src/App.vue`（四组对照实验：ref vs reactive、解构丢失 vs toRefs、computed vs 普通函数、watch vs
watchEffect）

**验收**：能解释「为什么 `const { count } = reactive(obj)` 不更新」，并给出两种修复方案。

---

### 阶段 3 · 组件化设计（3 天）→ `examples/03-components`

- 通信选型表：`props/emit` · `v-model` · `slots` · `provide/inject` · `attrs` 透传。
- 插槽：默认、具名、作用域插槽，以及「插槽透传」模式。
- 动态组件：`<component :is>`、`KeepAlive`、`<Teleport>`、`Suspense`。
- 生命周期与 `watch` 的取舍；`defineAsyncComponent` 与加载失败态。
- 组件库式设计：`useXxx` 封装 props + 事件。
- 性能：长列表、`v-memo`、避免不必要渲染。
- **产出**：可配置的通用表格组件（props / emits / slots API 设计）。

**§1 语法课清单**：① 默认/具名/作用域插槽 ② 插槽透传 ③ `provide`/`inject` ④ `attrs` 透传与
`inheritAttrs` ⑤ `<component :is>` ⑥ `KeepAlive` ⑦ `Teleport` ⑧ `Suspense` ⑨ 生命周期钩子 ⑩
`defineAsyncComponent` ⑪ `v-memo`

**§3 代码精读对象**：`src/components/DataTable.vue`（通用表格的 props/emits/slots 三件套）·
`src/App.vue`（用法与配置）

**验收**：能独立设计一个通用表格组件的 API，并说明每个插槽的适用场景。

---

### 阶段 4 · Vue Router（2.5 天）→ `examples/04-router` + `examples/08-todo-board` 起步

- `createRouter`、history / hash 模式、`<RouterView>` / `<RouterLink>`、激活态。
- 嵌套路由 + 布局（`layouts/`）。
- 动态参数 `/:id`、查询参数、`meta`（标题 / 权限 / 缓存标记）。
- 编程式导航、导航守卫（全局 / 路由级 / 组件内）、`scrollBehavior`、懒加载。
- **v5 新特性**：包内已内置基于 unplugin 的**文件式路由**（`unplugin` / `auto-routes`
  导出）与**类型化路由**（ `experimental/typed-router`），可作为进阶选学。
- **待办看板起步**：布局 + `/tasks`、`/tasks/:id`、`/login` 三个路由。

**§1 语法课清单**：① `createRouter` + `createWebHistory` ② `<RouterView>` / `<RouterLink>`
与激活态 ③ 嵌套路由与布局 ④ 动态参数 `params` ⑤ 查询参数 `query` ⑥ 路由 `meta`
⑦ 编程式导航 ⑧ 导航守卫三类 ⑨ `scrollBehavior` ⑩ 路由懒加载 ⑪ v5 文件式路由与类型化路由（进阶）

**§3 代码精读对象**：`src/router/index.ts`（路由表 + 守卫）·
`src/layouts/DefaultLayout.vue`（嵌套路由骨架）·
`src/views/TasksView.vue`（列表页：路由参数 + 查询参数读写）

**验收**：刷新详情页不报错、后退行为正确、未登录被守卫拦截并带 `redirect` 回跳。

---

### 阶段 5 · Pinia 状态管理（2.5 天）→ `examples/05-pinia` + 待办看板

- `defineStore` 的 Options 写法 vs **Setup 写法**（推荐）。
- `state` / `getters` / `actions`；`storeToRefs` 解决解构丢响应性。
- `$patch` / `$reset` / `$subscribe` / `$onAction`。
- 多个 store 协作、store 内组合其他 store。
- 插件：`pinia-plugin-persistedstate` 持久化、自定义插件做埋点。
- 状态边界设计：什么该进 store，什么只是组件内 UI 状态。
- **待办看板**：taskStore（列表 / 筛选 / 分页 / 详情缓存）+ userStore（登录态，持久化）+
  uiStore（侧边栏、主题）。

**§1 语法课清单**：① `defineStore` Options 写法 ② Setup 写法（推荐） ③ `state` / `getters` /
`actions` ④ `storeToRefs` ⑤ `$patch` / `$reset` ⑥ `$subscribe` / `$onAction` ⑦
store 间组合 ⑧ 插件机制与持久化

**§3 代码精读对象**：`src/stores/task.ts`（Setup 写法：state/getters/actions）·
`src/stores/user.ts`（持久化插件）· `src/App.vue`（组件里消费 store 的正确姿势）

**验收**：列表页刷新后筛选条件仍保留（与路由 query 同步），收藏状态在多个页面实时一致。

---

### 阶段 6 · VueUse（2 天）→ `examples/06-vueuse` + 待办看板

- 组合式函数的本质与命名规范、返回值约定。
- 响应式：`useDebounceFn` / `useThrottleFn` / `useIntervalFn` / `useRafFn`。
- 浏览器 API：`useEventListener` / `useWindowSize` / `useDocumentVisibility` / `useClipboard` /
  `useLocalStorage` / `useStorage` / `usePermission`。
- 观察者：`useIntersectionObserver` / `useResizeObserver` / `useMediaQuery`。
- 异步：`useAsyncState` / `useFetch` / `useAsyncQueue` / `useInfiniteScroll`。
- 实用：`useDark` / `useToggle` / `useTitle` / `useFuse` / `useSortable`。
- **自写**：`useTaskQuery`（筛选 + 分页 + 防抖 + URL 同步）。
- 竞态处理：旧请求晚返回覆盖新数据（`useAsyncState` 的 execute 覆盖机制）。

**§1 语法课清单**：① 组合式函数规范与返回值约定 ② `useDebounceFn` / `useThrottleFn` ③
`useEventListener` ④ `useStorage` / `useLocalStorage` ⑤ `useMediaQuery` ⑥ `useIntersectionObserver`
⑦ `useAsyncState` ⑧ `useFetch` / `useAsyncQueue` ⑨ `useInfiniteScroll` ⑩ `useDark` / `useTitle` ⑪
`useSortable`

**§3 代码精读对象**：`src/composables/useTaskQuery.ts`（自写：筛选 + 分页 + 防抖 + URL 同步）·
`src/composables/useSearch.ts`（用 VueUse 组合实现）· `src/App.vue`

**验收**：能把「防抖 + 请求 + 取消」这套重复代码抽成一个可复用 composable，并说清竞态是怎么处理的。

---

### 阶段 7 · Element Plus + Tailwind CSS（3 天）→ `examples/07-element-plus-tailwind`

**7.1 Element Plus**

- 按需引入：`unplugin-vue-components` + `ElementPlusResolver`；图标 `@element-plus/icons-vue`。
- 全量 vs 按需的**产物体积实测对比**（用 `vite build` 产物说话）。
- 核心组件实操：Table（固定列、自定义列插槽、排序）、Form +
  FormItem（校验、动态增删项）、Pagination、Dialog / Drawer、Select / TreeSelect /
  Cascader、DatePicker、Tabs、Descriptions、Message / MessageBox。
- 深色模式：`import 'element-plus/theme-chalk/dark/css-vars.css'` + `html.dark`。

**7.2 Tailwind CSS v4**

- CSS-first 配置：`@import "tailwindcss"` + `@theme` 设计令牌，**没有 tailwind.config.js**。
- 工具类速查：布局、间距、文本、变体（`hover:` / `dark:` / `group` / `peer`）、任意值
  `w-[137px]`、自定义变体 `@custom-variant`。
- 响应式断点与 `@container`。
- Vite 集成：`@tailwindcss/vite` + `@source` 扫描范围。
- **与 Element Plus 共存**（本章最大的坑）：
    - Tailwind v4 的 **preflight** 会重置 Element Plus 内部样式（按钮边框、表单字体、表格边框）；
    - 推荐在 `src/styles/tailwind.css` 显式分层并按需跳过 preflight：

      ```css
      @layer theme, base, element, components, utilities;
      @import "tailwindcss/theme.css" layer(theme);
      @import "tailwindcss/utilities.css" layer(utilities);
      ```

      （省略 `preflight.css` 即关闭重置；或用 `@import "tailwindcss" prefix(tw);` 让工具类统一带 `tw-`
      前缀彻底隔离。）

    - 层顺序决定覆盖关系：Element Plus 样式放 `element` 层，业务样式放 `components` 层。
- **组合策略**：EP 负责复杂交互组件（表格、表单、弹窗），Tailwind 负责布局与视觉细节，不去改 EP 组件内部结构。

**§1 语法课清单**：① 按需引入与 `ElementPlusResolver` ② Table 的列插槽与排序 ③ Form /
FormItem 校验规则 ④ Pagination ⑤ Dialog / Message / MessageBox ⑥ EP 主题变量 `--el-*` ⑦ 深色模式
`dark/css-vars.css` ⑧ Tailwind v4 `@import "tailwindcss"` + `@theme` ⑨ 工具类与变体（`hover:` /
`dark:` / `group` / `peer`） ⑩ `@layer` 分层与 preflight 隔离 ⑪ `@source` 扫描范围

**§3 代码精读对象**：`src/styles/tailwind.css`（分层配置与 `@theme` 令牌）·
`src/views/TaskTable.vue`（EP Table + Tailwind布局的组合策略）·
`vite.config.ts`（`@tailwindcss/vite` 接入）

**验收**：能说清 preflight 冲突的成因与解决方案；产物体积对比有真实数据支撑。

---

### 阶段 8 · 综合实战与工程化（3 天）→ `examples/08-todo-board` 收尾

- **数据层**：`api/` 封装 fetch，统一 baseURL、错误处理、`AbortController`
  取消、类型化返回；本地 mock JSON 模拟 loading / error / empty 三态。
- **任务看板进阶**：拖拽排序（`useSortable` + `vue-draggable`
  或原生 DnD）、按标签/优先级筛选、看板视图 ↔ 列表视图切换、标签颜色。
- 边界与体验：全局错误处理、404 页、骨架屏（`v-loading` / `el-skeleton`）、空状态插画。
- 类型：`vue-tsc` 零报错，store / props / API 全类型化。
- 测试：Vitest + `@vue/test-utils`，覆盖 2~3 个关键组件与 1 个 store。
- 构建优化：产物分析、路由级代码分割、体积对比记录。
- 收尾：README、目录规范、提交规范、部署演练。

**§1 语法课清单**（本章不再引入新语法，讲的是**工程模式**）：① `api/` 层封装模式与统一错误处理 ②
loading / error / empty 三态约定 ③ `AbortController` 取消请求 ④ 骨架屏与空状态 ⑤
`defineAsyncComponent` + 加载失败态 ⑥ Vitest + `@vue/test-utils` 的组件测试写法 ⑦ 路由级代码分割

**§3 代码精读对象**：`src/api/tasks.ts`（数据层最终形态）· `src/stores/task.ts`（store 最终形态）·
`src/views/BoardView.vue` （看板视图）· `tests/task.spec.ts`（测试写法）

**验收**：应用可运行、可测试、可部署；三态与错误处理在 UI 上真实可见。

---

## 3. 建议节奏

| 阶段 | 主题                    | 示例工程                                     | 耗时   | 状态 |
|------|-------------------------|----------------------------------------------|--------|------|
| 0    | 工程化基线              | `01-template-syntax`（工程部分）             | 0.5 天 | ✅   |
| 1    | Vue 3 核心与模板        | `01-template-syntax`                         | 2 天   | ✅   |
| 2    | 响应式系统              | `02-reactivity`                              | 3 天   | ⬜   |
| 3    | 组件化设计              | `03-components`                              | 3 天   | ⬜   |
| 4    | Vue Router              | `04-router` + `08-todo-board`                | 2.5 天 | ⬜   |
| 5    | Pinia                   | `05-pinia` + `08-todo-board`                 | 2.5 天 | ⬜   |
| 6    | VueUse                  | `06-vueuse` + `08-todo-board`                | 2 天   | ⬜   |
| 7    | Element Plus + Tailwind | `07-element-plus-tailwind` + `08-todo-board` | 3 天   | ⬜   |
| 8    | 综合实战                | `08-todo-board`                              | 3 天   | ⬜   |

**合计约 21.5 天**（按每天 4~6 小时有效投入）。只求通识可压缩阶段 0/8，保留 2/4/5/7。

---

## 4. 每章文档的固定结构（先语法 → 后代码）

第 02～08 章**统一**使用下面这套 7 段式模板。第 01 章是已完成的样板，可直接参照。

| 段落 | 标题                   | 内容要求                               |
|------|------------------------|----------------------------------------|
| 1    | **§1 语法课**          | **本章要用到的全部语法/API**，逐条讲透 |
| 2    | **§2 数据流 / 机制图** | 本章的数据或控制流向（ASCII 图）       |
| 3    | **§3 代码精读**        | **逐段贴真实代码**，每处标注语法编号   |
| 4    | **§4 动手练习**        | 3~4 个递进任务，标注预计耗时           |
| 5    | **§5 参考实现**        | 文件路径 + 「主要语法」对照表          |
| 6    | **§6 自测清单**        | 5~8 条「能说出 / 能做到」              |
| 7    | **§7 延伸阅读**        | 官方文档锚点                           |

### 写法要求

- §1 每条统一三段：**语法**（最小示例）→ **作用**（一句话说清机制）→ **用在哪**（指向 §3）。
- **示例必须自包含**：文字里出现的每个父组件、子组件、兄弟组件，示例里都要出现，不允许只给一半。讲
  `defineProps` / `defineEmits` / `defineModel` 这类涉及父子关系的语法，父子两半都要贴出来。
- **示例要标注文件名和角色**：每个代码块前写明是哪个文件、扮演什么角色（如「**子组件**
  `src/components/TaskItem.vue`」「 **父组件** `src/App.vue`」），读者不用猜谁是谁。
- **示例里的命名要故意区分**：prop 名和父组件的变量名不要写成同一个词（如
  `:task="selectedTask"`），避免读者误以为两边必须同名。
- §3 的代码与 `examples/NN-xxx/src/` 里的真实文件**代码行逐行一致**（允许去掉 `<template>`
  包裹造成的整体缩进左移；源码里的说明性注释在文档里替换成 ① 编号标注）。写完跑
  `pnpm run check:doc-sync` 校验，确保 0 行未匹配。
- **文档格式统一走根目录的 `.prettierrc.json`**：`pnpm run format:docs`。根配置里
  `embeddedLanguageFormatting` 必须保持
  `off`——开启后 prettier 会把 ① 编号标注挪进代码块内部、把带注释的属性列表排乱，代码样例就废了。
- 只讲**当前版本**的写法，不写历史对比、不写「某规则不存在」这类注脚。

### 配套可运行示例（§1 每节一个）

§1 的每条语法都要配一个**能跑起来看效果**的独立示例，文档里放链接直接跳过去。这是第 01 章已经跑通的做法，第 02～08 章沿用：

| 项       | 约定                                                                       |
|----------|----------------------------------------------------------------------------|
| 目录     | `examples/NN-xxx/src/demos/`，**一个语法点一个 `.vue` 文件**               |
| 命名     | `Demo<语法名>.vue`（`DemoComputed.vue` / `DemoWatchEffect.vue` …）         |
| 首行注释 | 文件第一行用 HTML 注释标明所属小节：`<!-- §1.6 ⑥ v-model：… -->`           |
| 索引     | `src/demos/registry.ts`：小节号 → 组件 + 源码文件路径                      |
| 工作台   | `src/views/DemoWorkbench.vue`：顶部小节导航 + 运行效果                     |
| 跳转     | hash 路由 `#/demos/<id>`，文档链接形如 `http://localhost:5171/#/demos/2-4` |
| 文档写法 | 每节标题下紧跟一行 `> ▶️ **运行示例**：[…](…) · 源码：[…](…)`               |

硬要求：

- **示例必须自包含**：一个 `.vue` 只讲一个语法点，能单独打开、单独读懂。
- **首行注明所属小节**：示例文件的第一行写 HTML 注释，标明它是哪一节的示例——
  `<!-- §1.6 ⑥ v-model：原生控件的双向绑定，以及它展开后的样子 -->`。节号要和 `registry.ts` 的
  `section` 字段一致，编号与 `syntax` 字段一致。子组件没有独立小节，标明它归属的父小节和角色（如
  `<!-- §1.9 ⑨ v-if 的子组件：用来观察节点被销毁与重建 -->`）。
- **必须有可见效果**：能点、能看见差别（计数器、状态变化、日志、真实 DOM 行为），而不是把代码摆在那儿让人自己脑补。只讲结论（「
  `computed`
  会缓存」）的示例不合格。
- **界面保持极简**：只用原生标签（`ul` / `table` / `pre` / `button`），不堆装饰性 class 和
  `<style scoped>`；只有「知识点本身就是样式」时才写少量 CSS（如 1.11 动态 class）。界面丑一点没关系——示例是拿来读代码的，不是拿来欣赏的，别给学习增加心智负担。
- **不提前使用后面章节的语法**：示例里出现的每个语法点，都必须是本节或前面章节已经讲过的。确实绕不开往后借用时（比如「数据要变只能靠事件触发」），在示例里用一行注释标明它是第几节的内容，别让读者以为已经学过了。
- **示例是辅助材料**：正文仍然是「§1 讲语法 → §3 读真实代码」，示例只解决「看不出长什么样」。

> 第 01 章的落地范例：`examples/01-template-syntax/src/demos/`（16 个示例）+
> `src/views/DemoWorkbench.vue`，文档见 `docs/01-Vue3-核心与模板.md`
> 的「配套可运行示例」一节。插入链接的脚本：`scripts/add-demo-links.py`（改小节号映射后可复用到其他章节）。

---

## 5. 常见坑速查（写教程时重点展开）

- `reactive` 解构丢响应性。
- `v-for` 用 index 当 key 导致状态错位。
- 路由 query 与 store 双向同步造成死循环。
- `watch` 深度侦听大对象带来性能问题。
- Tailwind v4 preflight 破坏 Element Plus 样式。
- Element Plus 全量引入导致产物体积暴涨。
- `defineAsyncComponent` 未处理加载失败态。
- `useAsyncState` 竞态：旧请求晚返回覆盖新数据。
- `pnpm run` 前会联网校验依赖，registry 不通时卡死 → 根目录 `.npmrc` 设
  `verify-deps-before-run=false`。
- Prettier 与 IDE 自带格式化器打架 → 装 Prettier 插件并指定配置文件；`pnpm lint` 里的
  `prettier --check` 是最后一道防线。
