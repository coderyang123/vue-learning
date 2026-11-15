<!-- §1.16 ⑯ props 与事件的子组件：演示父 → 子、子 → 父两条线 -->
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

const lastEvent = ref('—');

const onToggle = (): void => {
  lastEvent.value = `emit('toggle', ${props.task.id})`;
  emit('toggle', props.task.id);
};

const onRemove = (): void => {
  lastEvent.value = `emit('remove', ${props.task.id})`;
  emit('remove', props.task.id);
};
</script>

<template>
  <li>
    {{ props.task.title }}（{{ props.task.done ? '已完成' : '未完成' }}）
    <button type="button" @click="onToggle">toggle</button>
    <button type="button" @click="onRemove">remove</button>
    <span
      >子组件最后一次发出：<code>{{ lastEvent }}</code></span
    >
  </li>
</template>
