/** 一条待办任务 */
export interface Task {
  id: number;
  title: string;
  done: boolean;
}

/** 列表筛选条件 */
export type TaskFilter = 'all' | 'active' | 'done';
