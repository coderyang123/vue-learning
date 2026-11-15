<!-- §1.16 ⑯ props 与事件的子组件：只看 prop，要改数据一律 emit 给父组件 -->
<script setup lang="ts">
import type { Task } from '@/types';

const props = defineProps<{
  task: Task;
}>();

const emit = defineEmits<{
  toggle: [id: number];
}>();

const onToggle = (): void => {
  emit('toggle', props.task.id);
};
</script>

<template>
  <div>
    <p>标题：{{ props.task.title }}</p>
    <p>状态：{{ props.task.done ? '已完成' : '未完成' }}</p>
    <p>
      <button type="button" @click="onToggle">子组件 emit('toggle') 给父组件</button>
    </p>
  </div>
</template>
