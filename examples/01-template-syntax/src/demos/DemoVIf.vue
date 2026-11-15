<!-- §1.9 ⑨ v-if / v-else：条件为假时销毁 DOM，子组件状态一起归零 -->
<script setup lang="ts">
import { ref } from 'vue';
import DemoVIfChild from '@/demos/DemoVIfChild.vue';
import { clearDemoLog, demoLog } from '@/demos/demoLog';

const visible = ref(true);
const level = ref<'info' | 'warn' | 'error'>('info');

// 进入示例时清空日志（子组件的 onMounted 会紧接着往里写）
clearDemoLog();

const logText = (): string =>
  demoLog.entries.map((entry) => `${entry.time}  ${entry.message}`).join('\n');
</script>

<template>
  <div>
    <h3>开关</h3>
    <p>
      <button type="button" @click="visible = !visible">
        {{ visible ? '隐藏（销毁 DOM）' : '显示（重新创建）' }}
      </button>
    </p>
    <p>先在子组件里点几下 +1，再隐藏、显示，看看计数还在不在。</p>

    <DemoVIfChild v-if="visible" />
    <p v-else>v-if 为假 → 这里什么都没有，组件已被销毁</p>

    <h3><code>v-if</code> / <code>v-else-if</code> / <code>v-else</code></h3>
    <p>
      <button type="button" @click="level = 'info'">info</button>
      <button type="button" @click="level = 'warn'">warn</button>
      <button type="button" @click="level = 'error'">error</button>
    </p>
    <p v-if="level === 'info'">当前分支：info</p>
    <p v-else-if="level === 'warn'">当前分支：warn</p>
    <p v-else>当前分支：else（兜底分支）</p>

    <h3>挂载日志</h3>
    <pre>{{ logText() || '（还没有记录）' }}</pre>
  </div>
</template>
