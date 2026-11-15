<!-- §1.6 ⑥ watch 三个选项：immediate / deep / flush -->
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';

const count = ref(0);
const nested = reactive({ level: 0 });

// 所有 watcher 的回调都写进同一个日志数组，这样能直接看出触发顺序。
// log 里是「最新在最上面」，页面再倒过来显示，于是从上往下读到的就是实际发生的先后顺序。
const log = ref<string[]>([]);
const logLines = computed((): string[] => log.value.slice().reverse());

// ① 默认：不写选项就是最常见的用法——值变了才回调，回调在组件更新前（pre）批量执行
watch(count, (n, o): void => {
  log.value.unshift(`[默认] ${o} → ${n}`);
});

// ② immediate: true：创建时就先回调一次，所以页面刚打开就有「undefined → 0」
watch(
  count,
  (n, o): void => {
    log.value.unshift(`[immediate] ${o} → ${n}`);
  },
  { immediate: true },
);

// ③ deep: true：连嵌套对象的内部变化也一起监听（这里监听的是 reactive 对象）
watch(
  nested,
  (n): void => {
    log.value.unshift(`[deep] level=${n.level}`);
  },
  { deep: true },
);

// ④ flush: 'sync'：不等组件更新，改数据的同一时刻就同步回调
watch(
  count,
  (n, o): void => {
    log.value.unshift(`[sync] ${o} → ${n}`);
  },
  { flush: 'sync' },
);

const bump = (): void => {
  count.value += 1;
};

const bumpLevel = (): void => {
  nested.level += 1;
};
</script>

<template>
  <div>
    <h3>watch 的三个选项</h3>
    <p>count = {{ count }}，nested.level = {{ nested.level }}</p>
    <p>
      <button type="button" @click="bump">count + 1</button>
      <button type="button" @click="bumpLevel">嵌套 level + 1</button>
    </p>

    <h3>日志（从上到下 = 实际发生的先后顺序）</h3>
    <pre>{{ logLines.join('\n') }}</pre>

    <p>
      点一次「count + 1」：<code>[sync]</code> 一定排在 <code>[默认]</code> 上面——sync
      是同步回调，改完数据的当场就执行；默认的 pre 会攒到组件更新前再一起执行。
    </p>
    <p>点「嵌套 level + 1」只会多一条 <code>[deep]</code>；改 count 不会触发 deep。</p>
  </div>
</template>
