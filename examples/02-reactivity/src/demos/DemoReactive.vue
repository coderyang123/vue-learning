<!-- §1.2 ② reactive 与 Proxy -->
<script setup lang="ts">
import { reactive, ref } from 'vue';

// reactive 的返回类型：Proxy 会拦截任意层级的读写
interface CounterState {
  count: number;
  profile: {
    name: string;
  };
  // 新增的字段在 TS 里要先声明；运行时是 Proxy 拦截了「原来没有这个 key」的写入
  extra?: string;
}

let state = reactive<CounterState>({
  count: 0,
  profile: { name: '三' },
});

// reactive 的返回值是代理，整体替换等于把这个代理丢掉
// 用 ref 存这句提示：普通变量改了不会触发重渲染，提示就看不见了
const replaceNote = ref('');

// 一级属性：走 Proxy 的 set 拦截
const bumpCount = (): void => {
  state.count += 1;
};

// 二级属性：Proxy 是递归的，深层对象也会被包一层代理
const rename = (): void => {
  state.profile.name = '张';
};

// 新增属性：set 拦截了「原来不存在的 key」
const addExtra = (): void => {
  state.extra = '新加的字段';
};

// 整体替换：换成普通对象，从这一刻起界面就再也不更新了
const replaceWhole = (): void => {
  state = { count: 0, profile: { name: '李' } };
  replaceNote.value = '已经换成普通对象了——再点上面的按钮，界面不动了';
};

// 换回响应式对象
const restoreReactive = (): void => {
  state = reactive<CounterState>({ count: 0, profile: { name: '三' } });
  replaceNote.value = '';
};
</script>

<template>
  <div>
    <h3>② reactive：拿到的是 Proxy</h3>

    <p>
      <button type="button" @click="bumpCount">改一级属性 state.count</button>
    </p>
    <p>state.count = {{ state.count }}</p>

    <p>
      <button type="button" @click="rename">改二级属性 state.profile.name</button>
    </p>
    <p>state.profile.name = {{ state.profile.name }}</p>

    <p>
      <button type="button" @click="addExtra">新增属性 state.extra</button>
    </p>
    <p>state.extra = {{ state.extra ?? '(还没有这个属性)' }}</p>

    <h3>reactive 的返回值不能整个替换</h3>
    <p>
      <button type="button" @click="replaceWhole">整体替换 state = { ... }</button>
      <button type="button" @click="restoreReactive">换回响应式对象</button>
    </p>
    <p>{{ replaceNote }}</p>
    <p>
      reactive 给的是「代理」，整体替换等于把这个代理丢掉：换成普通对象后界面就不会再更新，
      要改就改里面的属性，或者整体换的时候用 ref。
    </p>
  </div>
</template>
