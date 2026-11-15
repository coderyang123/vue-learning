<!-- §1.14 ⑭ ref：模板自动解包，脚本里要写 .value -->
<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

// 普通对象里塞 ref：模板里不会自动解包
const plain = { count: ref(0) };

// 数组里的 ref 同样不会自动解包
const list = ref([ref(1), ref(2)]);

const scriptValue = (): string => `脚本里要写 count.value → ${count.value}`;

const bump = (): void => {
  count.value += 1;
  plain.count.value += 1;
};
</script>

<template>
  <div>
    <h3>同一个 ref，两种写法</h3>
    <p>模板里：{{ count }}</p>
    <p>脚本里：{{ scriptValue() }}</p>
    <p><button type="button" @click="bump">count +1（两个都加）</button></p>

    <div class="demo-cols">
      <div>
        <h3>普通对象里的 ref</h3>
        <p>
          模板里 <code>{{ plain.count }}</code> →
        </p>
        <p>
          <strong>{{ plain.count }}</strong>
        </p>
        <p>
          渲染出来是 ref 对象，不是数字。想取值得写
          <code>{{ plain.count.value }}</code> → {{ plain.count.value }}
        </p>
      </div>

      <div>
        <h3>数组里的 ref</h3>
        <p>
          模板里 <code>{{ list[0] }}</code> →
        </p>
        <p>
          <strong>{{ list[0] }}</strong>
        </p>
        <p>数组不会解包，<code>list[0].value</code> → {{ list[0].value }}</p>
      </div>
    </div>
  </div>
</template>
