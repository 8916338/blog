#!/bin/bash
# ============================================================
#  build-jekyll.sh — Jekyll 构建脚本
# ============================================================
set -e

echo "🔨 开始 Jekyll 构建..."

# 设置环境变量
export JEKYLL_ENV=production

# 生成代码高亮样式
mkdir -p assets/css
rougify style github > assets/css/syntax.css 2>/dev/null || true

# 执行构建
if [ "$1" == "--drafts" ]; then
    echo "📝 包含草稿文章..."
    bundle exec jekyll build --drafts --destination build/jekyll
else
    bundle exec jekyll build --destination build/jekyll
fi

echo ""
echo "✅ Jekyll 构建完成！输出目录: build/jekyll/"
echo "📊 构建统计："
find build/jekyll -name "*.html" | wc -l | awk '{print "  HTML 页面: "$1" 个"}'
du -sh build/jekyll | awk '{print "  总大小: "$1}'
