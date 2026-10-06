/**
 * 前端路由系统 (Hash-based)
 */

const Router = {
    currentRoute: '/',
    routes: {},

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    },

    register(path, handler) {
        this.routes[path] = handler;
    },

    navigate(path) {
        window.location.hash = path;
    },

    handleRoute() {
        const route = Utils.getHashRoute();
        this.currentRoute = route;

        // 隐藏加载器
        const loader = document.getElementById('page-loader');
        loader.style.display = 'flex';

        // 延迟渲染以显示过渡效果
        setTimeout(() => {
            if (this.routes[route]) {
                this.routes[route]();
            } else if (route.startsWith('/post/')) {
                const postId = route.replace('/post/', '');
                App.openPost(postId);
            } else if (route.startsWith('/tag/')) {
                const tag = decodeURIComponent(route.replace('/tag/', ''));
                App.filterByTag(tag);
            } else {
                this.routes['/']();
            }
            Components.updateActiveNav();
            loader.style.display = 'none';
            window.scrollTo(0, 0);
        }, 150);
    }
};
