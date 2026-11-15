<!-- §1.16 ⑯ props 绑定与事件监听：父 → 子 与 子 → 父，两条线怎么对上 -->
<script setup lang="ts">
import { ref } from 'vue';
import DemoPropsEventsChild from '@/demos/DemoPropsEventsChild.vue';
import type { Task } from '@/types';

const tasks = ref<Task[]>([
  { id: 1, title: '读 Vue 3 响应式源码', done: false },
  { id: 2, title: '手写一个最小 createReactive', done: false },
]);

// 子组件发来的事件落到这里，改数据的是父组件
const toggleTask = (id: number): void => {
  const task = tasks.value.find((item) => item.id === id);
  if (task) task.done = !task.done;
};

const removeTask = (id: number): void => {
  tasks.value = tasks.value.filter((item) => item.id !== id);
};
</script>

<template>
  <div>
    <h3>模板里那一行</h3>
    <pre>
&lt;TaskItem
  v-for="item in visibleTasks"
  :key="item.id"
  :task="item"
  @toggle="toggleTask"
  @remove="removeTask"
/&gt;</pre>

    <h3>跑起来</h3>
    <ul>
      <DemoPropsEventsChild
        v-for="item in tasks"
        :key="item.id"
        :task="item"
        @toggle="toggleTask"
        @remove="removeTask"
      />
    </ul>
    <p>父组件里还剩 {{ tasks.length }} 条任务。</p>
  </div>
</template>
