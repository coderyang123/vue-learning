<script setup lang="ts">
import type { TaskFilter } from '@/types';

// defineModel：Vue 3.4+ 的编译宏，等价于
// const modelValue = defineModel<TaskFilter>({ required: true })
const filter = defineModel<TaskFilter>({ required: true });

const options: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '未完成' },
  { value: 'done', label: '已完成' },
];
</script>

<template>
  <div class="filters">
    <!-- 筛选按钮组：当前选中项用 :class 高亮（v-show 的用法见第 01 章练习 1） -->
    <button
      v-for="option in options"
      :key="option.value"
      class="filters__item"
      :class="{ 'filters__item--active': filter === option.value }"
      type="button"
      @click="filter = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>
