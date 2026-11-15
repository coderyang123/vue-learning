#!/usr/bin/env python3
"""给 docs/01 的 §1 每一节插入「运行示例」链接。

幂等：已插过的小节会跳过。
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOC = ROOT / "docs/01-Vue3-核心与模板.md"
PORT = 5171

# 小节号 → (示例 id, 源码文件名, 语法标题)
SECTIONS = [
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
]


def link_line(section: str, demo_id: str, filename: str, title: str) -> str:
    rel = f"../examples/01-template-syntax/src/demos/{filename}"
    return (
        f"> ▶️ **运行示例**：[打开 {section} {title}](http://localhost:{PORT}/#/demos/{demo_id})"
        f" · 源码：[`src/demos/{filename}`]({rel})"
    )


def main() -> int:
    text = DOC.read_text(encoding="utf-8")
    lines = text.split("\n")

    for section, demo_id, filename, title in SECTIONS:
        heading = f"### {section} "
        idx = next((i for i, line in enumerate(lines) if line.startswith(heading)), None)
        if idx is None:
            print(f"[跳过] 找不到小节 {section}")
            continue
        if idx + 1 < len(lines) and "运行示例" in lines[idx + 1]:
            print(f"[跳过] {section} 已插入链接")
            continue
        lines.insert(idx + 1, link_line(section, demo_id, filename, title))
        print(f"[插入] {section} → {demo_id}")

    DOC.write_text("\n".join(lines), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
