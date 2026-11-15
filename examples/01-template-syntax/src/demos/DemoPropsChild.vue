<!-- §1.12 ⑫ defineProps 的子组件：演示直接改 prop 会发生什么 -->
<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- 本示例故意演示「直接改 prop 会发生什么」 */
import { ref } from 'vue';
import type { Task } from '@/types';

const props = defineProps<{
  task: Task;
}>();

const result = ref('还没试过');

const tryReplaceProp = (): void => {
  // props 本身是只读的：直接替换会告警（控制台有 Vue warn），值也不会变
  // @ts-expect-error props 只读，这里故意写错演示运行时行为
  props.task = { id: props.task.id, title: '被替换了', done: true };
  result.value = `替换 props.task 之后，标题仍然是「${props.task.title}」`;
};

const tryMutateProp = (): void => {
  // 但 prop 传进来的是同一个对象引用：改它的属性会直接改到父组件的数据上
  props.task.title = `${props.task.title}（子组件偷偷改的）`;
  result.value = '改了 props.task.title，父组件那边的数据也跟着变了';
};
</script>

<template>
  <div>
    <p>
      子组件看到的标题：<strong>{{ props.task.title }}</strong>
    </p>
    <p>子组件看到的完成状态：{{ props.task.done ? '已完成' : '未完成' }}</p>
    <p>
      <button type="button" @click="tryReplaceProp">试试替换 props.task</button>
      <button type="button" @click="tryMutateProp">试试改 props.task.title</button>
    </p>
    <p>{{ result }}</p>
  </div>
</template>
