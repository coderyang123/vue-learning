<!-- §1.4 ④ v-bind / :：属性绑定，:value 的单向性，:class / :style 的对象与数组语法 -->
<script setup lang="ts">
import { ref } from 'vue';

const isActive = ref(true);
const isDisabled = ref(false);
const color = ref('#42b883');
const fontSize = ref(16);
const title = ref('初稿标题');
</script>

<template>
  <div>
    <p>
      <label
        ><input :checked="isActive" type="checkbox" @click="isActive = !isActive" /> 激活态</label
      >
      <label
        ><input :checked="isDisabled" type="checkbox" @click="isDisabled = !isDisabled" />
        禁用按钮</label
      >
    </p>

    <h3><code>:value</code>：数据变，控件跟着变</h3>
    <p>
      <input :value="title" placeholder="在这里打字" />
      <button type="button" @click="title = '被数据改写的内容'">改数据</button>
    </p>
    <p>
      模型值：<code>{{ title }}</code>
    </p>

    <h3><code>:class</code> 对象语法</h3>
    <p><span :class="{ active: isActive }">对象语法</span></p>
    <p>
      实际 class：<code>{{ isActive ? 'active' : '' }}</code>
    </p>

    <h3><code>:class</code> 数组语法</h3>
    <p><span :class="['wide', isActive ? 'active' : '']">数组语法</span></p>
    <p>多个类名用数组拼，条件类用三元给空串（等价于没有这个类）。</p>

    <h3><code>:style</code> 对象语法</h3>
    <p><span :style="{ color: color, fontSize: fontSize + 'px' }">样式绑定</span></p>
    <p>
      <input
        :value="fontSize"
        type="range"
        min="12"
        max="28"
        @input="fontSize = Number(($event.target as HTMLInputElement).value)"
      />
      {{ fontSize }}px
    </p>

    <h3>属性绑定</h3>
    <p>
      <button type="button" :disabled="isDisabled" :title="isDisabled ? '被禁用' : '可以点'">
        被绑定的按钮
      </button>
      <a :href="isActive ? 'https://vuejs.org' : '#'" target="_blank" rel="noreferrer">
        {{ isActive ? 'Vue 官网' : '失效的链接' }}
      </a>
    </p>
  </div>
</template>

<style scoped>
/* 这里必须有点样式，否则 class 的变化看不出来 */
.active {
  color: green;
  font-weight: bold;
}

.wide {
  display: inline-block;
  min-width: 120px;
  text-align: center;
}
</style>
