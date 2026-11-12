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

// ⑮ 计数器用普通变量而不是 ref：在 computed 里写 ref 会自触发递归，报 Maximum recursive updates exceeded
let computedRuns = 0;
let methodRuns = 0;

// ⑮ 无关状态：只用来制造一次重渲染，不影响任何派生数据
const renderTick = ref(0);

// ⑮ 写法一：computed —— 依赖不变就返回缓存，不重复计算
const remaining = computed((): number => {
  computedRuns++;
  return tasks.value.filter((task) => !task.done).length;
});

// ⑮ 写法二：普通函数 —— 每次被调用都重新算一遍
const remainingByMethod = (): number => {
  methodRuns++;
  return tasks.value.filter((task) => !task.done).length;
};

// ⑮ 触发一次与派生数据无关的重渲染，用来观察两个计数器
const triggerRerender = (): void => {
  renderTick.value++;
};

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

    <!-- ⑮ 对照实验：computed vs 普通函数 -->
    <section class="compare">
      <table class="compare__table">
        <thead>
          <tr>
            <th>写法</th>
            <th>结果</th>
            <th>实算次数</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>computed</td>
            <td>{{ remaining }}</td>
            <td>{{ computedRuns }} 次</td>
          </tr>
          <tr>
            <td>普通函数</td>
            <td>{{ remainingByMethod() }}</td>
            <td>{{ methodRuns }} 次</td>
          </tr>
        </tbody>
      </table>
      <p class="compare__row">
        已触发重渲染 {{ renderTick }} 次
        <button class="compare__btn" type="button" @click="triggerRerender">触发一次重渲染</button>
      </p>
      <p class="compare__hint">结果一样，差别只在「算几次」，不在「会不会更新」。</p>
    </section>

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
