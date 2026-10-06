/**
 * UI 组件库
 */

const Components = {
    // 渲染导航栏
    renderNavbar() {
        const navbar = document.getElementById('navbar');
        navbar.innerHTML = `
            <div class="logo">微<span>言</span></div>
            <ul class="nav-links">
                <li><a href="#/" data-route="/" class="nav-link">首页</a></li>
                <li><a href="#/archive" data-route="/archive" class="nav-link">归档</a></li>
                <li><a href="#/tags" data-route="/tags" class="nav-link">标签</a></li>
                <li><a href="#/about" data-route="/about" class="nav-link">关于</a></li>
            </ul>
        `;
        this.updateActiveNav();
    },

    // 更新导航高亮
    updateActiveNav() {
        const route = Router.currentRoute;
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.route === route);
        });
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.classList.toggle('active', link.dataset.route === route);
        });
    },

    // 渲染侧边栏
    renderSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.innerHTML = `
            <div class="sidebar-profile">
                <div class="sidebar-avatar">微</div>
                <div class="sidebar-name">微言博客</div>
                <div class="sidebar-bio">记录生活，分享技术<br>一个简洁优雅的微博模板</div>
                <div class="sidebar-stats">
                    <div class="sidebar-stat">
                        <div class="sidebar-stat-num" id="stat-posts">${Data.posts.length}</div>
                        <div class="sidebar-stat-label">文章</div>
                    </div>
                    <div class="sidebar-stat">
                        <div class="sidebar-stat-num" id="stat-tags">${Data.getTags().length}</div>
                        <div class="sidebar-stat-label">标签</div>
                    </div>
                    <div class="sidebar-stat">
                        <div class="sidebar-stat-num">2026</div>
                        <div class="sidebar-stat-label">始于</div>
                    </div>
                </div>
            </div>
            <ul class="sidebar-nav">
                <li><a href="#/" data-route="/"><span class="icon">🏠</span> 首页</a></li>
                <li><a href="#/archive" data-route="/archive"><span class="icon">📚</span> 归档</a></li>
                <li><a href="#/tags" data-route="/tags"><span class="icon">🏷️</span> 标签</a></li>
                <li><a href="#/about" data-route="/about"><span class="icon">👤</span> 关于</a></li>
            </ul>
        `;
    },

    // 渲染页脚
    renderFooter() {
        const footer = document.getElementById('footer');
        footer.innerHTML = `
            <p>&copy; 2026 微言博客 · 基于 Huxpro 主题启发</p>
            <p style="margin-top:8px;">
                <a href="https://github.com/Huxpro/huxpro.github.io" target="_blank" rel="noopener">灵感来源: Huxpro/huxpro.github.io</a>
            </p>
        `;
    },

    // 渲染微博卡片
    renderPostCard(post) {
        const tagsHtml = post.tags.map(tag =>
            `<span class="post-tag" style="opacity:0.85">${tag}</span>`
        ).join('');

        return `
            <article class="post-card" data-post-id="${post.id}" onclick="App.openPost('${post.id}')">
                <div class="post-meta">
                    <div class="author-avatar">微</div>
                    <span class="author-name">微言</span>
                    <span class="post-date">· ${Utils.timeAgo(post.date)}</span>
                    ${tagsHtml}
                </div>
                <h2 class="post-title">${post.title}</h2>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-actions" onclick="event.stopPropagation()">
                    <button class="post-action-btn" onclick="App.likePost('${post.id}')">
                        ❤️ <span id="like-${post.id}">${post.likes || 0}</span>
                    </button>
                    <button class="post-action-btn" onclick="App.openPost('${post.id}')">
                        💬 评论
                    </button>
                    <button class="post-action-btn" onclick="App.sharePost('${post.id}')">
                        🔗 分享
                    </button>
                </div>
            </article>
        `;
    },

    // 渲染首页
    renderHome() {
        const container = document.getElementById('main-content');
        container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">最近发布</h1>
                <p class="page-subtitle">分享思考与技术的点点滴滴</p>
            </div>
            <div id="posts-container">
                ${Data.posts.map(post => this.renderPostCard(post)).join('')}
            </div>
        `;
    },

    // 渲染归档页
    renderArchive() {
        const container = document.getElementById('main-content');
        const postsByYear = Data.getPostsByYear();

        let html = `
            <div class="page-header">
                <h1 class="page-title">文章归档</h1>
                <p class="page-subtitle">共 ${Data.posts.length} 篇文章</p>
            </div>
        `;

        Object.keys(postsByYear)
            .sort((a, b) => b - a)
            .forEach(year => {
                html += `<div class="archive-year">${year} 年 (${postsByYear[year].length})</div>`;
                html += `<ul class="archive-list">`;
                postsByYear[year].forEach(post => {
                    html += `
                        <li class="archive-item">
                            <span class="archive-date">${post.date.slice(5)}</span>
                            <a href="#/post/${post.id}" class="archive-title" onclick="App.openPost('${post.id}'); return false;">${post.title}</a>
                            <span class="archive-category">${post.tags[0] || '随笔'}</span>
                        </li>
                    `;
                });
                html += `</ul>`;
            });

        container.innerHTML = html;
    },

    // 渲染标签页
    renderTags() {
        const container = document.getElementById('main-content');
        const tags = Data.getTagsWithCount();

        let html = `
            <div class="page-header">
                <h1 class="page-title">标签云</h1>
                <p class="page-subtitle">按标签浏览所有文章</p>
            </div>
            <div class="tags-cloud">
        `;

        tags.forEach(({ tag, count }) => {
            html += `
                <span class="tag-item" onclick="App.filterByTag('${tag}')">
                    #${tag}<span class="count">(${count})</span>
                </span>
            `;
        });

        html += `</div>`;
        html += `<div id="tag-posts" style="margin-top:32px;"></div>`;

        container.innerHTML = html;
    },

    // 渲染关于页
    renderAbout() {
        const container = document.getElementById('main-content');
        container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">关于我</h1>
                <p class="page-subtitle">About Me</p>
            </div>

            <div class="about-section">
                <h3>👋 你好，我是微言</h3>
                <p>欢迎来到我的博客！这里是我记录生活、分享技术、表达思考的地方。</p>
                <p>这个博客模板灵感来源于 <a href="https://github.com/Huxpro/huxpro.github.io" target="_blank">Huxpro/huxpro.github.io</a>，一个经典的 Jekyll 博客主题。我将其现代化重构，使用原生 JavaScript 实现了类似的功能。</p>
            </div>

            <div class="about-section">
                <h3>🛠️ 技术栈</h3>
                <p>本项目采用纯前端技术栈，无需构建工具，开箱即用：</p>
                <div class="skill-tags">
                    <span class="skill-tag">HTML5</span>
                    <span class="skill-tag">CSS3 / Less 风格</span>
                    <span class="skill-tag">原生 JavaScript (ES6+)</span>
                    <span class="skill-tag">Markdown 渲染</span>
                    <span class="skill-tag">Hash 路由</span>
                    <span class="skill-tag">PWA 支持</span>
                    <span class="skill-tag">响应式设计</span>
                    <span class="skill-tag">暗色模式</span>
                </div>
            </div>

            <div class="about-section">
                <h3>✨ 特性</h3>
                <ul style="padding-left:20px; color:var(--text-secondary); line-height:2;">
                    <li><strong>模块化架构</strong> - 组件、路由、数据、工具分离</li>
                    <li><strong>多页面路由</strong> - 首页、归档、标签、关于页面</li>
                    <li><strong>Markdown 渲染</strong> - 支持 GFM 语法的文章渲染</li>
                    <li><strong>仿 Huxpro 风格</strong> - 简洁优雅的设计语言</li>
                    <li><strong>零依赖</strong> - 无需 npm install，直接打开即用</li>
                    <li><strong>PWA 就绪</strong> - 支持添加到主屏幕、离线访问</li>
                </ul>
            </div>

            <div class="about-section">
                <h3>📫 联系方式</h3>
                <p>如果你有任何问题或建议，欢迎联系我：</p>
                <div class="skill-tags">
                    <span class="skill-tag">📧 Email: hello@example.com</span>
                    <span class="skill-tag">🐙 GitHub: @username</span>
                    <span class="skill-tag">🐦 Twitter: @username</span>
                </div>
            </div>
        `;
    }
};
