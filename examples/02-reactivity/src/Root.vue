<script setup lang="ts">
import { computed } from 'vue';
import App from '@/App.vue';
import DemoWorkbench from '@/views/DemoWorkbench.vue';
import { useHashRoute } from '@/composables/useHashRoute';

const { hash } = useHashRoute();

// `#/demos...` 走示例工作台，其余（空 hash 或 `#/`）走响应式实验室主示例
const showWorkbench = computed<boolean>(() => hash.value.startsWith('#/demos'));
</script>

<template>
  <DemoWorkbench v-if="showWorkbench" />
  <App v-else />
</template>
