<!-- §1.17 ⑰ v-model 的子组件（defineModel 版） -->
<script setup lang="ts">
// defineModel 版：一行顶掉「声明 prop + 声明事件 + 维护双向 ref」
// 第一个参数是 prop 名 → 父组件写 v-model:title="xxx"
const title = defineModel<string>('title', { required: true });
</script>

<template>
  <div>
    <input v-model="title" placeholder="defineModel 版：直接 v-model" />
    <p>
      子组件读到的 prop：<code>{{ title || '（空）' }}</code>
    </p>
  </div>
</template>
