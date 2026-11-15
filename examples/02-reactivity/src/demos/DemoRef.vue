<!-- §1.1 ① ref 与模板自动解包：模板里写 count，脚本里写 count.value -->
<script setup lang="ts">
import { ref } from 'vue';

// ref 装基本类型：模板里自动解包，脚本里必须写 .value
const count = ref(0);

// ref 装对象：模板里同样自动解包，深层属性也是响应式的
const state = ref({ label: '嵌套对象' });

// 脚本里读值要写 .value
const readCount = (): number => count.value;
const readLabel = (): string => state.value.label;

// 反面例子：模板里写 count.value 会被编译成 count.value.value，
// 也就是在「已经是数字的 count」上再取一次 .value，结果是 undefined
const readCountTwice = (): number | undefined =>
  (count.value as unknown as { value?: number }).value;

const bump = (): void => {
  count.value += 1;
};

const rename = (): void => {
  state.value.label = '改过的 label';
};
</script>

<template>
  <div>
    <h3>模板里写 count，脚本里写 count.value</h3>
    <p>模板里看到：{{ count }}</p>
    <p>脚本里读到：{{ readCount() }}</p>
    <p>模板里硬写 count.value：{{ readCountTwice() ?? '(空)' }}</p>
    <p>
      <button type="button" @click="bump">count +1</button>
    </p>
    <p>
      模板里的 count 已经是数字了，再取一次 .value 就是 undefined —— 所以模板里永远不写 .value。
    </p>

    <h3>对象型 ref 也是自动解包</h3>
    <p>模板里看到：{{ state.label }}</p>
    <p>脚本里读到：{{ readLabel() }}</p>
    <p>
      <button type="button" @click="rename">改 state.label</button>
    </p>
    <p>
      改的是 state.value.label（深层属性），界面照样跟着变 —— 说明 ref 里的深层属性也是响应式的。
    </p>
  </div>
</template>
