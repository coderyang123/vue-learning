# vue-learning

一个用于系统学习 **Vue 3 及其周边生态** 的实战型项目。采用 **pnpm workspace 多示例工程** 结构：每一章都有独立可运行的 Vite
示例，并由一个贯穿式项目（待办清单 / 任务看板）持续演进。

技术栈：Vue 3.5 · TypeScript 6 · Vite 8 · Vue Router 5 · Pinia 4 · VueUse 15 · Element Plus 2.14 · Tailwind CSS 4

## 学习路线

- 📖 **总纲**：[docs/TUTORIAL.md](docs/TUTORIAL.md)
- 章节文档：`docs/` 目录，一章一篇

| 阶段 | 主题                    | 示例工程                            | 状态 |
|------|-------------------------|-------------------------------------|------|
| 00   | 工程化基线              | `examples/01-template-syntax`       | ✅   |
| 01   | Vue 3 核心与模板语法    | `examples/01-template-syntax`       | ✅   |
| 02   | 响应式系统              | `examples/02-reactivity`            | ✅   |
| 03   | 组件化设计              | `examples/03-components`            | ⬜   |
| 04   | Vue Router              | `examples/04-router`                | ⬜   |
| 05   | Pinia 状态管理          | `examples/05-pinia`                 | ⬜   |
| 06   | VueUse                  | `examples/06-vueuse`                | ⬜   |
| 07   | Element Plus + Tailwind | `examples/07-element-plus-tailwind` | ⬜   |
| 08   | 综合实战（待办看板）    | `examples/08-todo-board`            | ⬜   |

## 可运行示例

每章文档的**每一节语法**都配一个独立的可运行示例：启动 dev server 后，文档里的「▶️ 运行示例」
链接直接跳到该示例的页面，点开就能看到效果。

```bash
pnpm dev                              # 启动后打开 http://localhost:5171
open http://localhost:5171/#/demos    # 示例工作台（全部示例目录）
```

- 第 01 章的示例在 `examples/01-template-syntax/src/demos/`（16 个语法点各一个 `.vue`），
  工作台在 `src/views/DemoWorkbench.vue`
- 第 02 章的示例在 `examples/02-reactivity/src/demos/`（11 个语法点各一个 `.vue`），
  工作台同样在 `src/views/DemoWorkbench.vue`

后续章节沿用同一套约定，详见 [docs/TUTORIAL.md](docs/TUTORIAL.md) §4。

## 目录结构

```
vue-learning/
├── package.json            # workspace 根：只做脚本编排
├── pnpm-workspace.yaml
├── docs/                   # 教程正文
└── examples/
    ├── 01-template-syntax/ # 独立 Vite 工程，自带 package.json
    ├── 02-reactivity/      # 响应式系统
    └── ...
```

每个 `examples/*` 都是**自包含**的工程，可以单独拷走单独运行：

```bash
cd examples/01-template-syntax
pnpm install && pnpm dev
```

## 常用命令（在仓库根执行）

```bash
pnpm install     # 一次性安装所有示例的依赖
pnpm dev         # 并行启动所有示例的 dev server
pnpm lint        # 并行 ESLint
pnpm typecheck   # 并行 vue-tsc 类型检查
pnpm build       # 并行生产构建
```

单个示例：

```bash
pnpm --filter @example/01-template-syntax dev
```

## 贯穿项目

**待办清单 / 任务看板**：从第 04 章（路由）开始建立，后续每章都在 `examples/08-todo-board/` 上继续演进，最终是一个可运行、可测试、可部署的完整应用。
