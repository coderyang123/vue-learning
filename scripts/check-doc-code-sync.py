#!/usr/bin/env python3
"""校验各章文档的 §3 代码精读 与 examples/ 对应源码是否一致。

真实规则（对应文档 §3 的呈现方式）：
  1. 源码的每一行**代码**（去掉空行、结构性标签、以及被文档替换成 ① 编号标注的说明性注释）
     必须能在文档对应小节的代码块里找到，且**顺序一致**；
  2. 允许文档侧去掉 `<template>` 包裹造成的整体缩进左移；
  3. 源码里纯注释行被文档替换成编号标注时，只做提示，不算不一致。

用法：
    python3 scripts/check-doc-code-sync.py          # 检查所有章节
    python3 scripts/check-doc-code-sync.py 02       # 只检查第 02 章

退出码 0 = 一致，1 = 不一致。
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# 每章：文档路径 → 示例工程 src 目录 → §3 小节与源文件的对应关系
CHAPTERS: dict[str, dict] = {
    "01": {
        "doc": ROOT / "docs/01-Vue3-核心与模板.md",
        "src": ROOT / "examples/01-template-syntax/src",
        "sections": [
            ("3.1", "App.vue", "App.vue"),
            ("3.2", "TaskItem.vue", "components/TaskItem.vue"),
            ("3.3", "TaskFilterBar.vue", "components/TaskFilterBar.vue"),
        ],
    },
    "02": {
        "doc": ROOT / "docs/02-响应式系统.md",
        "src": ROOT / "examples/02-reactivity/src",
        "sections": [
            ("3.1", "reactive.ts", "reactive.ts"),
            ("3.2", "App.vue", "App.vue"),
        ],
    },
}

# 行尾的语法编号标注（① - ⑱）
ANNOT = re.compile(r"(<!--\s*[①-⑱][^>]*-->)|(//\s*[①-⑱][^/]*)$")
# 结构性标签行
STRUCTURAL = {
    '<script setup lang="ts">',
    "</script>",
    "<template>",
    "</template>",
}
# 纯说明性 HTML 注释（文档里被替换成 ① 编号标注）
PURE_COMMENT = re.compile(r"^\s*<!--.*-->\s*$")
# 字符串字面量（单引号 / 双引号 / 反引号）
STRING_LITERAL = re.compile(r"'(?:[^'\\]|\\.)*'|\"(?:[^\"\\]|\\.)*\"|`(?:[^`\\]|\\.)*`")


def strip_annot(line: str) -> str:
    return ANNOT.sub("", line).strip()


def normalize_ws(line: str) -> str:
    """去掉字符串字面量以外的所有空白。

    文档里的代码块刻意用紧凑写法（`import {ref} from 'vue'`），源码走 Prettier
    （`import { ref } from 'vue'`）——空格风格上的差异不算「文档与源码不一致」，
    所以比对前先归一化。字符串字面量里的空白原样保留，那部分是有语义的。
    """
    parts: list[str] = []
    last = 0
    for match in STRING_LITERAL.finditer(line):
        parts.append(re.sub(r"\s+", "", line[last : match.start()]))
        parts.append(match.group(0))
        last = match.end()
    parts.append(re.sub(r"\s+", "", line[last:]))
    return "".join(parts)


def is_code_line(line: str) -> bool:
    if not line.strip():
        return False
    if line.strip() in STRUCTURAL:
        return False
    if PURE_COMMENT.match(line):
        return False
    return True


def doc_section(doc: Path, sec: str) -> str:
    s = doc.read_text(encoding="utf-8")
    i = s.index(f"### {sec} ")
    j = s.find("\n### ", i + 1)
    if j == -1:
        j = s.index("\n## §4 ", i)
    return s[i:j]


def check_chapter(chapter: str, config: dict) -> bool:
    doc: Path = config["doc"]
    src_root: Path = config["src"]

    if not doc.exists():
        print(f"[跳过] 章节 {chapter} 的文档不存在：{doc.name}")
        return True

    ok = True
    for sec, name, rel in config["sections"]:
        src = src_root / rel
        if not src.exists():
            print(f"[跳过] {sec} 源文件不存在：{src}")
            continue

        doc_lines: list[str] = []
        for m in re.finditer(r"```(?:vue|ts|js)\n(.*?)```", doc_section(doc, sec), re.S):
            for raw in m.group(1).split("\n"):
                ln = strip_annot(raw)
                if is_code_line(ln):
                    doc_lines.append(normalize_ws(ln))

        src_raw = src.read_text(encoding="utf-8").split("\n")
        src_lines = [normalize_ws(strip_annot(x)) for x in src_raw if is_code_line(strip_annot(x))]
        src_comments = [
            x.strip() for x in src_raw if PURE_COMMENT.match(x) and not ANNOT.search(x)
        ]

        missing = [ln for ln in src_lines if ln not in doc_lines]
        extra = [ln for ln in doc_lines if ln not in src_lines]
        order_ok = [
            ln for i, ln in enumerate(doc_lines) if i < len(src_lines) and src_lines[i] != ln
        ]

        if missing or extra or order_ok:
            ok = False
            print(f"[不一致] 第 {chapter} 章 {sec} {name}")
            for ln in missing:
                print(f"    源码有、文档缺： {ln}")
            for ln in extra:
                print(f"    文档有、源码缺： {ln}")
            for ln in order_ok:
                print(f"    顺序不符：       {ln}")
        else:
            print(f"[一致]   第 {chapter} 章 {sec} {name}  （{len(src_lines)} 行代码顺序一致）")
            for c in src_comments:
                print(f"           （注释行在文档中替换为编号标注）：{c}")

    return ok


def main() -> int:
    targets = sys.argv[1:] or list(CHAPTERS)
    ok = True
    for chapter in targets:
        if chapter not in CHAPTERS:
            print(f"[跳过] 没有编号为 {chapter} 的章节配置")
            continue
        print(f"── 第 {chapter} 章 ──")
        ok = check_chapter(chapter, CHAPTERS[chapter]) and ok

    print()
    print("结果:", "✅ 全部一致" if ok else "❌ 存在不一致")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
