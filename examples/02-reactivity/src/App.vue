<script setup lang="ts">
import { computed, reactive, ref, toRefs, watch, watchEffect } from 'vue';
import { createReactive, effect } from '@/reactive';
import type { CounterState } from '@/types';

// ── 实验一：ref vs reactive ──────────────────────────────────────────
const refCount = ref(0);
const reactiveState = reactive<CounterState>({ count: 0, label: 'reactive 对象' });

// ── 实验二：解构丢响应性 vs toRefs ──────────────────────────────────
const plainState = reactive({ count: 0 });
const { count: brokenCount } = plainState; // 解构：拿到的是一次性的快照
const linkedState = reactive({ count: 0 });
const { count: linkedCount } = toRefs(linkedState); // toRefs：拿到的还是 ref

// ── 实验三：computed vs 普通函数 ────────────────────────────────────
const tasks = ref([{ id: 1, title: '读 Vue 3 响应式源码', done: true }]);
let computedRuns = 0;
let methodRuns = 0;
const renderTick = ref(0);

const remaining = computed((): number => {
  computedRuns++;
  return tasks.value.filter((task) => !task.done).length;
});

const remainingByMethod = (): number => {
  methodRuns++;
  return tasks.value.filter((task) => !task.done).length;
};

// ── 实验四：watch vs watchEffect ────────────────────────────────────
const probe = ref(0);

// watch 的回调不参与依赖收集，回调里写普通变量是安全的
let watchRuns = 0;

// watchEffect 的函数体本身就是被收集依赖的地方，
// 所以这里只能用普通变量：写成 ref 会让副作用依赖自己写的那个 ref，形成自触发
let effectRuns = 0;
let effectProbe = 0;

watch(probe, (): void => {
  watchRuns++;
});

watchEffect((): void => {
  effectRuns++;
  effectProbe = probe.value;
});

// ── 手写 createReactive：依赖收集 / 触发是真的在跑 ──────────────────
const manual = createReactive({ count: 0, nested: { level: 0 } });
const manualLog = ref<string[]>([]);

effect((): void => {
  manualLog.value.unshift(`[effect] count=${manual.count} level=${manual.nested.level}`);
});

// 脚本里读 ref 必须写 .value，模板里则不用写
const readRefInScript = (): number => refCount.value;

const bumpRef = (): void => {
  refCount.value++;
};

const bumpReactive = (): void => {
  reactiveState.count++;
};

const bumpBoth = (): void => {
  plainState.count++;
  linkedState.count++;
};

const triggerRerender = (): void => {
  renderTick.value++;
};

const bumpProbe = (): void => {
  probe.value++;
};

const bumpManual = (): void => {
  manual.count++;
  manual.nested.level++;
};
</script>

<template>
  <main class="lab">
    <h1>响应式实验室</h1>
    <p class="lab__hint">第 02 章的四组对照实验：每组只改一个变量，看清差别在哪。</p>

    <!-- 实验一：ref vs reactive -->
    <section class="exp">
      <h2>实验一 · ref vs reactive</h2>
      <div class="exp__cols">
        <div>
          <h3>ref</h3>
          <p>模板里看到：{{ refCount }}</p>
          <p>脚本里读到：{{ readRefInScript() }}</p>
          <button type="button" @click="bumpRef">ref +1</button>
        </div>
        <div>
          <h3>reactive</h3>
          <p>count：{{ reactiveState.count }} / label：{{ reactiveState.label }}</p>
          <button type="button" @click="bumpReactive">reactive +1</button>
        </div>
      </div>
      <p class="exp__note">
        ref 在脚本里要写 <code>.value</code>，reactive 不用；两者的模板写法一样，都是直接写变量名。
      </p>
    </section>

    <!-- 实验二：解构丢响应性 vs toRefs -->
    <section class="exp">
      <h2>实验二 · 解构丢响应性 vs toRefs</h2>
      <div class="exp__cols">
        <div>
          <h3>解构（丢响应性）</h3>
          <p>界面上：{{ brokenCount }} / 对象上：{{ plainState.count }}</p>
          <p class="exp__bad">点下面的按钮，对象上的 count 变了，这里纹丝不动。</p>
        </div>
        <div>
          <h3>toRefs（保持响应性）</h3>
          <p>界面上：{{ linkedCount }} / 对象上：{{ linkedState.count }}</p>
          <p class="exp__good">点下面的按钮，两边一起变。</p>
        </div>
      </div>
      <button type="button" @click="bumpBoth">两个对象的 count 各 +1</button>
      <p class="exp__note">
        <code>const &#123;&#123; count &#125;&#125; = reactive(obj)</code> 里的
        <code>count</code> 是普通数字，读一次就固定了。
      </p>
    </section>

    <!-- 实验三：computed vs 普通函数 -->
    <section class="exp">
      <h2>实验三 · computed vs 普通函数</h2>
      <table class="exp__table">
        <thead>
          <tr>
            <th>写法</th>
            <th>结果</th>
            <th>实算次数</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>computed</td>
            <td>{{ remaining }}</td>
            <td>{{ computedRuns }} 次</td>
          </tr>
          <tr>
            <td>普通函数</td>
            <td>{{ remainingByMethod() }}</td>
            <td>{{ methodRuns }} 次</td>
          </tr>
        </tbody>
      </table>
      <p>
        <button type="button" @click="triggerRerender">触发一次重渲染</button>
        已触发重渲染 {{ renderTick }} 次
      </p>
      <p class="exp__note">
        两者结果一样，差别在「算几次」：computed 只在依赖变化时重算，普通函数每次调用都重算。
      </p>
    </section>

    <!-- 实验四：watch vs watchEffect -->
    <section class="exp">
      <h2>实验四 · watch vs watchEffect</h2>
      <p>
        <button type="button" @click="bumpProbe">probe +1</button>
        当前 probe = {{ probe }}
      </p>
      <ul>
        <li>watch 触发次数：{{ watchRuns }}</li>
        <li>watchEffect 运行次数：{{ effectRuns }}（读到的 probe = {{ effectProbe }}）</li>
      </ul>
      <p class="exp__note">
        watch 要写明监听谁，watchEffect 自动收集它读过的依赖——所以它每次都会跑。
      </p>
    </section>

    <!-- 手写 createReactive -->
    <section class="exp">
      <h2>手写 createReactive</h2>
      <p>
        <button type="button" @click="bumpManual">count +1 且 nested.level +1</button>
      </p>
      <p>count = {{ manual.count }} / nested.level = {{ manual.nested.level }}</p>
      <pre>{{ manualLog.join('\n') }}</pre>
      <p class="exp__note">
        这是 <code>src/reactive.ts</code> 里自己写的 Proxy + 依赖表，效果和 Vue 的一样。
      </p>
    </section>
  </main>
</template>
