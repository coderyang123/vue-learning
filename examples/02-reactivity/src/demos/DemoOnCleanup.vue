<!-- §1.8 ⑧ onCleanup 副作用清理 -->
<script setup lang="ts">
import { computed, onWatcherCleanup, ref, watch } from 'vue';

const keywordA = ref('');
const keywordB = ref('');

const logA = ref<string[]>([]);
const logB = ref<string[]>([]);
const logLinesA = computed((): string[] => logA.value.slice().reverse());
const logLinesB = computed((): string[] => logB.value.slice().reverse());

// 写法一：watch 回调的第三个参数就是 onCleanup（类型是 OnCleanup）。
// 每次 watcher 重跑前，Vue 会先调用上一次注册的清理函数，再执行新的回调。
watch(keywordA, (newVal, oldVal, onCleanup): void => {
  logA.value.unshift(
    `[发出] 请求「${newVal}」已发出（关键词由「${oldVal}」改成「${newVal}」，800ms 后才返回）`,
  );
  const timer = setTimeout((): void => {
    logA.value.unshift(`[完成] 请求「${newVal}」返回了结果`);
  }, 800);
  // 清理函数闭包捕获的是「它自己那次请求」的关键字，所以这里用 newVal
  onCleanup((): void => {
    clearTimeout(timer);
    logA.value.unshift(`[取消] 请求「${newVal}」被取消（晚回来的旧结果直接丢掉）`);
  });
});

// 写法二（Vue 3.5 新增）：在回调里调用 onWatcherCleanup，效果和上面完全一样。
// 区别只是不用再从参数里接一个函数下来。
watch(keywordB, (newVal, oldVal): void => {
  logB.value.unshift(
    `[发出] 请求「${newVal}」已发出（关键词由「${oldVal}」改成「${newVal}」，800ms 后才返回）`,
  );
  const timer = setTimeout((): void => {
    logB.value.unshift(`[完成] 请求「${newVal}」返回了结果`);
  }, 800);
  onWatcherCleanup((): void => {
    clearTimeout(timer);
    logB.value.unshift(`[取消] 请求「${newVal}」被取消（晚回来的旧结果直接丢掉）`);
  });
});
</script>

<template>
  <div>
    <h3>副作用重跑前，先把上一次清理掉</h3>
    <p>搜索框每变一次就发一次请求，但只有最后一次的结果算数。</p>

    <div class="demo-cols">
      <div>
        <h3>写法一：回调第三个参数 onCleanup</h3>
        <p><input v-model="keywordA" placeholder="在这里输入关键字…" /></p>
        <pre>{{ logLinesA.join('\n') }}</pre>
      </div>

      <div>
        <h3>写法二：onWatcherCleanup（3.5 新增）</h3>
        <p><input v-model="keywordB" placeholder="在这里输入关键字…" /></p>
        <pre>{{ logLinesB.join('\n') }}</pre>
      </div>
    </div>

    <p>
      连续输入几个字：日志里「[发出]」和「[取消]」交替出现，只有最后一次请求会「[完成]」——
      旧请求要是晚回来，就会用旧结果覆盖新结果，这就是必须清理的原因。
    </p>
  </div>
</template>
