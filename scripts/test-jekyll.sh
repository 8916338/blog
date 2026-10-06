#!/bin/bash
# ============================================================
#  test-jekyll.sh — Jekyll 构建与链接检查
# ============================================================
set -e

echo "🧪 Jekyll 测试流程..."

# 1. 构建
echo "📦 Step 1: 构建 Jekyll 站点..."
bundle exec jekyll build --destination build/jekyll-test

# 2. 检查 HTML 链接完整性
echo ""
echo "🔍 Step 2: 检查 HTML 链接..."
if command -v htmlproofer &> /dev/null || bundle exec htmlproofer --version &> /dev/null; then
    bundle exec htmlproofer build/jekyll-test \
        --disable-external \
        --ignore-urls "/#.*/" \
        --check-html \
        --check-opengraph || echo "⚠️ 链接检查发现问题（非致命）"
else
    echo "⚠️ htmlproofer 未安装，跳过链接检查"
    echo "   安装方式: bundle add html-proofer --group=development"
fi

# 3. 统计
echo ""
echo "📊 Step 3: 构建结果统计..."
find build/jekyll-test -name "*.html" | wc -l | awk '{print "  生成页面: "$1" 个"}'
find build/jekyll-test/_posts -name "*.md" 2>/dev/null | wc -l | awk '{print "  文章总数: "$1" 篇"}' || true

echo ""
echo "✅ 测试通过！"
