<!-- §1.18 ⑱ TypeScript 类型标注：类型在编译期被擦除，错误提前到保存文件时报 -->
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Task } from '@/types';

interface User {
  id: number;
  name: string;
  email: string;
}

// 类型标注：ref 的类型参数告诉 TS 里面装的是什么
const tasks = ref<Task[]>([]);
const loading = ref(false);
const currentUser = ref<User | null>(null);

// 返回类型显式标注：TS 能校验所有 return 分支
const visibleTasks = computed((): Task[] => tasks.value.filter((task) => !task.done));

const addTask = (title: string): void => {
  tasks.value = [...tasks.value, { id: tasks.value.length + 1, title, done: false }];
};

// async 函数的返回类型是 Promise<T>
const loadUser = async (id: number): Promise<User> => {
  loading.value = true;
  const user: User = { id, name: '张三', email: 'zhangsan@example.com' };
  loading.value = false;
  return user;
};

const run = async (): Promise<void> => {
  currentUser.value = await loadUser(1);
};

// 运行时真正能观察到的值（脚本里 ref 不会自动解包，所以在这里取值）
const runtimeTypes = {
  // eslint-disable-next-line vue/no-ref-as-operand -- 这里就是要看 ref 对象本身
  refObject: typeof tasks,
  refValue: typeof tasks.value,
  valueIsArray: Array.isArray(tasks.value),
  loadingValue: typeof loading.value,
};
</script>

<template>
  <div>
    <h3>声明的类型</h3>
    <ul>
      <li><code>tasks</code> → <code>Ref&lt;Task[]&gt;</code></li>
      <li><code>loading</code> → <code>Ref&lt;boolean&gt;</code></li>
      <li><code>currentUser</code> → <code>Ref&lt;User | null&gt;</code></li>
      <li><code>visibleTasks</code> → <code>ComputedRef&lt;Task[]&gt;</code></li>
      <li><code>loadUser()</code> → <code>Promise&lt;User&gt;</code></li>
    </ul>

    <h3>运行时看到的</h3>
    <ul>
      <li>
        <code>typeof tasks</code> → <code>{{ runtimeTypes.refObject }}</code
        >（ref 对象本身）
      </li>
      <li>
        <code>typeof tasks.value</code> → <code>{{ runtimeTypes.refValue }}</code
        >（数组）
      </li>
      <li>
        <code>Array.isArray(tasks.value)</code> → <code>{{ runtimeTypes.valueIsArray }}</code>
      </li>
      <li>
        <code>typeof loading.value</code> → <code>{{ runtimeTypes.loadingValue }}</code>
      </li>
    </ul>

    <h3>跑一遍</h3>
    <p>
      <button type="button" @click="addTask('写一个 TypeScript 类型')">addTask()</button>
      <button type="button" @click="run">await loadUser(1)</button>
    </p>
    <p>
      tasks：<code>{{ JSON.stringify(tasks) }}</code>
    </p>
    <p>
      visibleTasks（computed）：<code>{{ JSON.stringify(visibleTasks) }}</code>
    </p>
    <p>
      currentUser：<code>{{ JSON.stringify(currentUser) }}</code>
    </p>
    <p>
      loading：<code>{{ loading }}</code>
    </p>

    <h3>类型错误长什么样</h3>
    <p>
      把 <code>tasks.value = [...tasks.value, { id: 1 }]</code> 写进
      <code>src/demos/DemoTypescript.vue</code>（少写 <code>title</code> 和
      <code>done</code>），然后在示例目录执行 <code>pnpm typecheck</code>：
    </p>
    <pre>
src/demos/DemoTypescript.vue(52,18): error TS2345:
  Type '{ id: number; }' is not assignable to type 'Task'.
    Property 'title' is missing in type '{ id: number; }' but required in type 'Task'.
    Property 'done' is missing in type '{ id: number; }' but required in type 'Task'.</pre>
  </div>
</template>
