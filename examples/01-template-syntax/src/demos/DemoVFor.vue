<!-- §1.7 ⑦ v-for：遍历数组与对象，以及 v-if 与 v-for 的坑 -->
<script setup lang="ts">
import { ref } from 'vue';

interface Task {
  id: number;
  title: string;
}

const tasks = ref<Task[]>([
  { id: 1, title: '读 Vue 3 响应式源码' },
  { id: 2, title: '手写一个最小 createReactive' },
  { id: 3, title: '给待办列表加筛选与统计' },
]);

const scoreboard = ref<Record<string, number>>({
  carl: 92,
  max: 78,
  john: 85,
});

// 过滤后的列表：先算出数据，再用 v-for 渲染
// 这里用普通函数就够了；想缓存结果的 computed 写法见 ⑮（§1.15）
const keyword = ref('源');
const matched = (): Task[] => tasks.value.filter((task) => task.title.includes(keyword.value));
</script>

<template>
  <div>
    <h3>遍历数组</h3>
    <ul>
      <li v-for="task in tasks" :key="task.id">{{ task.title }}</li>
    </ul>

    <h3>带下标</h3>
    <ul>
      <li v-for="(task, index) in tasks" :key="task.id">{{ index }} → {{ task.title }}</li>
    </ul>

    <h3>遍历对象</h3>
    <ul>
      <li v-for="(score, name) in scoreboard" :key="name">{{ name }}：{{ score }} 分</li>
    </ul>

    <h3>别把 v-if 和 v-for 写在同一个元素上</h3>
    <p><input v-model="keyword" placeholder="按关键字过滤标题" /></p>
    <div class="demo-cols">
      <div>
        <p><strong>推荐</strong>：先过滤出要渲染的数据，再 v-for。</p>
        <ul>
          <li v-for="task in matched()" :key="task.id">{{ task.title }}</li>
        </ul>
      </div>
      <div>
        <p><strong>别写</strong>：v-if 和 v-for 同元素。</p>
        <ul>
          <!-- eslint-disable vue/no-use-v-if-with-v-for -->
          <li v-for="task in tasks" v-if="keyword" :key="task.id">{{ task.title }}</li>
          <!-- eslint-enable vue/no-use-v-if-with-v-for -->
        </ul>
        <p>
          关键字填的是「源」，右边却把三条<strong>全画出来了</strong>——这个
          <code>v-if</code> 只判断了「关键字非空」，压根没作用到每一项上。
        </p>
      </div>
    </div>
  </div>
</template>
