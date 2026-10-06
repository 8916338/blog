# 贡献指南

感谢你对微言微博模板的关注！我们欢迎各种形式的贡献。

## 🚀 快速开始

1. Fork 本仓库
2. 克隆你的 Fork：`git clone https://github.com/你的用户名/weibo-template.git`
3. 安装依赖：`npm install`
4. 创建分支：`git checkout -b feature/your-feature`
5. 开始开发
6. 提交前检查：
   ```bash
   npm run lint       # 代码检查
   npm test           # 运行测试
   npm run build      # 构建验证
   ```
7. 提交 PR

## 📋 开发规范

### 代码风格
- 使用 2 空格缩进
- 使用单引号
- 语句末尾加分号
- 遵循 `.eslintrc.json` 和 `.prettierrc.json` 配置

### 提交信息
请使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 添加新功能
fix: 修复 Bug
docs: 文档变更
style: 代码格式（不影响逻辑）
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建/工具变更
```

### 分支命名
- `feature/xxx` - 新功能
- `fix/xxx` - Bug 修复
- `docs/xxx` - 文档
- `refactor/xxx` - 重构
- `perf/xxx` - 性能

## 🧪 测试

```bash
# 运行全部测试
npm test

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 📁 项目结构

```
weibo-template/
├── index.html          # 主入口
├── public/             # 静态资源
│   ├── css/main.css    # 样式
│   ├── js/             # JavaScript 模块
│   ├── manifest.json   # PWA 配置
│   └── sw.js           # Service Worker
├── scripts/            # 构建脚本
├── docs/              # 文档
└── .github/           # GitHub 配置
```

## 📝 添加文章

编辑 `public/js/data.js` 中的 `posts` 数组：

```javascript
{
  id: 'unique-id',
  title: '文章标题',
  excerpt: '摘要',
  content: '# Markdown 内容...',
  tags: ['标签1', '标签2'],
  date: '2026-10-06',
  cover: '封面图URL（可选）'
}
```

## ❓ 遇到问题？

- 查看 [Issues](https://github.com/你的用户名/weibo-template/issues)
- 创建新的 Issue

再次感谢你的贡献！ 🙏
