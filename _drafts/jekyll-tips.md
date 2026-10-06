---
layout: post
title: "Jekyll 使用技巧（草稿）"
author: "微言"
tags: [Jekyll, 技巧]
---

## 这是一篇草稿

草稿文章需要在构建时添加 `--drafts` 参数才会被渲染。

### 常用命令

```bash
# 本地预览（含草稿）
bundle exec jekyll serve --drafts

# 生产构建
JEKYLL_ENV=production bundle exec jekyll build
```
