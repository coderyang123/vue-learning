<!-- §1.3 ③ 插值 {{ }}：表达式渲染成文本，HTML 会被自动转义 -->
<script setup lang="ts">
import { ref } from 'vue';

const title = ref('读 Vue 3 响应式源码');
const count = ref(0);

// 插值里可以放任意表达式：函数调用、三元、算术都可以
const add = (a: number, b: number): number => a + b;

// 插值永远只输出文本，HTML 会被转义
const html = '<b>我是数据里的 HTML 源码</b>';
</script>

<template>
  <div>
    <h3>表达式 → 文本</h3>
    <ul>
      <li>变量：{{ title }}</li>
      <li>方法调用：{{ add(2, 3) }}</li>
      <li>算术：{{ add(2, 3) * 2 }}</li>
      <li>三元：{{ title.length > 6 ? '长标题' : '短标题' }}</li>
    </ul>
    <p>
      <button type="button" @click="count += 1">count +1</button>
      当前 count：<strong>{{ count }}</strong>
    </p>

    <h3>插值会转义 HTML</h3>
    <p>数据里的内容：{{ html }}</p>
  </div>
</template>
