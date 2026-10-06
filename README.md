# 微言 - 极简微博模板

> 模仿 [Huxpro/huxpro.github.io](https://github.com/Huxpro/huxpro.github.io) 的现代化微博模板

## ✨ 特性

- 🏠 **首页** - 瀑布流卡片，点赞/分享交互
- 📚 **归档** - 按年份分组
- 🏷️ **标签云** - 筛选 + 计数
- 👤 **关于页** - 个人信息 + 技能
- 📝 **Markdown 渲染** - 代码高亮、表格、引用
- 📱 **PWA** - 离线访问、添加到主屏
- 🌙 **暗色模式** - 跟随系统主题
- 📲 **响应式** - 移动端/桌面端适配

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Ruby >= 3.0.0（使用 Jekyll 时需要）
- Bundler >= 2.0（使用 Jekyll 时需要）

### 安装

```bash
# 克隆项目
git clone https://github.com/your-username/weibo-template.git
cd weibo-template

# 安装依赖
npm install

# 初始化环境（可选）
node scripts/setup.js
```

### 开发

```bash
# 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

### 构建

```bash
# 生产构建
npm run build:prod

# 开发构建
npm run build:dev

# 输出目录: build/
```

### 测试

```bash
npm test
```

### 部署

```bash
# GitHub Pages
npm run deploy -- --target github-pages

# Vercel
npm run deploy -- --target vercel

# Netlify
npm run deploy -- --target netlify
```

## 📁 项目结构

```
weibo-template/
├── index.html                # 主入口
├── package.json              # 项目配置 & 脚本
├── package-lock.json         # 依赖锁定
├── .eslintrc.json            # ESLint 配置
├── .prettierrc.json          # Prettier 配置
├── .editorconfig             # 编辑器配置
├── .gitignore                # Git 忽略
├── .env.example              # 环境变量示例
├── public/                   # 静态资源
│   ├── manifest.json         # PWA 配置
│   ├── sw.js                 # Service Worker
│   ├── css/main.css          # 主样式
│   ├── images/               # 图标
│   └── js/                   # JS 模块
│       ├── app.js            # 应用入口
│       ├── router.js         # 路由
│       ├── components.js     # 组件
│       ├── markdown.js       # Markdown 渲染
│       ├── data.js           # 数据
│       └── utils.js          # 工具函数
├── scripts/                  # 工程脚本
│   ├── setup.js              # 环境初始化
│   ├── serve.js              # 开发服务器
│   ├── build.js              # 构建脚本
│   ├── lint.js               # 代码检查
│   ├── format.js             # 代码格式化
│   ├── test.js               # 测试套件
│   ├── optimize.js           # 资源优化
│   ├── deploy.js             # 部署辅助
│   ├── setup-jekyll.sh       # Jekyll 环境安装
│   ├── serve-jekyll.sh       # Jekyll 开发服务器
│   ├── build-jekyll.sh       # Jekyll 构建
│   └── test-jekyll.sh        # Jekyll 测试
├── docs/                     # 文档
├── build/                    # 构建输出（git忽略）
├── src/                      # 源码（扩展用）
└── .github/                  # GitHub 配置
    ├── workflows/            # GitHub Actions
    │   ├── ci.yml            # CI 流水线
    │   ├── deploy.yml        # 部署流水线
    │   ├── code-quality.yml  # 代码质量
    │   ├── dependency-update.yml  # 依赖更新
    │   └── jekyll.yml        # Jekyll 构建部署流水线
    ├── ISSUE_TEMPLATE/       # Issue 模板
    └── pull_request_template.md  # PR 模板
```

## 📜 NPM 脚本

| 命令 | 说明 |
|------|------|
| `npm install` | 安装依赖 |
| `npm run setup` | 初始化环境 |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建项目（先清理→检查→构建→优化） |
| `npm run build:prod` | 生产环境构建（压缩） |
| `npm run build:dev` | 开发环境构建（不压缩） |
| `npm run lint` | 代码质量检查 |
| `npm run format` | 代码格式化 |
| `npm run test` | 运行测试 |
| `npm run clean` | 清理构建目录 |
| `npm run optimize` | 优化资源 |
| `npm run deploy` | 部署到指定平台 |

## 🧩 Jekyll 脚本

| 命令 | 说明 |
|------|------|
| `npm run jekyll:setup` | 一键安装 Jekyll 环境（Ruby + 依赖） |
| `npm run jekyll:install` | 仅安装 Ruby gems |
| `npm run jekyll:serve` | 启动开发服务器（localhost:4000） |
| `npm run jekyll:serve:drafts` | 包含草稿预览 |
| `npm run jekyll:build` | 生产构建 |
| `npm run jekyll:build:drafts` | 包含草稿构建 |
| `npm run jekyll:test` | 构建 + HTML 链接检查 |
| `npm run jekyll:clean` | 清理 Jekyll 缓存和构建产物 |
| `npm run jekyll:syntax` | 生成代码高亮 CSS |
| `npm run jekyll:doctor` | 检查 Jekyll 配置 |

## 🤝 贡献

欢迎提交 Issue 和 PR！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 🧩 Jekyll 环境（Markdown 渲染）

本项目同时支持 **Jekyll** 静态站点生成器，用于渲染 `_posts/` 目录下的 Markdown 文章，兼容 Huxpro 主题的 Rouge 代码高亮（Pygments 兼容）。

### 环境要求

- Ruby >= 3.0.0
- Bundler >= 2.0
- Node.js >= 18.0.0（前端资源构建）

### 一键安装

```bash
# 方式一：使用 npm 脚本（推荐）
npm run jekyll:setup

# 方式二：手动安装
bundle install
```

### 本地开发

```bash
# 启动 Jekyll 开发服务器（含热重载）
npm run jekyll:serve
# 访问 http://localhost:4000

# 包含草稿文章预览
npm run jekyll:serve:drafts
```

### 构建

```bash
# 生产构建（输出到 build/jekyll/）
npm run jekyll:build

# 包含草稿构建
npm run jekyll:build:drafts
```

### 代码高亮

```bash
# 生成 GitHub 风格代码高亮 CSS
npm run jekyll:syntax
```

### 测试

```bash
# 构建 + HTML 链接完整性检查
npm run jekyll:test

# 检查 Jekyll 配置
npm run jekyll:doctor
```

### Jekyll 目录结构

```
weibo-template/
├── _config.yml               # Jekyll 配置
├── Gemfile                   # Ruby 依赖
├── _posts/                   # Markdown 文章（命名：YYYY-MM-DD-title.md）
│   └── 2026-10-06-hello-jekyll.md
├── _drafts/                  # 草稿文章
│   └── jekyll-tips.md
├── _layouts/                 # 布局模板
│   ├── default.html          # 默认布局
│   └── post.html             # 文章布局
└── assets/css/syntax.css     # 代码高亮样式（自动生成）
```

### 写文章

在 `_posts/` 目录下创建文件，命名格式：`YYYY-MM-DD-title.md`

```markdown
---
layout: post
title: "文章标题"
date: 2026-10-06
author: "微言"
tags: [标签1, 标签2]
description: "文章摘要"
---

## 正文内容

支持 **GFM Markdown** 语法、代码高亮、表格、引用等。
```

### CI/CD 自动部署

推送代码到 `main`/`master` 分支后，GitHub Actions 工作流会自动：

1. 安装 Ruby + Jekyll 环境
2. 构建 Jekyll 站点
3. 生成代码高亮样式
4. 检查 HTML 链接完整性
5. 部署到 GitHub Pages

详见 `.github/workflows/jekyll.yml`

## 📄 License

MIT © 微言
