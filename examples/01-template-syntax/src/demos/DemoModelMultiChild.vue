<!-- §1.17 ⑰ v-model 的子组件（一个组件可以有多个 model） -->
<script setup lang="ts">
// 一个组件可以有多个 model：第一个参数就是 prop 名
const title = defineModel<string>('title', { required: true });
const count = defineModel<number>('count', { required: true });
</script>

<template>
  <div>
    <input v-model="title" placeholder="title" />
    <input v-model.number="count" type="number" placeholder="count" />
    <p>
      title：<code>{{ title || '（空）' }}</code> · count：<code>{{ count }}</code>
    </p>
  </div>
</template>
