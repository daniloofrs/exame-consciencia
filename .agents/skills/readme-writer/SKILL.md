---
name: readme-writer
description: Build and polish high-impact, readable, fact-grounded README.md files following GitHub README best practices and NN/g readability guidelines.
source: nateberkopec/dotfiles
---

# README Writer

Instructions and guidelines for creating and revising clear, scannable, and fact-grounded `README.md` files for software projects.

## Core Principles

1. **Answer in order:**
   - What is this project? (One-line value proposition)
   - Why should I use it? (Audience and core benefits)
   - How do I run it right now? (Immediate live access and copy-pasteable commands)
   - How do I use and configure it? (Key features, shortcuts, options)
   - How do I verify and test it? (Real test commands with output)
   - How do I contribute / License?

2. **Fact-Grounded Only:**
   - Never invent commands, scripts, dependencies, or links. Scan the codebase first (`package.json`, manifests, `scripts/`, `tests/`).
   - All setup steps must work out of the box on a clean clone.

3. **Scannability & Readability (NN/g):**
   - Front-load information (inverted pyramid).
   - Use descriptive headings and bullet lists.
   - Avoid walls of text.
   - Keep prose plain, active, and human.

4. **GitHub Flavored Markdown (GFM) Features:**
   - Use `<kbd>` for key caps in shortcut tables.
   - Use `<details>` / `<summary>` for secondary details.
   - Use GitHub alerts (`> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`) sparingly.
