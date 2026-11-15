<!-- §1.11 ⑪ 动态 class：静态 class 与 :class 是合并关系 -->
<script setup lang="ts">
import { ref } from 'vue';

const isActive = ref(true);
const isWide = ref(true);

// 数组语法：多个类名用数组拼，条件不成立就给空串（等于没有这个类）
const boxClass = (): string[] => [
  'box',
  isWide.value ? 'box--wide' : '',
  isActive.value ? 'box--active' : '',
];
</script>

<template>
  <div>
    <p>
      <label><input v-model="isActive" type="checkbox" /> 激活态</label>
      <label><input v-model="isWide" type="checkbox" /> 加宽</label>
    </p>

    <h3>对象语法</h3>
    <p><span class="box" :class="{ 'box--active': isActive }">对象语法</span></p>
    <p>
      class 属性实际是：<code>{{ `box${isActive ? ' box--active' : ''}` }}</code>
    </p>

    <h3>数组语法</h3>
    <p><span class="box" :class="boxClass()">数组语法</span></p>
    <p>
      class 属性实际是：<code>{{ boxClass().filter(Boolean).join(' ') }}</code>
    </p>

    <h3>静态 + 动态合并</h3>
    <p><span class="box" :class="{ 'box--wide': isWide }">静态 class 是 box</span></p>

    <h3>条件类名</h3>
    <p>
      <span class="box" :class="isActive ? 'box--active' : 'box--muted'">
        {{ isActive ? 'box--active' : 'box--muted' }}
      </span>
    </p>
    <p>也可以用三元直接给类名；数组里的空字符串 <code>''</code> 会被忽略，等价于没有这个类。</p>
  </div>
</template>

<style scoped>
/* 这里必须有点样式，否则 class 的变化看不出来 */
.box {
  display: inline-block;
  padding: 4px 10px;
  border: 1px solid #d1d5db;
}

.box--wide {
  min-width: 120px;
  text-align: center;
}

.box--active {
  border-color: green;
  color: green;
  font-weight: bold;
}

.box--muted {
  color: gray;
}
</style>
