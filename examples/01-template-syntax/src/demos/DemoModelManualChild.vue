<!-- §1.17 ⑰ v-model 的子组件（手写版：声明 prop + 声明事件 + 手动 emit） -->
<script setup lang="ts">
// 手写版：声明 prop + 声明事件 + 手动 emit
const props = defineProps<{
  title: string;
}>();

const emit = defineEmits<{
  'update:title': [value: string];
}>();
</script>

<template>
  <div>
    <input
      :value="props.title"
      placeholder="手写版：:value + @input"
      @input="emit('update:title', ($event.target as HTMLInputElement).value)"
    />
    <p>
      子组件读到的 prop：<code>{{ props.title || '（空）' }}</code>
    </p>
  </div>
</template>
