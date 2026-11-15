<!-- §1.9 ⑨ 调度机制与 nextTick -->
<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

const count = ref(0);

// 用 post 回调统计「界面实际更新了几次」：post 回调排在 DOM 更新之后才执行
const renderCount = ref(0);

// 模板 ref 用的是第 01 章的 ⑭ ref；3.5 的 useTemplateRef 见 §1.11 ⑪
const countText = ref<HTMLElement | null>(null);

const log = ref<string[]>([]);
const logLines = computed((): string[] => log.value.slice().reverse());

watch(
  count,
  (): void => {
    renderCount.value += 1;
  },
  { flush: 'post' },
);

const bumpThree = (): void => {
  // 同一轮里连改三次，Vue 会把它们合并成一次界面更新
  count.value += 1;
  count.value += 1;
  count.value += 1;

  // 同步阶段：DOM 还没更新，此刻读到的仍然是旧值
  log.value.unshift(`[同步] 连续改了 3 次，此时 DOM 里还是 ${countText.value?.textContent ?? ''}`);

  // nextTick 的回调排在 DOM 更新之后，这时才读得到新值
  nextTick((): void => {
    log.value.unshift(`[nextTick] DOM 已经变成 ${countText.value?.textContent ?? ''}`);
  });
};
</script>

<template>
  <div>
    <h3>同一轮里改多次，界面只更新一次</h3>
    <p>
      界面上的数字：<span ref="countText">{{ count }}</span>
    </p>
    <p>count 变化引起的界面更新次数：{{ renderCount }}（点一次「连续 +3」应该只 +1）</p>
    <p>
      <button type="button" @click="bumpThree">连续 +3</button>
    </p>

    <h3>日志（从上到下 = 实际发生的先后顺序）</h3>
    <pre>{{ logLines.join('\n') }}</pre>

    <p>同步读到的是旧值（DOM 还没更新），nextTick 的回调排在 DOM 更新之后，所以才能拿到新值。</p>
  </div>
</template>
