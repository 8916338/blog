/**
 * 应用入口 - 初始化与全局逻辑
 */

const App = {
    init() {
        // 渲染基础组件
        Components.renderNavbar();
        Components.renderSidebar();
        Components.renderFooter();

        // 注册路由
        Router.register('/', () => Components.renderHome());
        Router.register('/archive', () => Components.renderArchive());
        Router.register('/tags', () => Components.renderTags());
        Router.register('/about', () => Components.renderAbout());

        // 启动路由
        Router.init();

        // 初始化 PWA
        this.initPWA();

        // 初始化点赞状态
        this.initLikes();
    },

    // 打开文章详情（弹窗模式）
    openPost(postId) {
        const post = Data.getPostById(postId);
        if (!post) return;

        const overlay = document.getElementById('modal-overlay');
        const title = document.getElementById('modal-title');
        const body = document.getElementById('modal-body');

        title.textContent = post.title;
        body.innerHTML = `
            <div class="post-meta" style="margin-bottom:24px;">
                <div class="author-avatar">微</div>
                <span class="author-name">微言</span>
                <span class="post-date">· ${Utils.formatDate(post.date)}</span>
            </div>
            <div class="markdown-body">
                ${Markdown.render(post.content)}
            </div>
        `;

        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // 路由同步
        Router.navigate(`/post/${postId}`);
    },

    // 关闭弹窗
    closePost() {
        const overlay = document.getElementById('modal-overlay');
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        Router.navigate('/');
    },

    // 点赞
    likePost(postId) {
        const likes = Utils.storage.get('likes', {});
        likes[postId] = (likes[postId] || 0) + 1;
        Utils.storage.set('likes', likes);

        const el = document.getElementById(`like-${postId}`);
        if (el) el.textContent = parseInt(el.textContent) + 1;
    },

    // 分享
    sharePost(postId) {
        const post = Data.getPostById(postId);
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.excerpt,
                url: window.location.href
            });
        } else {
            // 复制到剪贴板
            const url = `${window.location.origin}${window.location.pathname}#/post/${postId}`;
            navigator.clipboard.writeText(url).then(() => {
                this.showToast('链接已复制到剪贴板');
            });
        }
    },

    // 按标签筛选
    filterByTag(tag) {
        const posts = Data.getPostsByTag(tag);
        const container = document.getElementById('tag-posts');

        if (posts.length === 0) {
            container.innerHTML = '<p class="page-subtitle">该标签下暂无文章</p>';
            return;
        }

        container.innerHTML = `
            <div class="page-header" style="margin-top:32px;">
                <h2 class="page-title" style="font-size:1.5rem;">标签: #${tag}</h2>
                <p class="page-subtitle">共 ${posts.length} 篇文章</p>
            </div>
            ${posts.map(post => Components.renderPostCard(post)).join('')}
        `;
    },

    // 初始化点赞状态
    initLikes() {
        const likes = Utils.storage.get('likes', {});
        // 合并本地存储的点赞数
        setTimeout(() => {
            Object.entries(likes).forEach(([postId, count]) => {
                const el = document.getElementById(`like-${postId}`);
                if (el) {
                    const baseLikes = Data.getPostById(postId)?.likes || 0;
                    el.textContent = baseLikes + count;
                }
            });
        }, 300);
    },

    // 提示信息
    showToast(msg) {
        const toast = Utils.createElement('div', {
            className: 'toast-message',
            textContent: msg,
            style: `
                position: fixed;
                bottom: 32px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--primary-color);
                color: #fff;
                padding: 12px 24px;
                border-radius: var(--radius-sm);
                box-shadow: var(--shadow-lg);
                z-index: 3000;
                animation: slideUp 0.3s ease;
            `
        });
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    },

    // PWA 初始化
    initPWA() {
        // 注册 Service Worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./public/sw.js')
                    .then(reg => console.log('SW registered:', reg.scope))
                    .catch(err => console.log('SW registration failed:', err));
            });
        }
    }
};

// 弹窗关闭事件
document.getElementById('modal-close').addEventListener('click', () => App.closePost());
document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) App.closePost();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') App.closePost();
});

// 启动应用
document.addEventListener('DOMContentLoaded', () => App.init());
