import type { Component } from 'vue';

import DemoInterpolation from '@/demos/DemoInterpolation.vue';
import DemoVBind from '@/demos/DemoVBind.vue';
import DemoVOn from '@/demos/DemoVOn.vue';
import DemoVModel from '@/demos/DemoVModel.vue';
import DemoVFor from '@/demos/DemoVFor.vue';
import DemoVKey from '@/demos/DemoVKey.vue';
import DemoVIf from '@/demos/DemoVIf.vue';
import DemoVShow from '@/demos/DemoVShow.vue';
import DemoDynamicClass from '@/demos/DemoDynamicClass.vue';
import DemoDefineProps from '@/demos/DemoDefineProps.vue';
import DemoDefineEmits from '@/demos/DemoDefineEmits.vue';
import DemoRef from '@/demos/DemoRef.vue';
import DemoComputed from '@/demos/DemoComputed.vue';
import DemoPropsEvents from '@/demos/DemoPropsEvents.vue';
import DemoDefineModel from '@/demos/DemoDefineModel.vue';
import DemoTypescript from '@/demos/DemoTypescript.vue';

export interface DemoEntry {
  /** 路由 id，同时也是文档里的链接锚点，如 1-3 */
  id: string;
  /** 文档小节号，如 1.3 */
  section: string;
  /** 语法编号与名称，如 ③ 插值 {{ }} */
  syntax: string;
  /** 一句话说清这节讲什么 */
  summary: string;
  /** 源码在仓库里的相对路径 */
  file: string;
  /** 组件本体 */
  component: Component;
}

/**
 * 章节 01 的示例索引。
 *
 * 约定：文档 §1 的每一节都对应这里的一条记录，
 * 文档里的「运行示例」链接就是 `#/demos/<id>`。
 */
export const demos: DemoEntry[] = [
  {
    id: '1-3',
    section: '1.3',
    syntax: '③ 插值 {{ }}',
    summary: '表达式渲染成文本，HTML 会被自动转义',
    file: 'src/demos/DemoInterpolation.vue',
    component: DemoInterpolation,
  },
  {
    id: '1-4',
    section: '1.4',
    syntax: '④ v-bind / :',
    summary: '属性绑定，:value 的单向性，:class / :style 的对象与数组语法',
    file: 'src/demos/DemoVBind.vue',
    component: DemoVBind,
  },
  {
    id: '1-5',
    section: '1.5',
    syntax: '⑤ v-on / @',
    summary: '事件处理器的三种写法与五种修饰符',
    file: 'src/demos/DemoVOn.vue',
    component: DemoVOn,
  },
  {
    id: '1-6',
    section: '1.6',
    syntax: '⑥ v-model',
    summary: '原生控件的双向绑定，以及它展开后的样子',
    file: 'src/demos/DemoVModel.vue',
    component: DemoVModel,
  },
  {
    id: '1-7',
    section: '1.7',
    syntax: '⑦ v-for',
    summary: '遍历数组与对象，以及 v-if 与 v-for 的坑',
    file: 'src/demos/DemoVFor.vue',
    component: DemoVFor,
  },
  {
    id: '1-8',
    section: '1.8',
    syntax: '⑧ :key',
    summary: '用下标当 key，输入框里的字会跟错人',
    file: 'src/demos/DemoVKey.vue',
    component: DemoVKey,
  },
  {
    id: '1-9',
    section: '1.9',
    syntax: '⑨ v-if / v-else',
    summary: '条件为假时销毁 DOM，子组件状态一起归零',
    file: 'src/demos/DemoVIf.vue',
    component: DemoVIf,
  },
  {
    id: '1-10',
    section: '1.10',
    syntax: '⑩ v-show',
    summary: '只切 display，节点始终留在 DOM 里',
    file: 'src/demos/DemoVShow.vue',
    component: DemoVShow,
  },
  {
    id: '1-11',
    section: '1.11',
    syntax: '⑪ 动态 class',
    summary: '静态 class 与 :class 是合并关系',
    file: 'src/demos/DemoDynamicClass.vue',
    component: DemoDynamicClass,
  },
  {
    id: '1-12',
    section: '1.12',
    syntax: '⑫ defineProps',
    summary: '父传子，prop 名与父组件变量名的区别',
    file: 'src/demos/DemoDefineProps.vue',
    component: DemoDefineProps,
  },
  {
    id: '1-13',
    section: '1.13',
    syntax: '⑬ defineEmits',
    summary: '子发父，事件名与参数靠名字对上',
    file: 'src/demos/DemoDefineEmits.vue',
    component: DemoDefineEmits,
  },
  {
    id: '1-14',
    section: '1.14',
    syntax: '⑭ ref',
    summary: '模板自动解包，脚本里要写 .value',
    file: 'src/demos/DemoRef.vue',
    component: DemoRef,
  },
  {
    id: '1-15',
    section: '1.15',
    syntax: '⑮ computed',
    summary: 'computed 与普通函数的差别在「算几次」',
    file: 'src/demos/DemoComputed.vue',
    component: DemoComputed,
  },
  {
    id: '1-16',
    section: '1.16',
    syntax: '⑯ props 绑定与事件监听',
    summary: '父 → 子 与 子 → 父，两条线怎么对上',
    file: 'src/demos/DemoPropsEvents.vue',
    component: DemoPropsEvents,
  },
  {
    id: '1-17',
    section: '1.17',
    syntax: '⑰ 组件 v-model 与 defineModel',
    summary: '手写版与 defineModel 版跑起来一模一样',
    file: 'src/demos/DemoDefineModel.vue',
    component: DemoDefineModel,
  },
  {
    id: '1-18',
    section: '1.18',
    syntax: '⑱ TypeScript 类型标注',
    summary: '类型在编译期被擦除，错误提前到保存文件时报',
    file: 'src/demos/DemoTypescript.vue',
    component: DemoTypescript,
  },
];
