<script setup lang="ts">
import { computed } from 'vue';
import type { DemoEntry } from '@/demos/registry';
import { demos } from '@/demos/registry';
import { useHashRoute } from '@/composables/useHashRoute';

const { hash } = useHashRoute();

// 从 `#/demos/1-3` 里解析出示例 id
const currentId = computed<string>(() => {
  const matched = /^#\/demos\/([\w-]+)/.exec(hash.value);
  return matched?.[1] ?? '';
});

const current = computed<DemoEntry | undefined>(() =>
  demos.find((demo) => demo.id === currentId.value),
);

const currentIndex = computed<number>(() => demos.findIndex((demo) => demo.id === currentId.value));

const prevDemo = computed<DemoEntry | undefined>(() =>
  currentIndex.value > 0 ? demos[currentIndex.value - 1] : undefined,
);

const nextDemo = computed<DemoEntry | undefined>(() =>
  currentIndex.value >= 0 && currentIndex.value < demos.length - 1
    ? demos[currentIndex.value + 1]
    : undefined,
);

const demoHref = (demo: DemoEntry): string => `#/demos/${demo.id}`;
</script>

<template>
  <main class="demo-workbench">
    <h1>示例工作台 · 01 模板语法</h1>

    <nav>
      <a href="#/">待办清单（主示例）</a> · <a href="#/demos">示例目录</a>
      <span v-for="demo in demos" :key="demo.id"
        >· <a :href="demoHref(demo)">{{ demo.section }}</a></span
      >
    </nav>

    <hr />

    <!-- 指定了示例 id：展示该节的运行效果 -->
    <template v-if="current">
      <h2>{{ current.section }} · {{ current.syntax }}</h2>
      <p>
        {{ current.summary }}（源码：<code>{{ current.file }}</code
        >）
      </p>

      <component :is="current.component" />

      <p>
        <a v-if="prevDemo" :href="demoHref(prevDemo)"
          >‹ {{ prevDemo.section }} {{ prevDemo.syntax }}</a
        >
        <a v-if="nextDemo" :href="demoHref(nextDemo)"
          >{{ nextDemo.section }} {{ nextDemo.syntax }} ›</a
        >
      </p>
    </template>

    <!-- 只给了 `#/demos`：示例目录 -->
    <template v-else>
      <ul>
        <li v-for="demo in demos" :key="demo.id">
          <a :href="demoHref(demo)">{{ demo.section }} · {{ demo.syntax }}</a> —— {{ demo.summary }}
        </li>
      </ul>
    </template>
  </main>
</template>
