<!-- §1.10 ⑩ shallowRef / shallowReactive / markRaw -->
<script setup lang="ts">
import { markRaw, reactive, ref, shallowReactive, shallowRef } from 'vue';

// ① 深 ref：ref() 会把里面的对象转成响应式代理，所以改内部也能触发更新
const deep = ref({ count: 0 });

// ② 浅 ref：shallowRef() 只跟踪 .value 本身，里面的对象还是普通对象
const shallow = shallowRef({ count: 0 });

// ③ 浅层响应式对象：顶层属性照旧是响应式的，差别在于嵌套的对象不会被转成代理
const shallowState = shallowReactive({ count: 0, nested: { hits: 0 } });

// ④ markRaw：被标记过的对象放进 reactive 里也不会被代理
const raw = markRaw({ hits: 0 });
const box = reactive({ raw });

// 只是个计数器：用来强制触发一次重渲染，好看清「界面没变」的数据其实已经变了
const tick = ref(0);

const forceRerender = (): void => {
  tick.value += 1;
};

const deepInner = (): void => {
  deep.value.count += 1;
};

const deepReplace = (): void => {
  // 换一个新的对象进去：引用变了，界面就会更新
  deep.value = { count: deep.value.count + 1 };
};

const shallowInner = (): void => {
  shallow.value.count += 1;
};

const shallowReplace = (): void => {
  // 浅 ref 只有换了引用才会更新，所以这里换一个新对象
  shallow.value = { count: shallow.value.count + 1 };
};

const shallowTop = (): void => {
  // 顶层属性照旧是响应式的，改了就会更新
  shallowState.count += 1;
};

const shallowNested = (): void => {
  shallowState.nested.hits += 1;
};

const bumpRaw = (): void => {
  box.raw.hits += 1;
};
</script>

<template>
  <div>
    <h3>deep / shallow 的差别：跟踪到哪一层</h3>

    <div class="demo-cols">
      <div>
        <h3>① ref()：深响应式</h3>
        <p>deep.count = {{ deep.count }}</p>
        <p><button type="button" @click="deepInner">改内部：deep.value.count +1</button></p>
        <p>
          <button type="button" @click="deepReplace">整个换掉：deep.value = 新对象</button>
        </p>
        <p>改内部会更新，整个换掉也会更新。</p>
      </div>

      <div>
        <h3>② shallowRef()：浅 ref</h3>
        <p>shallow.count = {{ shallow.count }}</p>
        <p><button type="button" @click="shallowInner">改内部：shallow.value.count +1</button></p>
        <p>
          <button type="button" @click="shallowReplace">整个换掉：shallow.value = 新对象</button>
        </p>
        <p>只有整个换掉（换引用）才更新；改内部不会更新。</p>
      </div>

      <div>
        <h3>③ shallowReactive()</h3>
        <p>shallowState.count = {{ shallowState.count }}</p>
        <p>shallowState.nested.hits = {{ shallowState.nested.hits }}</p>
        <p><button type="button" @click="shallowTop">改顶层：shallowState.count +1</button></p>
        <p>
          <button type="button" @click="shallowNested">改嵌套：shallowState.nested.hits +1</button>
        </p>
        <p>顶层属性照旧会更新；嵌套对象不会被代理，所以改它不会更新。</p>
      </div>
    </div>

    <h3>④ markRaw：放进 reactive 里也不会被代理</h3>
    <p>box.raw.hits = {{ box.raw.hits }}</p>
    <p><button type="button" @click="bumpRaw">改 box.raw.hits +1</button></p>
    <p>
      <button type="button" @click="forceRerender">强制重渲染（tick = {{ tick }}）</button>
    </p>
    <p>
      改完之后界面上的数字纹丝不动：值确实变了，但 Vue
      没收到通知。点「强制重渲染」，数字才跳到新值—— 这就是 markRaw
      的代价：省掉代理，代价是手动通知。
    </p>
  </div>
</template>
