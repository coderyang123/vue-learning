<!-- §1.8 ⑧ :key：用下标当 key，输入框里的字会跟错人 -->
<script setup lang="ts">
import { ref } from 'vue';

interface Row {
  id: number;
  label: string;
}

const rows = ref<Row[]>([
  { id: 1, label: '第 1 条：Vue' },
  { id: 2, label: '第 2 条：TypeScript' },
  { id: 3, label: '第 3 条：Vite' },
]);

// 删除第一条
const removeFirst = (): void => {
  if (rows.value.length === 0) return;
  rows.value.splice(0, 1);
};

// 在最前面插入一条
const insertFirst = (): void => {
  rows.value.unshift({ id: Date.now(), label: `新插入的一条（${rows.value.length + 1}）` });
};

const reset = (): void => {
  rows.value = [
    { id: 1, label: '第 1 条：Vue' },
    { id: 2, label: '第 2 条：TypeScript' },
    { id: 3, label: '第 3 条：Vite' },
  ];
};
</script>

<template>
  <div>
    <p>
      <button type="button" @click="insertFirst">在最前面插入一条</button>
      <button type="button" @click="removeFirst">删除第一条</button>
      <button type="button" @click="reset">重置</button>
    </p>
    <p>两栏数据完全一样，区别只在 key。先在任意一栏输入框里打点字，再点「删除第一条」。</p>

    <div class="demo-cols">
      <div>
        <h3><code>:key="index"</code>（错的做法）</h3>
        <ul>
          <li v-for="(row, index) in rows" :key="index">
            {{ row.label }} <input placeholder="在这里写点什么" />
          </li>
        </ul>
        <p>
          删掉第一条后，节点被复用给了新的第一条，<strong>输入框里的字留在了原地</strong>，跟标签对不上了。
        </p>
      </div>

      <div>
        <h3><code>:key="row.id"</code>（对的法）</h3>
        <ul>
          <li v-for="row in rows" :key="row.id">
            {{ row.label }} <input placeholder="在这里写点什么" />
          </li>
        </ul>
        <p>
          key 是稳定的 id，Vue
          知道哪个节点对应哪条数据，节点跟着数据走，<strong>输入框里的字始终跟着自己的那一条</strong>。
        </p>
      </div>
    </div>
  </div>
</template>
