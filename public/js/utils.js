/**
 * 工具函数库
 */

const Utils = {
    // 格式化日期
    formatDate(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    // 相对时间
    timeAgo(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = (now - date) / 1000;
        if (diff < 60) return '刚刚';
        if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
        if (diff < 2592000) return `${Math.floor(diff / 86400)} 天前`;
        if (diff < 31536000) return `${Math.floor(diff / 2592000)} 个月前`;
        return `${Math.floor(diff / 31536000)} 年前`;
    },

    // 防抖
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 创建 DOM 元素
    createElement(tag, attrs = {}, children = []) {
        const el = document.createElement(tag);
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'className') el.className = value;
            else if (key === 'innerHTML') el.innerHTML = value;
            else if (key === 'textContent') el.textContent = value;
            else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), value);
            else el.setAttribute(key, value);
        });
        children.forEach(child => {
            if (typeof child === 'string') el.appendChild(document.createTextNode(child));
            else if (child) el.appendChild(child);
        });
        return el;
    },

    // 本地存储封装
    storage: {
        get(key, defaultValue = null) {
            try {
                const val = localStorage.getItem(key);
                return val ? JSON.parse(val) : defaultValue;
            } catch {
                return defaultValue;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('Storage failed:', e);
            }
        },
        remove(key) {
            localStorage.removeItem(key);
        }
    },

    // 简单的模板引擎
    template(html, data) {
        return html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data[key] !== undefined ? data[key] : match;
        });
    },

    // 获取 URL hash 参数
    getHashRoute() {
        const hash = window.location.hash.slice(1) || '/';
        return hash;
    },

    // 转义 HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};
