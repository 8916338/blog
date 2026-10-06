/**
 * 数据模块 - 微博文章数据
 */

const Data = {
    posts: [
        {
            id: 'welcome',
            title: '欢迎来到微言博客',
            date: '2026-10-01',
            tags: ['公告', '随笔'],
            excerpt: '这是一个模仿 Huxpro 博客主题的现代化微博模板，支持 Markdown 渲染、多页面路由、PWA 等特性。本文介绍项目的主要功能和用法。',
            likes: 42,
            content: `# 欢迎来到微言博客

这是一个模仿 [Huxpro/huxpro.github.io](https://github.com/Huxpro/huxpro.github.io) 的现代化微博模板项目。

## ✨ 项目特性

- **零依赖** - 纯原生 JavaScript，无需构建工具
- **模块化** - 组件、路由、数据分离
- **Markdown 渲染** - 支持完整的 GFM 语法
- **PWA 支持** - 可添加到主屏幕，支持离线访问
- **响应式设计** - 完美适配移动端和桌面端
- **暗色模式** - 自动跟随系统主题

## 🛠️ 技术架构

\`\`\`javascript
// 项目结构
├── index.html          # 主入口
├── public/
│   ├── css/main.css    # 主样式
│   └── js/
│       ├── utils.js    # 工具函数
│       ├── data.js     # 数据层
│       ├── markdown.js # Markdown 渲染
│       ├── router.js   # 路由系统
│       ├── components.js # UI 组件
│       └── app.js      # 应用入口
├── posts/              # Markdown 文章
└── manifest.json       # PWA 配置
\`\`\`

## 📝 如何使用

1. 直接在浏览器中打开 \`index.html\`
2. 或者部署到任何静态托管服务（GitHub Pages、Vercel 等）
3. 在 \`data.js\` 中添加你的文章

> "简单即是美" —— 这个模板的设计理念

---

*希望你喜欢这个模板！*`
        },
        {
            id: 'javascript-es6',
            title: '深入理解 JavaScript ES6+ 新特性',
            date: '2026-09-28',
            tags: ['JavaScript', '前端'],
            excerpt: 'ES6 引入了大量革命性的新特性，本文系统性地梳理了箭头函数、解构赋值、模板字符串、Promise 等核心特性的用法和最佳实践。',
            likes: 128,
            content: `# 深入理解 JavaScript ES6+ 新特性

ES6（ECMAScript 2015）是 JavaScript 语言的一次重大更新，引入了许多现代化的编程特性。

## 箭头函数

箭头函数不仅语法简洁，更重要的是它**不绑定自己的 this**。

\`\`\`javascript
// 传统函数
function add(a, b) {
    return a + b;
}

// 箭头函数
const add = (a, b) => a + b;

// 单行可省略 return
const square = n => n * n;

// 多行需要花括号和 return
const fetchData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};
\`\`\`

## 解构赋值

解构赋值让从数组和对象中提取值变得异常简单。

\`\`\`javascript
// 数组解构
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first);  // 1
console.log(rest);   // [3, 4, 5]

// 对象解构
const { name, age, city = '北京' } = user;
console.log(city);   // 默认值 '北京'

// 函数参数解构
function greet({ name, title = '朋友' }) {
    return \`你好，\${title} \${name}！\`;
}
\`\`\`

## Promise 与 async/await

\`\`\`javascript
// Promise 链
fetch('/api/data')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));

// async/await - 更优雅的异步处理
async function getData() {
    try {
        const res = await fetch('/api/data');
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('出错了:', err);
    }
}
\`\`\`

## 模板字符串

\`\`\`javascript
const name = '世界';
const greeting = \`
    你好，\${name}！
    今天是 \${new Date().toLocaleDateString()}。
\`;
\`\`\`

## 小结

| 特性 | 用途 | 推荐度 |
|------|------|--------|
| 箭头函数 | 简洁函数、词法 this | ⭐⭐⭐⭐⭐ |
| 解构赋值 | 提取值 | ⭐⭐⭐⭐⭐ |
| async/await | 异步处理 | ⭐⭐⭐⭐⭐ |
| 模块系统 | 代码组织 | ⭐⭐⭐⭐⭐ |
| Proxy | 元编程 | ⭐⭐⭐ |

> 掌握这些特性，你的 JavaScript 代码将更加简洁、优雅、易维护。`
        },
        {
            id: 'css-tips',
            title: '10 个实用的 CSS 技巧',
            date: '2026-09-20',
            tags: ['CSS', '前端', '技巧'],
            excerpt: '分享 10 个日常开发中非常实用的 CSS 技巧，包括自定义滚动条、毛玻璃效果、渐变文字、CSS 变量等，提升你的样式开发效率。',
            likes: 89,
            content: `# 10 个实用的 CSS 技巧

日常开发中积累的一些 CSS 小技巧，简单但非常实用。

## 1. 自定义滚动条

\`\`\`css
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.2);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(0,0,0,0.4);
}
\`\`\`

## 2. 毛玻璃效果

\`\`\`css
.glass {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
}
\`\`\`

## 3. 渐变文字

\`\`\`css
.gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
\`\`\`

## 4. CSS 变量

\`\`\`css
:root {
    --primary: #667eea;
    --radius: 8px;
    --transition: all 0.3s ease;
}

.button {
    background: var(--primary);
    border-radius: var(--radius);
    transition: var(--transition);
}
\`\`\`

## 5. 居中布局（现代方案）

\`\`\`css
.center {
    display: grid;
    place-items: center;
}
\`\`\`

## 6. 截断文本

\`\`\`css
/* 单行 */
.truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 多行 */
.clamp {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
\`\`\`

## 7. 平滑滚动

\`\`\`css
html {
    scroll-behavior: smooth;
}
\`\`\`

## 8. 悬停放大效果

\`\`\`css
.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}
\`\`\`

## 9. 响应式排版

\`\`\`css
html {
    font-size: 16px;
}

@media (max-width: 768px) {
    html {
        font-size: 14px;
    }
}
\`\`\`

## 10. 暗色模式适配

\`\`\`css
@media (prefers-color-scheme: dark) {
    :root {
        --bg: #1a1a2e;
        --text: #e0e0e0;
    }
}
\`\`\`

---

*这些技巧涵盖了日常开发中最常用的场景，希望对你有帮助！*`
        },
        {
            id: 'git-workflow',
            title: 'Git 工作流最佳实践',
            date: '2026-09-15',
            tags: ['Git', '工具'],
            excerpt: '团队协作中 Git 工作流的规范至关重要。本文介绍了 Git Flow、GitHub Flow 和 Trunk Based Development 三种主流工作流，以及提交信息规范。',
            likes: 67,
            content: `# Git 工作流最佳实践

良好的 Git 工作流是团队协作的基石。

## 主流工作流对比

| 工作流 | 适用场景 | 复杂度 |
|--------|----------|--------|
| Git Flow | 有版本发布周期的项目 | 高 |
| GitHub Flow | 持续部署项目 | 低 |
| Trunk Based | 大型团队、高频集成 | 中 |

## Git Flow 分支模型

\`\`\`
main (生产环境)
  ↑
release/x.x.x (预发布)
  ↑
develop (开发主分支)
  ↑
feature/xxx (功能分支)
  ↑
hotfix/xxx (紧急修复)
\`\`\`

## 常用命令速查

\`\`\`bash
# 创建功能分支
git checkout -b feature/login develop

# 合并到 develop
git checkout develop
git merge --no-ff feature/login

# 创建发布分支
git checkout -b release/1.0.0 develop

# 紧急修复
git checkout -b hotfix/1.0.1 main
\`\`\`

## 提交信息规范（Conventional Commits）

\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

类型（type）包括：
- \`feat\` - 新功能
- \`fix\` - 修复 bug
- \`docs\` - 文档更新
- \`style\` - 代码格式调整
- \`refactor\` - 重构
- \`test\` - 测试相关
- \`chore\` - 构建/工具变动

## 示例

\`\`\`
feat(auth): 添加 OAuth 登录支持

- 集成 Google OAuth 2.0
- 添加登录回调处理
- 更新用户表结构

Closes #123
\`\`\`

> 好的提交信息就像好的代码注释，是对未来的自己和其他开发者的尊重。`
        },
        {
            id: 'life-thoughts',
            title: '秋日随笔：关于专注与效率的思考',
            date: '2026-10-05',
            tags: ['随笔', '思考'],
            excerpt: '秋天是一个适合思考的季节。在这个信息碎片化的时代，如何保持专注、提高效率，是我最近一直在思考的问题。',
            likes: 156,
            content: `# 秋日随笔：关于专注与效率的思考

秋天，天高云淡，是一个适合安静思考的季节。

## 信息过载的困境

我们生活在一个信息爆炸的时代。每天打开手机，无数的推送、消息、通知争先恐后地争夺我们的注意力。

> 注意力是最宝贵的资源，一旦分散，就很难收回。

## 深度工作的价值

卡尔·纽波特的《深度工作》给了我很大的启发：

- 深度工作是指在无干扰的状态下专注进行职业活动
- 它能够使人的认知能力达到极限
- 这种努力能够创造新价值，提升技能

## 我的实践方法

### 1. 时间块管理

将一天划分为几个时间块，每个时间块专注于一件事。

### 2. 单任务模式

一次只做一件事，多任务切换是有巨大成本的。

### 3. 减少决策疲劳

建立日常惯例，减少不必要的选择。

### 4. 定期断联

每天留出一段不被打扰的时间，远离手机和网络。

## 写在最后

专注不是天赋，而是一种可以训练的技能。在这个浮躁的时代，能够沉下心来做好一件事，本身就是一种稀缺的能力。

---

*愿你我都能在这个喧嚣的世界里，找到属于自己的一片宁静。* 🍂`
        },
        {
            id: 'react-vs-vue',
            title: 'React vs Vue：2026 年该如何选择？',
            date: '2026-09-10',
            tags: ['前端', 'React', 'Vue', '对比'],
            excerpt: 'React 和 Vue 是目前最流行的两个前端框架。本文从学习曲线、生态系统、性能、开发体验等多个维度进行对比分析，帮助你做出选择。',
            likes: 203,
            content: `# React vs Vue：2026 年该如何选择？

这是前端圈经久不衰的话题，也是新手最常问的问题之一。

## 快速对比

| 维度 | React | Vue |
|------|-------|-----|
| 维护方 | Meta (Facebook) | 独立团队 + 社区 |
| 学习曲线 | 中等 | 平缓 |
| 数据绑定 | 单向 | 双向 |
| 模板语法 | JSX | HTML 模板 |
| 状态管理 | Redux/Zustand | Pinia/Vuex |
| 路由 | React Router | Vue Router |

## React 的优势

### 生态庞大

React 拥有最大的社区和第三方库生态，几乎你能想到的功能都有成熟的解决方案。

### 灵活性强

React 更像是一个库而非框架，你可以自由选择其他工具来搭建完整方案。

### 适合大型项目

对于大型团队协作，React 的单向数据流和严格规范有助于代码维护。

\`\`\`jsx
function App() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(c => c + 1)}>
                +1
            </button>
        </div>
    );
}
\`\`\`

## Vue 的优势

### 上手简单

Vue 的模板语法接近 HTML，对初学者非常友好。

### 开箱即用

Vue 官方提供了从路由到状态管理的完整工具链。

### 渐进式框架

可以从简单的页面增强开始，逐步扩展到完整的 SPA。

\`\`\`vue
<template>
    <div>
        <p>Count: {{ count }}</p>
        <button @click="count++">+1</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const count = ref(0);
</script>
\`\`\`

## 我的建议

1. **新手入门** → Vue 更容易上手
2. **大公司就业** → React 岗位更多
3. **个人项目** → 选你喜欢的
4. **团队项目** → 选团队熟悉的

> 框架只是工具，解决问题的能力和编程思维才是核心。

无论选择哪个，先把一个框架学深学透，再去看另一个，你会发现它们有很多相通之处。`
        }
    ],

    // 按年份分组
    getPostsByYear() {
        const groups = {};
        this.posts.forEach(post => {
            const year = post.date.slice(0, 4);
            if (!groups[year]) groups[year] = [];
            groups[year].push(post);
        });
        Object.keys(groups).forEach(year => {
            groups[year].sort((a, b) => b.date.localeCompare(a.date));
        });
        return groups;
    },

    // 获取所有标签
    getTags() {
        const tags = new Set();
        this.posts.forEach(post => {
            post.tags.forEach(tag => tags.add(tag));
        });
        return [...tags];
    },

    // 获取标签及文章数量
    getTagsWithCount() {
        const counts = {};
        this.posts.forEach(post => {
            post.tags.forEach(tag => {
                counts[tag] = (counts[tag] || 0) + 1;
            });
        });
        return Object.entries(counts)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count);
    },

    // 按标签筛选
    getPostsByTag(tag) {
        return this.posts.filter(post =>
            post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        );
    },

    // 根据 ID 获取文章
    getPostById(id) {
        return this.posts.find(post => post.id === id);
    }
};
