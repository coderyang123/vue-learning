import type { Component } from 'vue';

import DemoRef from '@/demos/DemoRef.vue';
import DemoReactive from '@/demos/DemoReactive.vue';
import DemoToRef from '@/demos/DemoToRef.vue';
import DemoComputedCache from '@/demos/DemoComputedCache.vue';
import DemoWritableComputed from '@/demos/DemoWritableComputed.vue';
import DemoWatch from '@/demos/DemoWatch.vue';
import DemoWatchEffect from '@/demos/DemoWatchEffect.vue';
import DemoOnCleanup from '@/demos/DemoOnCleanup.vue';
import DemoNextTick from '@/demos/DemoNextTick.vue';
import DemoShallow from '@/demos/DemoShallow.vue';
import DemoTemplateRef from '@/demos/DemoTemplateRef.vue';

export interface DemoEntry {
  /** 路由 id，同时也是文档里的链接锚点，如 2-3 */
  id: string;
  /** 文档小节号，如 2.3 */
  section: string;
  /** 语法编号与名称，如 ③ toRef / toRefs */
  syntax: string;
  /** 一句话说清这节讲什么 */
  summary: string;
  /** 源码在仓库里的相对路径 */
  file: string;
  /** 组件本体 */
  component: Component;
}

/**
 * 章节 02 的示例索引。
 *
 * 约定：文档 §1 的每一节都对应这里的一条记录，
 * 文档里的「运行示例」链接就是 `#/demos/<id>`。
 */
export const demos: DemoEntry[] = [
  {
    id: '2-1',
    section: '2.1',
    syntax: '① ref 与模板自动解包',
    summary: '模板里写 count，脚本里写 count.value',
    file: 'src/demos/DemoRef.vue',
    component: DemoRef,
  },
  {
    id: '2-2',
    section: '2.2',
    syntax: '② reactive 与 Proxy',
    summary: '改深层属性、新增属性，界面都跟着变',
    file: 'src/demos/DemoReactive.vue',
    component: DemoReactive,
  },
  {
    id: '2-3',
    section: '2.3',
    syntax: '③ toRef / toRefs / toRaw / unref',
    summary: '解构丢掉响应性，toRefs 把它接回来',
    file: 'src/demos/DemoToRef.vue',
    component: DemoToRef,
  },
  {
    id: '2-4',
    section: '2.4',
    syntax: '④ computed 的惰性求值与缓存',
    summary: '依赖没变就不重算，没人读就不算',
    file: 'src/demos/DemoComputedCache.vue',
    component: DemoComputedCache,
  },
  {
    id: '2-5',
    section: '2.5',
    syntax: '⑤ 可写 computed（get / set）',
    summary: '读是拼名字，写是拆名字',
    file: 'src/demos/DemoWritableComputed.vue',
    component: DemoWritableComputed,
  },
  {
    id: '2-6',
    section: '2.6',
    syntax: '⑥ watch 的三个选项',
    summary: 'immediate / deep / flush 的区别都在日志里',
    file: 'src/demos/DemoWatch.vue',
    component: DemoWatch,
  },
  {
    id: '2-7',
    section: '2.7',
    syntax: '⑦ watchEffect 与自动依赖收集',
    summary: '它读过的依赖，它自己就盯着',
    file: 'src/demos/DemoWatchEffect.vue',
    component: DemoWatchEffect,
  },
  {
    id: '2-8',
    section: '2.8',
    syntax: '⑧ onCleanup 副作用清理',
    summary: '新副作用开跑前，旧的先取消',
    file: 'src/demos/DemoOnCleanup.vue',
    component: DemoOnCleanup,
  },
  {
    id: '2-9',
    section: '2.9',
    syntax: '⑨ 调度机制与 nextTick',
    summary: '连续改三次，界面只更新一次',
    file: 'src/demos/DemoNextTick.vue',
    component: DemoNextTick,
  },
  {
    id: '2-10',
    section: '2.10',
    syntax: '⑩ shallowRef / shallowReactive / markRaw',
    summary: '浅层响应式只跟到第一层',
    file: 'src/demos/DemoShallow.vue',
    component: DemoShallow,
  },
  {
    id: '2-11',
    section: '2.11',
    syntax: '⑪ useTemplateRef',
    summary: '3.5 的新写法，按字符串 key 拿到 DOM 元素',
    file: 'src/demos/DemoTemplateRef.vue',
    component: DemoTemplateRef,
  },
];
