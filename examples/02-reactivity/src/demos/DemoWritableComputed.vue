<!-- §1.5 ⑤ 可写 computed（get / set） -->
<script setup lang="ts">
import { computed, ref } from 'vue';

const firstName = ref('三');
const lastName = ref('张');

// setter 被调用了几次
let setterRuns = 0;

// 读 = 拼名字，写 = 拆名字
const fullName = computed({
  get: (): string => `${firstName.value}${lastName.value}`,
  set: (value: string): void => {
    setterRuns += 1;
    firstName.value = value.slice(0, 1);
    lastName.value = value.slice(1);
  },
});
</script>

<template>
  <div>
    <h3>⑤ 可写 computed：读是拼名字，写是拆名字</h3>

    <p>
      <label>姓：<input v-model="firstName" /></label>
      <label>名：<input v-model="lastName" /></label>
    </p>
    <p>
      <label>全名：<input v-model="fullName" /></label>
    </p>

    <p>当前姓：{{ firstName }}</p>
    <p>当前名：{{ lastName }}</p>
    <p>当前全名：{{ fullName }}</p>
    <p>setter 被调用：{{ setterRuns }} 次</p>

    <p>
      改姓或改名字 → 全名自动跟着变（走的是 get）；直接改全名 → setter 被调用，
      姓和名被拆回去（走的是 set）。
    </p>
  </div>
</template>
