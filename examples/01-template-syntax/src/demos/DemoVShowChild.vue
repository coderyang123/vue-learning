<!-- §1.10 ⑩ v-show 的子组件：用来观察节点始终留在 DOM 里 -->
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { logDemo } from '@/demos/demoLog';

const clicks = ref(0);

onMounted(() => {
  logDemo('子组件被创建（onMounted 触发）');
});

onUnmounted(() => {
  logDemo('子组件被销毁（onUnmounted 触发）');
});
</script>

<template>
  <div>
    <p>
      子组件内部计数：<strong>{{ clicks }}</strong>
    </p>
    <button type="button" @click="clicks += 1">点我 +1</button>
  </div>
</template>
