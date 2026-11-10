<script setup lang="ts">
import { computed, ref } from 'vue';
import TaskFilterBar from '@/components/TaskFilterBar.vue';
import TaskItem from '@/components/TaskItem.vue';
import type { Task, TaskFilter } from '@/types';

const draft = ref('');
const filter = ref<TaskFilter>('all');
const tasks = ref<Task[]>([
  { id: 1, title: '读 Vue 3 响应式源码', done: true },
  { id: 2, title: '手写一个最小 createReactive', done: false },
  { id: 3, title: '给待办列表加筛选与统计', done: false },
]);

// 第 2 章会拆开讲 computed 的缓存机制，这里先让它跑起来
const visibleTasks = computed((): Task[] => {
  if (filter.value === 'active') return tasks.value.filter((task) => !task.done);
  if (filter.value === 'done') return tasks.value.filter((task) => task.done);
  return tasks.value;
});

const remaining = computed((): number => tasks.value.filter((task) => !task.done).length);

const addTask = (): void => {
  const title = draft.value.trim();
  if (!title) return;
  tasks.value.unshift({ id: Date.now(), title, done: false });
  draft.value = '';
};

const toggleTask = (id: number): void => {
  const task = tasks.value.find((item) => item.id === id);
  if (task) task.done = !task.done;
};

const removeTask = (id: number): void => {
  tasks.value = tasks.value.filter((item) => item.id !== id);
};
</script>

<template>
  <main class="board">
    <header class="board__header">
      <h1>待办清单</h1>
      <p class="board__subtitle">
        剩余 <strong>{{ remaining }}</strong> / {{ tasks.length }} 项未完成
      </p>
    </header>

    <!-- v-model 双向绑定 + 修饰符 .trim -->
    <form class="board__form" @submit.prevent="addTask">
      <input
        v-model="draft"
        class="board__input"
        type="text"
        placeholder="今天要做什么？回车添加"
        aria-label="新增任务"
      />
      <button class="board__submit" type="submit">添加</button>
    </form>

    <!-- 子组件：v-model 展开为 modelValue + @update:modelValue -->
    <TaskFilterBar v-model="filter" />

    <!-- v-if / v-else 渲染空状态 -->
    <ul v-if="visibleTasks.length" class="task-list">
      <!-- v-for + :key，key 用任务的稳定 id，而不是数组下标 -->
      <TaskItem
        v-for="task in visibleTasks"
        :key="task.id"
        :task="task"
        @toggle="toggleTask"
        @remove="removeTask"
      />
    </ul>
    <p v-else class="board__empty">这里空空如也，添加一条试试。</p>
  </main>
</template>
