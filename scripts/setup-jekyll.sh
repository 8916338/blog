#!/bin/bash
# ============================================================
#  setup-jekyll.sh — Jekyll 环境一键安装脚本
# ============================================================
set -e

echo "🧩 正在安装 Jekyll 环境..."

# --- 检测操作系统 ---
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📱 检测到 macOS 系统"
    # macOS 需要安装 Ruby 开发环境
    if ! command -v brew &> /dev/null; then
        echo "❌ 请先安装 Homebrew: https://brew.sh"
        exit 1
    fi
    echo "📦 安装 Ruby 和依赖..."
    brew install ruby
    # 添加 Ruby 到 PATH（Apple Silicon / Intel 兼容）
    if [ -d "/opt/homebrew/opt/ruby/bin" ]; then
        export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
    elif [ -d "/usr/local/opt/ruby/bin" ]; then
        export PATH="/usr/local/opt/ruby/bin:$PATH"
    fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 检测到 Linux 系统"
    # 检测包管理器
    if command -v apt-get &> /dev/null; then
        echo "📦 使用 apt 安装 Ruby 开发环境..."
        sudo apt-get update
        sudo apt-get install -y ruby-full build-essential zlib1g-dev
    elif command -v dnf &> /dev/null; then
        echo "📦 使用 dnf 安装 Ruby 开发环境..."
        sudo dnf install -y ruby ruby-devel @development-tools
    elif command -v pacman &> /dev/null; then
        echo "📦 使用 pacman 安装 Ruby 开发环境..."
        sudo pacman -S --noconfirm ruby base-devel
    fi
fi

# --- 配置 RubyGems 镜像（国内加速）---
echo "🔧 配置 RubyGems 国内镜像..."
if gem sources --list | grep -q "rubygems.org"; then
    gem sources --remove https://rubygems.org/ 2>/dev/null || true
fi
if ! gem sources --list | grep -q "gems.ruby-china.com"; then
    gem sources --add https://gems.ruby-china.com/
fi
echo "✅ 当前 RubyGems 源："
gem sources --list

# --- 安装 Bundler ---
echo "📦 安装 Bundler..."
gem install bundler

# --- 安装 Jekyll 及插件 ---
echo "📦 安装 Jekyll 及插件（根据 Gemfile）..."
bundle install

# --- 生成代码高亮样式 ---
echo "🎨 生成 Rouge 代码高亮主题..."
mkdir -p assets/css
rougify style github > assets/css/syntax.css 2>/dev/null || echo "⚠️ Rouge 高亮样式生成跳过"

echo ""
echo "✅ Jekyll 环境安装完成！"
echo ""
echo "📖 常用命令："
echo "   bundle exec jekyll serve       # 本地开发预览"
echo "   bundle exec jekyll serve --drafts  # 包含草稿预览"
echo "   bundle exec jekyll build       # 生产构建"
echo "   bundle exec jekyll build --watch  # 监听文件变化"
echo ""
