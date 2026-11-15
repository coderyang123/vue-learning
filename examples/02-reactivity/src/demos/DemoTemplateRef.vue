<!-- §1.11 ⑪ useTemplateRef -->
<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';

const text = ref('');

// 这里故意不用 v-model，改用 :value + @input（第 01 章的 ④ ⑤）：
// v-model 在组件重渲染时会把 DOM 的值改回 text，
// 那样「用 JS 直接改 DOM 的值」的结果就被冲掉了，对比不出来。
const onInput = (event: Event): void => {
  text.value = (event.target as HTMLInputElement).value;
};

// useTemplateRef('keyword') 用字符串 key 和模板里的 ref="keyword" 对应，
// 返回的是只读的 shallowRef（Readonly<ShallowRef<T | null>>）
const inputRef = useTemplateRef<HTMLInputElement>('keyword');

const log = ref<string[]>([]);
const logLines = computed((): string[] => log.value.slice().reverse());

const focusInput = (): void => {
  inputRef.value?.focus();
};

const readValue = (): void => {
  log.value.unshift(`[读取] 输入框里是「${inputRef.value?.value ?? ''}」`);
};

const readCursor = (): void => {
  log.value.unshift(`[光标] 光标停在第 ${inputRef.value?.selectionStart ?? -1} 个字符`);
};

// 直接用 JS 改 DOM 的值：组件里的 text 不会跟着变
const tick = ref(0);

const patchDomValue = (): void => {
  if (!inputRef.value) return;
  inputRef.value.value = 'JS 直接改的';
  tick.value += 1; // 强制重渲染，好让上面的对比看得出来
};
</script>

<template>
  <div>
    <h3>useTemplateRef：用字符串 key 拿到模板里的元素</h3>
    <p><input ref="keyword" :value="text" placeholder="在这里输入…" @input="onInput" /></p>
    <p>组件里的 text = 「{{ text }}」</p>
    <p>DOM 里的真实值 = 「{{ inputRef?.value ?? '' }}」</p>
    <p>强制重渲染 {{ tick }} 次</p>
    <p>
      <button type="button" @click="focusInput">聚焦输入框</button>
      <button type="button" @click="readValue">读输入框的值</button>
      <button type="button" @click="readCursor">读光标位置</button>
      <button type="button" @click="patchDomValue">用 JS 直接改 DOM 的值</button>
    </p>
    <p>
      点「用 JS 直接改 DOM 的值」：DOM 里的真实值变了，组件里的 <code>text</code> 却没变——
      你拿到的是真实的 DOM 元素，它不受组件状态管。
    </p>

    <h3>日志（从上到下 = 实际发生的先后顺序）</h3>
    <pre>{{ logLines.join('\n') }}</pre>

    <p>
      拿到的是真实 DOM 元素，所以能调用它自己的方法（focus、selectionStart）； 但 useTemplateRef
      返回的是只读的 shallowRef，不能手动赋值， 要改 DOM 就得先通过 inputRef.value 拿到元素。
    </p>
  </div>
</template>
