<!-- §1.10 ⑩ v-show：只切 display，节点始终留在 DOM 里 -->
<script setup lang="ts">
import { ref } from 'vue';
import DemoVShowChild from '@/demos/DemoVShowChild.vue';
import { clearDemoLog, demoLog } from '@/demos/demoLog';

const visible = ref(true);

clearDemoLog();

const logText = (): string =>
  demoLog.entries.map((entry) => `${entry.time}  ${entry.message}`).join('\n');
</script>

<template>
  <div>
    <h3>开关</h3>
    <p>
      <button type="button" @click="visible = !visible">
        {{ visible ? '隐藏（display: none）' : '显示（display: block）' }}
      </button>
    </p>
    <p>先在子组件里点几下 +1，再隐藏、显示，计数不会归零。</p>

    <div v-show="visible">
      <DemoVShowChild />
    </div>

    <h3>挂载日志</h3>
    <pre>{{ logText() || '（还没有记录）' }}</pre>
  </div>
</template>
