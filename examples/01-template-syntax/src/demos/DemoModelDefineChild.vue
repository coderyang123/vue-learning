<!-- §1.17 ⑰ v-model 的子组件（defineModel 版） -->
<script setup lang="ts">
// defineModel 版：一行顶掉「声明 prop + 声明事件 + 维护双向 ref」
// 第一个参数 'title' 是 prop 名 → 父组件写 v-model:title="xxx"
// 左边 titleModel 是本地变量名，和 prop 名无关，随手起
const titleModel = defineModel<string>('title', { required: true });
</script>

<template>
  <div>
    <input v-model="titleModel" placeholder="defineModel 版：直接 v-model" />
    <p>
      prop <code>title</code> 的值：<code>{{ titleModel || '（空）' }}</code>
    </p>
  </div>
</template>
