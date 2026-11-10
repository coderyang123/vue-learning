<script setup lang="ts">
import type { TaskFilter } from '@/types';

// defineModel：Vue 3.4+ 的编译宏。
// 没传第一个参数 → prop 名用默认的 modelValue，事件名是 update:modelValue；
// 变量名 filter 随便起，和 prop 名无关（父组件写 v-model="filter" 时，右边的
// filter 是父组件自己的变量名）。展开细节见 docs/01 的 1.17 ⑰。
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
