import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'

export default defineConfigWithVueTs(
  {
    name: 'app/ignores',
    ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**', '**/.vite/**'],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  {
    name: 'app/rules',
    rules: {
      // 示例里允许单文件组件（如 App.vue）使用单词命名
      'vue/multi-word-component-names': 'off',

      // ── 代码风格 ─────────────────────────────────────────────
      // 函数声明必须显式标注返回类型；
      // allowExpressions: true 允许回调等函数表达式省略（推断即可）
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      // 导出到模块边界的函数必须显式标注返回类型（对外 API 契约）
      '@typescript-eslint/explicit-module-boundary-types': 'error',
    },
  },
  {
    // 组件内统一使用箭头函数 + const，不允许 function 声明
    // （注：typescript-eslint v8.72 未提供 consistent-function-style，
    //   这里用 ESLint 核心的 func-style 达到同样效果）
    name: 'app/style/vue',
    files: ['**/*.vue'],
    rules: {
      'func-style': ['error', 'expression', { allowArrowFunctions: true }],
    },
  },
  {
    // 模块层（composables / utils / stores）允许 function 声明，
    // 与 VueUse / Pinia / Vue 核心的 `export function` 惯例一致
    name: 'app/style/ts',
    files: ['**/*.ts'],
    rules: {
      'func-style': 'off',
    },
  },
  // 必须放在最后：关闭所有与 Prettier 冲突的格式规则（含 ESLint 自带的 semi）
  prettier,
)
