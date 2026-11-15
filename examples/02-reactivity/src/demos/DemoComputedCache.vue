<!-- §1.4 ④ computed 惰性求值与缓存 -->
<script setup lang="ts">
import { computed, ref } from 'vue';

const count = ref(0);
// 无关状态：只用来制造一次重渲染，不影响 computed 的依赖
const unrelated = ref(0);

// getter 真的被执行的次数：普通变量就够了，它不需要是响应式的
let getterRuns = 0;
// 惰性那个 computed 的执行次数
let lazyRuns = 0;
// 模板要显示 lazy 的执行次数，普通变量的变化不会触发渲染，用一个 ref 把它显示出来
const lazyRunsShown = ref(0);
// 手动读 lazy 之后拿到的值
const lastLazy = ref(0);

const doubled = computed((): number => {
  getterRuns += 1;
  return count.value * 2;
});

// 这个 computed 没出现在模板里：没人读它，它就不算
const lazy = computed((): number => {
  lazyRuns += 1;
  return count.value * 10;
});

// 依赖变了 → 缓存失效，getter 重算
const bumpCount = (): void => {
  count.value += 1;
};

// 依赖没变 → 界面重渲染，但 getter 不再执行（缓存生效）
const bumpUnrelated = (): void => {
  unrelated.value += 1;
};

// 只有点这个按钮才会去读 lazy，这时它才计算
const readLazy = (): void => {
  lastLazy.value = lazy.value;
  lazyRunsShown.value = lazyRuns;
};
</script>

<template>
  <div>
    <h3>④ computed：缓存 + 惰性</h3>

    <!-- doubled 要写在 getterRuns 前面：getter 是被读的那一刻才执行的，顺序会影响显示的次数 -->
    <p>doubled 的值：{{ doubled }}</p>
    <p>getter 已执行：{{ getterRuns }} 次</p>
    <p>无关状态 unrelated：{{ unrelated }}</p>

    <p>
      <button type="button" @click="bumpCount">count +1（依赖变了，getter 重算）</button>
      <button type="button" @click="bumpUnrelated">
        改无关状态 unrelated（只重渲染，getter 不重算）
      </button>
    </p>

    <h3>没人读它，就不算</h3>
    <p>lazy 的值：{{ lastLazy }}</p>
    <p>lazy 的 getter 已执行：{{ lazyRunsShown }} 次</p>
    <p>
      <button type="button" @click="readLazy">手动读一次 lazy</button>
    </p>
    <p>lazy 没有出现在模板里，所以点按钮之前它的 getter 一次都没跑过。</p>
  </div>
</template>
