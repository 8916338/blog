#!/bin/bash
# ============================================================
#  serve-jekyll.sh — Jekyll 本地开发服务器
# ============================================================
set -e

echo "🚀 启动 Jekyll 开发服务器..."
echo "📍 访问: http://localhost:4000"
echo "🔄 文件变更将自动刷新（Ctrl+C 停止）"
echo ""

# 生成高亮样式
mkdir -p assets/css
rougify style github > assets/css/syntax.css 2>/dev/null || true

if [ "$1" == "--drafts" ]; then
    echo "📝 包含草稿文章"
    bundle exec jekyll serve --drafts --livereload --port 4000
else
    bundle exec jekyll serve --livereload --port 4000
fi
