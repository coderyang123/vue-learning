<!-- §1.13 ⑬ defineEmits 的子组件：演示子组件如何向父组件发事件 -->
<script setup lang="ts">
import { ref } from 'vue';
import type { Task } from '@/types';

const props = defineProps<{
  task: Task;
}>();

const emit = defineEmits<{
  toggle: [id: number];
  remove: [id: number];
}>();

const lastPayload = ref('还没收到过事件');

const onToggle = (): void => {
  lastPayload.value = `emit('toggle', ${props.task.id})`;
  emit('toggle', props.task.id);
};

const onRemove = (): void => {
  lastPayload.value = `emit('remove', ${props.task.id})`;
  emit('remove', props.task.id);
};
</script>

<template>
  <div>
    <p>
      任务标题：<strong>{{ props.task.title }}</strong>
    </p>
    <p>
      <button type="button" @click="onToggle">发出 toggle 事件</button>
      <button type="button" @click="onRemove">发出 remove 事件</button>
    </p>
    <p>
      最后一次发出：<code>{{ lastPayload }}</code>
    </p>
  </div>
</template>
