<!-- §1.12 ⑫ defineProps：父传子，prop 名与父组件变量名的区别 -->
<script setup lang="ts">
import { ref } from 'vue';
import DemoPropsChild from '@/demos/DemoPropsChild.vue';
import type { Task } from '@/types';

// 父组件自己的变量，叫什么都可以
const selectedTask = ref<Task>({
  id: 1,
  title: '读 Vue 3 响应式源码',
  done: false,
});
</script>

<template>
  <div>
    <h3>父 → 子</h3>

    <!-- 父组件自己也渲染一遍这份数据：子组件改的就是这个对象 -->
    <p>
      父组件里的标题：<strong>{{ selectedTask.title }}</strong>
    </p>
    <p>父组件里的完成状态：{{ selectedTask.done ? '已完成' : '未完成' }}</p>

    <DemoPropsChild :task="selectedTask" />
    <p>
      <button
        type="button"
        @click="selectedTask = { ...selectedTask, title: '换一个标题（父组件改的）' }"
      >
        父组件换标题
      </button>
      <button type="button" @click="selectedTask.done = !selectedTask.done">
        父组件切换完成状态
      </button>
    </p>
  </div>
</template>
