import type { Ref } from 'vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';

export interface HashRoute {
  /** 当前的 location.hash，例如 `#/demos/1-3` */
  hash: Ref<string>;
}

/**
 * 极简 hash 路由：把 location.hash 变成响应式数据。
 *
 * 本章（01 · 模板语法）刻意不引入 vue-router，用原生 hash +
 * `hashchange` 事件就能实现「文档链接直接跳到某个示例」。
 */
export const useHashRoute = (): HashRoute => {
  const hash = ref<string>(window.location.hash);

  const sync = (): void => {
    hash.value = window.location.hash;
  };

  onMounted(() => {
    window.addEventListener('hashchange', sync);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('hashchange', sync);
  });

  return { hash };
};
