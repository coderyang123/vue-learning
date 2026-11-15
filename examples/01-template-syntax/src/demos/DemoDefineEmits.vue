<!-- §1.13 ⑬ defineEmits：子发父，事件名与参数靠名字对上 -->
<script setup lang="ts">
import { ref } from 'vue';
import DemoEmitsChild from '@/demos/DemoEmitsChild.vue';
import type { Task } from '@/types';

const tasks = ref<Task[]>([
  { id: 1, title: '读 Vue 3 响应式源码', done: false },
  { id: 2, title: '手写一个最小 createReactive', done: false },
]);

const log = ref<string[]>([]);

const push = (message: string): void => {
  log.value = [message, ...log.value].slice(0, 8);
};

const toggleTask = (id: number): void => {
  const task = tasks.value.find((item) => item.id === id);
  if (task) task.done = !task.done;
  push(
    `收到 toggle（id: ${id}，类型 ${typeof id}）→ 父组件把任务 ${id} 改成 ${task?.done ? '已完成' : '未完成'}`,
  );
};

const removeTask = (id: number): void => {
  tasks.value = tasks.value.filter((item) => item.id !== id);
  push(`收到 remove（id: ${id}）→ 父组件把这条任务删掉了`);
};
</script>

<template>
  <div>
    <h3>子组件</h3>
    <DemoEmitsChild
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @toggle="toggleTask"
      @remove="removeTask"
    />
    <p>父组件当前有 {{ tasks.length }} 条任务。</p>

    <h3>父组件收到的事件</h3>
    <pre>{{ log.length ? log.join('\n') : '（还没有事件，点上面的按钮试试）' }}</pre>
  </div>
</template>
