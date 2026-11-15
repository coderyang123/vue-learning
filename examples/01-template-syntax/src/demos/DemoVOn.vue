<!-- §1.5 ⑤ v-on / @：事件处理器的三种写法与五种修饰符 -->
<script setup lang="ts">
import { ref } from 'vue';

const log = ref<string[]>([]);
const outerClicks = ref(0);
const innerClicks = ref(0);
const onceClicks = ref(0);
const selfClicks = ref(0);
const draft = ref('');

const push = (message: string): void => {
  log.value = [`${new Date().toLocaleTimeString()}  ${message}`, ...log.value].slice(0, 20);
};

// 方法引用：@click="handleRef" → 实际调用 handleRef($event)，事件对象自动传入
const handleRef = (event: Event): void => {
  push(`@click="handleRef"          → 收到参数：${event.type}（事件对象自动传入）`);
};

// 括号写法：@click="handleCall()" → 实际调用 handleCall()，不会传事件对象
const handleCall = (): void => {
  push('@click="handleCall()"        → 没有参数（括号写法不传事件对象）');
};

// 显式传事件：@click="handleExplicit($event)"
const handleExplicit = (event: Event): void => {
  push(`@click="handleExplicit($event)" → 收到参数：${event.type}（显式传入）`);
};

// 事件对象里带着控件当前的值：$event.target.value 就是输入框里的字
const onInput = (event: Event): void => {
  draft.value = (event.target as HTMLInputElement).value;
};

const onSubmit = (): void => {
  push(`表单提交被 .prevent 拦住了，页面没有刷新（内容：${draft.value || '空'}）`);
};

const onOuterClick = (): void => {
  outerClicks.value += 1;
  push('外层 div 的点击处理器被触发');
};

const onInnerClick = (): void => {
  innerClicks.value += 1;
  push('内层按钮的点击处理器被触发（.stop 阻止了冒泡）');
};

const onOnceClick = (): void => {
  onceClicks.value += 1;
  push(`.once 生效：这是第 ${onceClicks.value} 次，也是最后一次`);
};

const onSelfClick = (): void => {
  selfClicks.value += 1;
  push('.self 生效：只有点到本元素自己才算');
};
</script>

<template>
  <div>
    <h2>处理器的三种写法</h2>
    <p>
      <button type="button" @click="handleRef">@click="handleRef"</button>
      <button type="button" @click="handleCall()">@click="handleCall()"</button>
      <button type="button" @click="handleExplicit($event)">@click="handleExplicit($event)"</button>
    </p>
    <pre>{{ log.length ? log.join('\n') : '（点上面的按钮，这里会记录每次调用）' }}</pre>

    <h2><code>.prevent</code></h2>
    <form @submit.prevent="onSubmit">
      <input placeholder="输入后按回车" @input="onInput" />
      <button type="submit">提交</button>
    </form>

    <h2><code>.stop</code></h2>
    <div @click="onOuterClick">
      【外层容器（被点 {{ outerClicks }} 次）】
      <button type="button" @click.stop="onInnerClick">
        【内层按钮（被点 {{ innerClicks }} 次）】
      </button>
    </div>

    <h2><code>.once</code></h2>
    <p>
      <button type="button" @click.once="onOnceClick">
        【只能点一次（已点 {{ onceClicks }} 次）】
      </button>
    </p>

    <h2><code>.self</code></h2>
    <div @click.self="onSelfClick">
      本区域（被点 {{ selfClicks }} 次）<span>【点我（我是子元素，不触发）】</span>
    </div>
  </div>
</template>
