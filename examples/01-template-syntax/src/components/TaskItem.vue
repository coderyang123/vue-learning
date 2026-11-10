<script setup lang="ts">
import type { Task } from '@/types';

const props = defineProps<{
  task: Task;
}>();

const emit = defineEmits<{
  toggle: [id: number];
  remove: [id: number];
}>();
</script>

<template>
  <li class="task" :class="{ 'task--done': props.task.done }">
    <!-- 动态 class：对象语法 -->
    <label class="task__main">
      <input type="checkbox" :checked="props.task.done" @change="emit('toggle', props.task.id)" />
      <span class="task__title">{{ props.task.title }}</span>
    </label>
    <button class="task__remove" type="button" @click="emit('remove', props.task.id)">删除</button>
  </li>
</template>
