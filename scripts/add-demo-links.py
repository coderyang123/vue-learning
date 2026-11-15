#!/usr/bin/env python3
"""给各章文档的 §1 每一节插入「运行示例」链接。

用法：
    python3 scripts/add-demo-links.py            # 处理所有章节
    python3 scripts/add-demo-links.py 02         # 只处理第 02 章

幂等：已插过的小节会跳过。
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# 每章：小节号 → (示例 id, 源码文件名, 语法标题)
CHAPTERS: dict[str, dict] = {
    "01": {
        "doc": "docs/01-Vue3-核心与模板.md",
        "example": "01-template-syntax",
        "port": 5171,
        "sections": [
            ("1.3", "1-3", "DemoInterpolation.vue", "③ 插值 {{ }}"),
            ("1.4", "1-4", "DemoVBind.vue", "④ v-bind / :"),
            ("1.5", "1-5", "DemoVOn.vue", "⑤ v-on / @"),
            ("1.6", "1-6", "DemoVModel.vue", "⑥ v-model"),
            ("1.7", "1-7", "DemoVFor.vue", "⑦ v-for"),
            ("1.8", "1-8", "DemoVKey.vue", "⑧ :key"),
            ("1.9", "1-9", "DemoVIf.vue", "⑨ v-if / v-else"),
            ("1.10", "1-10", "DemoVShow.vue", "⑩ v-show"),
            ("1.11", "1-11", "DemoDynamicClass.vue", "⑪ 动态 class"),
            ("1.12", "1-12", "DemoDefineProps.vue", "⑫ defineProps"),
            ("1.13", "1-13", "DemoDefineEmits.vue", "⑬ defineEmits"),
            ("1.14", "1-14", "DemoRef.vue", "⑭ ref"),
            ("1.15", "1-15", "DemoComputed.vue", "⑮ computed"),
            ("1.16", "1-16", "DemoPropsEvents.vue", "⑯ props 绑定与事件监听"),
            ("1.17", "1-17", "DemoDefineModel.vue", "⑰ 组件 v-model 与 defineModel"),
            ("1.18", "1-18", "DemoTypescript.vue", "⑱ TypeScript 类型标注"),
        ],
    },
    "02": {
        "doc": "docs/02-响应式系统.md",
        "example": "02-reactivity",
        "port": 5172,
        "sections": [
            ("2.1", "2-1", "DemoRef.vue", "① ref 与模板自动解包"),
            ("2.2", "2-2", "DemoReactive.vue", "② reactive 与 Proxy"),
            ("2.3", "2-3", "DemoToRef.vue", "③ toRef / toRefs / toRaw / unref"),
            ("2.4", "2-4", "DemoComputedCache.vue", "④ computed 的惰性求值与缓存"),
            ("2.5", "2-5", "DemoWritableComputed.vue", "⑤ 可写 computed（get / set）"),
            ("2.6", "2-6", "DemoWatch.vue", "⑥ watch 的三个选项"),
            ("2.7", "2-7", "DemoWatchEffect.vue", "⑦ watchEffect 与自动依赖收集"),
            ("2.8", "2-8", "DemoOnCleanup.vue", "⑧ onCleanup 副作用清理"),
            ("2.9", "2-9", "DemoNextTick.vue", "⑨ 调度机制与 nextTick"),
            ("2.10", "2-10", "DemoShallow.vue", "⑩ shallowRef / shallowReactive / markRaw"),
            ("2.11", "2-11", "DemoTemplateRef.vue", "⑪ useTemplateRef"),
        ],
    },
}


def link_lines(section: str, demo_id: str, filename: str, title: str, example: str, port: int) -> list[str]:
    """生成「运行示例」两行块（与第 01 章文档的写法一致）。"""
    rel = f"../examples/{example}/src/demos/{filename}"
    return [
        f"> ▶️ **运行示例**：[打开 {section} {title}](http://localhost:{port}/#/demos/{demo_id})",
        f"> · 源码：[`src/demos/{filename}`]({rel})",
    ]


def section_has_link(lines: list[str], start: int) -> bool:
    """从标题往后扫到下一个标题，看这一节里是不是已经有「运行示例」链接。"""
    for line in lines[start + 1 :]:
        if line.startswith("### ") or line.startswith("## "):
            break
        if "运行示例" in line:
            return True
    return False


def process(chapter: str, config: dict) -> None:
    doc_path = ROOT / config["doc"]
    if not doc_path.exists():
        print(f"[跳过] 章节 {chapter} 的文档不存在：{config['doc']}")
        return

    text = doc_path.read_text(encoding="utf-8")
    lines = text.split("\n")

    for section, demo_id, filename, title in config["sections"]:
        heading = f"### {section} "
        idx = next((i for i, line in enumerate(lines) if line.startswith(heading)), None)
        if idx is None:
            print(f"[跳过] 找不到小节 {section}")
            continue
        if section_has_link(lines, idx):
            print(f"[跳过] {section} 已插入链接")
            continue
        lines[idx + 1 : idx + 1] = link_lines(
            section, demo_id, filename, title, config["example"], config["port"]
        )
        print(f"[插入] {section} → {demo_id}")

    doc_path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    targets = sys.argv[1:] or list(CHAPTERS)
    for chapter in targets:
        if chapter not in CHAPTERS:
            print(f"[跳过] 没有编号为 {chapter} 的章节配置")
            continue
        print(f"── 第 {chapter} 章 ──")
        process(chapter, CHAPTERS[chapter])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
