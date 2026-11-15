<!-- §1.3 ③ toRef / toRefs / toRaw / unref -->
<script setup lang="ts">
import { reactive, toRaw, toRef, toRefs, unref } from 'vue';

// 面板 1：解构 —— 响应性丢了
const source = reactive({ count: 0 });
// 解构出来的是「当时的数字」，source 之后怎么改，它都不会变
const { count } = source;

// 面板 2：toRefs —— 响应性还在
// 原始对象先留着：toRaw 拿回的就是它
const rawState = { count: 0 };
const state = reactive(rawState);
const { count: countRef } = toRefs(state);

// 面板 3：toRef —— 单个属性也能变成 ref
const single = reactive({ count: 0 });
const singleCountRef = toRef(single, 'count');

// 一个按钮同时改三个数据源，方便横向对比
const bumpAll = (): void => {
  source.count += 1;
  state.count += 1;
  single.count += 1;
};

// unref：ref → 原值；不是 ref 的值 → 原样返回
const unrefFromRef = (): number => unref(countRef);
const unrefFromPlain = (): number => unref(42);

// toRaw：拿回最初的原始对象（不是代理）
// 所以 toRaw(state) === state 是 false —— 原始对象和代理不是同一个东西
const rawEqualsProxy = (): boolean => toRaw(state) === state;
// 但它和最初那个原始对象是同一个
const rawIsOriginal = (): boolean => toRaw(state) === rawState;
</script>

<template>
  <div>
    <h3>③ 解构会丢响应性，toRef / toRefs 能接住</h3>
    <p>
      <button type="button" @click="bumpAll">三个数据源的 count 一起 +1</button>
    </p>

    <div class="demo-cols">
      <div>
        <h3>解构（丢响应性）</h3>
        <p>源对象 source.count：{{ source.count }}</p>
        <p>解构出来的 count：{{ count }}</p>
        <p>源对象都变成 {{ source.count }} 了，解构出来的 count 还停在 0 —— 它只是一次性的快照。</p>
      </div>

      <div>
        <h3>toRefs（跟得上）</h3>
        <p>源对象 state.count：{{ state.count }}</p>
        <p>toRefs 出来的 countRef：{{ countRef }}</p>
        <p>toRefs 把每个属性都变成 ref，读它还是读同一个属性，源对象一变它就变。</p>
      </div>

      <div>
        <h3>toRef（跟得上）</h3>
        <p>源对象 single.count：{{ single.count }}</p>
        <p>toRef 出来的 singleCountRef：{{ singleCountRef }}</p>
        <p>只需要一个属性时用 toRef，写法是 toRef(对象, '属性名')。</p>
      </div>
    </div>

    <h3>unref：ref 和普通值都能用</h3>
    <p>unref(countRef) = {{ unrefFromRef() }}</p>
    <p>unref(42) = {{ unrefFromPlain() }}</p>

    <h3>toRaw：拿回原始对象</h3>
    <p>toRaw(state) === state → {{ rawEqualsProxy() }}（false 才对：state 是它的代理）</p>
    <p>toRaw(state) === 原始对象 → {{ rawIsOriginal() }}（true：拿到的就是最初那个普通对象）</p>
  </div>
</template>
