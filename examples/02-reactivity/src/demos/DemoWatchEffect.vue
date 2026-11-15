<!-- §1.7 ⑦ watchEffect 与自动依赖收集 -->
<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';

const count = ref(0);
const extra = ref(0);
const useExtra = ref(false);

// 共享日志：watchEffect 和 watch 的回调都写进来，好让两种写法并排比较
const log = ref<string[]>([]);
const logLines = computed((): string[] => log.value.slice().reverse());

// watchEffect：不用写明监听谁，函数里读了哪些响应式数据，就自动监听哪些。
// 它第一次会立即执行一次；useExtra 为 false 时根本不会读 extra.value，
// 所以 extra 暂时还不是它的依赖。
watchEffect((): void => {
  log.value.unshift(
    `[watchEffect] count=${count.value}${useExtra.value ? ` extra=${extra.value}` : ''}`,
  );
});

// watch：必须写明监听谁，写了谁就只监听谁，extra 怎么变都不关它的事
watch(count, (n): void => {
  log.value.unshift(`[watch] count=${n}`);
});

const bumpCount = (): void => {
  count.value += 1;
};

const bumpExtra = (): void => {
  extra.value += 1;
};

const toggleExtra = (): void => {
  useExtra.value = !useExtra.value;
};
</script>

<template>
  <div>
    <h3>watchEffect 自动收集依赖，watch 要写明监听谁</h3>
    <p>count = {{ count }}，extra = {{ extra }}，useExtra = {{ useExtra }}</p>
    <p>
      <button type="button" @click="bumpCount">count + 1</button>
      <button type="button" @click="bumpExtra">extra + 1</button>
      <button type="button" @click="toggleExtra">
        {{ useExtra ? '关闭' : '打开' }} extra 依赖
      </button>
    </p>

    <h3>日志（从上到下 = 实际发生的先后顺序）</h3>
    <pre>{{ logLines.join('\n') }}</pre>

    <p>
      watchEffect 的日志行里，只有在「打开 extra 依赖」之后才会带 <code>extra=</code>；而 watch
      的日志行永远只有 count。
    </p>
    <p>
      打开依赖的那一刻 watchEffect 会重跑一次，从此 extra 也算它的依赖；再点「extra +
      1」，watchEffect 就会跟着触发。关掉依赖后它不再读 extra，extra 也就重新变成「无关数据」。
    </p>
  </div>
</template>
