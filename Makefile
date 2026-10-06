# 微言微博模板 - Makefile
# 用法: make <target>

.PHONY: help install setup dev build clean test lint format optimize deploy docker

# 默认目标
help: ## 显示帮助信息
	@echo "微言微博模板 - 可用命令:"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "\033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@echo ""

install: ## 安装依赖
	npm install

setup: ## 初始化环境
	node scripts/setup.js

dev: ## 启动开发服务器
	npm run dev

build: ## 构建生产版本
	npm run build:prod

clean: ## 清理构建目录
	npm run clean

test: ## 运行测试
	npm test

lint: ## 代码检查
	npm run lint

format: ## 代码格式化
	npm run format

optimize: ## 优化资源
	npm run optimize

deploy: ## 部署到 GitHub Pages
	npm run deploy -- --target github-pages

docker: ## Docker 构建并运行
	docker build -t weibo-template .
	docker run -d -p 8080:80 --name weibo-template weibo-template

docker-stop: ## 停止 Docker 容器
	docker stop weibo-template
	docker rm weibo-template

ci: install lint test build ## 运行 CI 流程
