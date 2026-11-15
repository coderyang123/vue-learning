import { reactive } from 'vue';

export interface DemoLogEntry {
  id: number;
  time: string;
  message: string;
}

/** 示例共用的运行日志：多个演示组件往里写，页面渲染成文本 */
export const demoLog = reactive<{ entries: DemoLogEntry[] }>({ entries: [] });

let sequence = 0;

export const logDemo = (message: string): void => {
  sequence += 1;
  demoLog.entries.unshift({
    id: sequence,
    time: new Date().toLocaleTimeString(),
    message,
  });
  if (demoLog.entries.length > 30) demoLog.entries.pop();
};

export const clearDemoLog = (): void => {
  demoLog.entries = [];
};
