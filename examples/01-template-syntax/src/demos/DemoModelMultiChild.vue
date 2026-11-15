<!-- §1.17 ⑰ v-model 的子组件（一个组件可以有多个 model） -->
<script setup lang="ts">
// 一个组件可以有多个 model：第一个参数就是 prop 名
// 左边 titleModel / countModel 是本地变量名，和 prop 名 title / count 无关
const titleModel = defineModel<string>('title', { required: true });
const countModel = defineModel<number>('count', { required: true });
</script>

<template>
  <div>
    <input v-model="titleModel" placeholder="title" />
    <input v-model.number="countModel" type="number" placeholder="count" />
    <p>
      prop title：<code>{{ titleModel || '（空）' }}</code> · prop count：<code>{{
        countModel
      }}</code>
    </p>
  </div>
</template>
