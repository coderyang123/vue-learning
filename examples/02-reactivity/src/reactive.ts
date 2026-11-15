/**
 * 手写的迷你响应式系统：Proxy + Reflect + 依赖收集 / 依赖触发。
 *
 * Vue 真实的实现复杂得多（依赖去重、版本号 bump、调度器、只读劫持……），
 * 但骨架就是这四步：
 *
 *   1. 读属性时，把「当前正在跑的副作用」记到这个属性名下（收集依赖）
 *   2. 写属性时，把记在这个属性名下的副作用重新执行一遍（触发依赖）
 *
 * 本文件只做教学演示，不追求性能与完备性。
 */

/** 一个副作用函数：它依赖的数据变了，就重新跑一遍 */
export type Effect = () => void;

/**
 * 依赖表：目标对象 → 属性名 → 依赖这个属性的所有副作用。
 *
 * 用 WeakMap 是因为它的键是对象，源对象被回收时整张表可以一起被回收。
 */
const depsMap = new WeakMap<object, Map<PropertyKey, Set<Effect>>>();

/** 当前正在收集依赖的副作用；为 undefined 表示「现在不在收集」 */
let activeEffect: Effect | undefined;

/** 只把「对象」当成可代理的目标，原始值不代理 */
const isObject = (value: unknown): value is Record<PropertyKey, unknown> =>
  typeof value === 'object' && value !== null;

/**
 * 读取属性时调用：把 activeEffect 登记到这个属性名下。
 *
 * 依赖关系是「哪个副作用读过哪个对象的哪个属性」，粒度到属性一级。
 */
export const track = (target: object, key: PropertyKey): void => {
  // 不在任何副作用里读属性（比如初始化时直接读），就没有依赖要收集
  if (!activeEffect) return;

  let deps = depsMap.get(target);
  if (!deps) {
    deps = new Map();
    depsMap.set(target, deps);
  }

  let effects = deps.get(key);
  if (!effects) {
    effects = new Set();
    deps.set(key, effects);
  }

  effects.add(activeEffect);
};

/**
 * 写入属性时调用：把登记在这个属性名下的副作用重新执行一遍。
 */
export const trigger = (target: object, key: PropertyKey): void => {
  const effects = depsMap.get(target)?.get(key);
  if (!effects) return;

  // 复制一份再遍历：副作用重新执行时可能再次改动依赖表，边遍历边改会出问题
  for (const effect of [...effects]) {
    effect();
  }
};

/**
 * 执行 fn，并把它读到的所有属性登记成依赖。
 *
 * 返回的 runner 可以手动再跑一次，用来观察「依赖变了 → 副作用重跑」。
 */
export const effect = (fn: Effect): Effect => {
  const runner = (): void => {
    // 把自己设成「当前副作用」，fn 里读到的属性就都会记到它名下
    activeEffect = runner;
    fn();
    activeEffect = undefined;
  };

  runner();
  return runner;
};

/**
 * 创建一个响应式代理：读的时候收集依赖，写的时候触发副作用。
 */
export const createReactive = <T extends object>(target: T): T =>
  new Proxy(target, {
    get(target, key, receiver) {
      // 读：先记账
      track(target, key);

      const value = Reflect.get(target, key, receiver);

      // 嵌套对象再包一层，这样改深层属性也能触发
      return isObject(value) ? createReactive(value) : value;
    },

    set(target, key, value, receiver) {
      // 写：先让 Reflect 真正写进去
      const result = Reflect.set(target, key, value, receiver);

      // 再通知依赖这个属性的副作用
      trigger(target, key);
      return result;
    },
  });
