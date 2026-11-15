<!-- §1.16 ⑯ props 绑定与事件监听：父 → 子 与 子 → 父，两条线怎么对上 -->
<script setup lang="ts">
import { ref } from 'vue';
import DemoPropsEventsChild from '@/demos/DemoPropsEventsChild.vue';
import type { Task } from '@/types';

const task = ref<Task>({ id: 1, title: '读 Vue 3 响应式源码', done: false });

// 父组件改了几次标题：让「父改 → 子跟着变」看得见
const renameCount = ref(0);

// 最后一次改动是谁发起的：这是区分两条线的关键
const changedBy = ref('（还没人改过）');

// 父 → 子：父组件自己改数据，子组件的 prop 跟着变
const renameByParent = (): void => {
  renameCount.value += 1;
  task.value.title = `读 Vue 3 响应式源码（父组件改了 ${renameCount.value} 次）`;
  changedBy.value = '父组件自己改的';
};

// 子 → 父：子组件 emit('toggle', id)，父组件收到后改数据
const onToggle = (id: number): void => {
  task.value.done = !task.value.done;
  changedBy.value = `子组件 emit 过来的（id = ${id}）`;
};
</script>

<template>
  <div>
    <p>
      父 → 子 用 <code>:task="task"</code>，子 → 父 用
      <code>@toggle="onToggle"</code>，两条线接在同一份数据上。
    </p>

    <h3>父组件这一侧</h3>
    <p>标题：{{ task.title }}</p>
    <p>状态：{{ task.done ? '已完成' : '未完成' }}</p>
    <p>
      最后一次改动来自：<strong>{{ changedBy }}</strong>
    </p>
    <p>
      <button type="button" @click="renameByParent">父组件改标题</button>
    </p>

    <h3>子组件那一侧</h3>
    <DemoPropsEventsChild :task="task" @toggle="onToggle" />
    <p>子组件的 prop 不会自己变——它变，是因为父组件改了那份数据。</p>
  </div>
</template>
