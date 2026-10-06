# ============================================================
#  Gemfile — Jekyll 环境依赖管理
#  安装命令: bundle install
# ============================================================

source "https://rubygems.org"

# 锁定 Jekyll 版本
gem "jekyll", "~> 4.3.4"

# Windows/Linux/macOS 兼容
group :jekyll_plugins do
  # ---- 核心插件 ----
  gem "jekyll-paginate"      # 分页
  gem "jekyll-feed"          # RSS 订阅
  gem "jekyll-sitemap"       # SEO 站点地图
  gem "jekyll-seo-tag"       # SEO meta 标签
  gem "jekyll-relative-links"# 相对链接

  # ---- Markdown 增强 ----
  gem "jekyll-mentions"      # @提及
  gem "jekyll-avatar"        # 头像
  gem "jemoji"               # Emoji 支持

  # ---- 代码高亮 ----
  gem "rouge", "~> 4.2"      # 默认语法高亮（兼容 Pygments 主题）

  # ---- 其他工具 ----
  gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin, :msys]
  gem "tzinfo-data", :platforms => [:mingw, :x64_mingw, :mswin, :msys]
end

# 开发环境工具
group :development do
  gem "jekyll-admin", "~> 0.11.2"   # 可视化管理后台
  gem "html-proofer", "~> 5.0"       # HTML 链接检查
end
