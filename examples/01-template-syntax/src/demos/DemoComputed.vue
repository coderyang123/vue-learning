<!-- §1.15 ⑮ computed：computed 与普通函数的差别在「算几次」 -->
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Task } from '@/types';

const tasks = ref<Task[]>([
  { id: 1, title: '读 Vue 3 响应式源码', done: true },
  { id: 2, title: '手写一个最小 createReactive', done: false },
  { id: 3, title: '给待办列表加筛选与统计', done: false },
]);

// ⑮ 计数器用普通变量而不是 ref：在 computed 的 getter 里写 ref 会自触发递归，报 Maximum recursive updates exceeded
let computedRuns = 0;
let methodRuns = 0;

// 无关状态：只用来制造一次重渲染，不影响任何派生数据
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

const triggerRerender = (): void => {
  renderTick.value += 1;
};

// 勾选一条：派生值真的变了
const toggleTask = (id: number): void => {
  const task = tasks.value.find((item) => item.id === id);
  if (task) task.done = !task.done;
};

// 可写 computed：读是拼名字，写是拆名字
const firstName = ref('三');
const lastName = ref('张');
const fullName = computed({
  get: (): string => `${firstName.value}${lastName.value}`,
  set: (value: string): void => {
    firstName.value = value.slice(0, 1);
    lastName.value = value.slice(1);
  },
});
</script>

<template>
  <div>
    <h3>computed vs 普通函数</h3>
    <table>
      <thead>
        <tr>
          <th>写法</th>
          <th>结果</th>
          <th>实算次数</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>computed</code></td>
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
    <p>
      <button type="button" @click="triggerRerender">触发一次重渲染</button>
      <button type="button" @click="toggleTask(2)">勾选/取消第 2 条</button>
      已触发重渲染 {{ renderTick }} 次
    </p>

    <h3>可写 computed（get / set）</h3>
    <p>
      <input v-model="firstName" placeholder="姓" />
      <input v-model="lastName" placeholder="名" />
    </p>
    <p>
      <input v-model="fullName" placeholder="直接改全名试试" />
      读它 = {{ fullName }}
    </p>
    <p>改「姓 / 名」→ 全名跟着变；直接改全名 → setter 被调用，自动拆回姓和名。</p>

    <h3>漏写括号的后果</h3>
    <p>
      正确写法：<code>&#123;&#123; remainingByMethod() &#125;&#125;</code> →
      结果和上面表格里的一（数字）
    </p>
    <p>漏掉括号：<code>&#123;&#123; remainingByMethod &#125;&#125;</code> →</p>
    <pre>{{ remainingByMethod }}</pre>
  </div>
</template>
