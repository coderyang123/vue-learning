<!-- §1.6 ⑥ v-model：原生控件的双向绑定，以及它展开后的样子 -->
<script setup lang="ts">
import { ref } from 'vue';

const nickname = ref('');
const agreed = ref(false);
const level = ref('normal');
const city = ref('bj');
const tags = ref<string[]>([]);
const price = ref('');
const lazyText = ref('');
const trimmed = ref('');
</script>

<template>
  <div>
    <h3>文本框 → string</h3>
    <p>
      <input v-model="nickname" placeholder="输入昵称" />
      模型值：<code>{{ JSON.stringify(nickname) }}</code>
    </p>

    <h3>复选框 → boolean</h3>
    <p>
      <label><input v-model="agreed" type="checkbox" /> 同意条款</label>
      模型值：<code>{{ agreed }}</code>
    </p>

    <h3>单选按钮 → 选中项的 value</h3>
    <p>
      <label><input v-model="level" type="radio" value="easy" /> 简单</label>
      <label><input v-model="level" type="radio" value="normal" /> 普通</label>
      模型值：<code>{{ JSON.stringify(level) }}</code>
    </p>

    <h3>下拉框 → 选中项的 value</h3>
    <p>
      <select v-model="city">
        <option value="bj">北京</option>
        <option value="sh">上海</option>
      </select>
      模型值：<code>{{ JSON.stringify(city) }}</code>
    </p>

    <h3>多选复选框 → 数组</h3>
    <p>
      <label><input v-model="tags" type="checkbox" value="vue" /> Vue</label>
      <label><input v-model="tags" type="checkbox" value="ts" /> TypeScript</label>
      模型值：<code>{{ JSON.stringify(tags) }}</code>
    </p>

    <h3>三个修饰符</h3>
    <p>
      <code>.number</code>：<input v-model.number="price" /> 模型值：<code>{{
        JSON.stringify(price)
      }}</code>
    </p>
    <p>
      <code>.lazy</code>：<input v-model.lazy="lazyText" placeholder="失焦才同步" />
      模型值：<code>{{ JSON.stringify(lazyText) }}</code>
    </p>
    <p>
      <code>.trim</code>：<input v-model.trim="trimmed" placeholder="首尾空格会被去掉" />
      模型值：<code>{{ JSON.stringify(trimmed) }}</code>
    </p>

    <h3>v-model 到底等于什么</h3>
    <p>用 <code>v-model</code>：<input v-model="nickname" placeholder="在这里打字" /></p>
    <p>
      用 <code>:value</code> + <code>@input</code> 手写等价物：<input
        :value="nickname"
        placeholder="在这里打字"
        @input="nickname = ($event.target as HTMLInputElement).value"
      />
    </p>
    <p>两个输入框绑定的是同一个 <code>nickname</code>：在任意一个里打字，另一个立刻同步。</p>
  </div>
</template>
