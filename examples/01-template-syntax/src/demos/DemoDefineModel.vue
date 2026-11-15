<!-- §1.17 ⑰ 组件 v-model 与 defineModel：手写版与 defineModel 版跑起来一模一样 -->
<script setup lang="ts">
import { ref } from 'vue';
import DemoModelDefineChild from '@/demos/DemoModelDefineChild.vue';
import DemoModelManualChild from '@/demos/DemoModelManualChild.vue';
import DemoModelMultiChild from '@/demos/DemoModelMultiChild.vue';

// 两个子组件绑的是同一个父组件变量
const pageTitle = ref('两个子组件共用的标题');

// 受控示例：父组件有权拒绝更新
const strictTitle = ref('受控的值');
const rejected = ref(0);

const onStrictTitle = (value: string): void => {
  if (value.trim() === '') {
    rejected.value += 1;
    return; // 拒绝更新 → 子组件的值保持不变
  }
  strictTitle.value = value;
};

// 多个 model
const multiTitle = ref('多 model 的标题');
const multiCount = ref(1);
</script>

<template>
  <div>
    <h3>手写版 vs defineModel 版</h3>
    <p>
      父组件变量 <code>pageTitle</code> 当前值：<strong>{{ pageTitle }}</strong>
    </p>
    <div class="demo-cols">
      <div>
        <p><strong>手写版</strong>（<code>defineProps</code> + <code>defineEmits</code>）：</p>
        <DemoModelManualChild v-model:title="pageTitle" />
      </div>
      <div>
        <p><strong>defineModel 版</strong>（<code>defineModel('title')</code>）：</p>
        <DemoModelDefineChild v-model:title="pageTitle" />
      </div>
    </div>

    <h3>受控组件：父组件可以拒绝更新</h3>
    <p>
      这里没用 <code>v-model</code>，而是手写
      <code>:title="strictTitle" @update:title="onStrictTitle"</code>：
    </p>
    <DemoModelDefineChild :title="strictTitle" @update:title="onStrictTitle" />
    <p>
      在输入框里<strong>把内容清空</strong>：子组件会 emit 一个空串，但父组件拒绝了它（已拒绝
      {{ rejected }} 次），所以 prop 没变 → 子组件里的值<strong>保持原样</strong>。
    </p>

    <h3>一个组件可以有多个 model</h3>
    <DemoModelMultiChild v-model:title="multiTitle" v-model:count="multiCount" />
    <p>
      父组件：<code>multiTitle = {{ multiTitle }}</code> ·
      <code>multiCount = {{ multiCount }}</code>
    </p>
  </div>
</template>
