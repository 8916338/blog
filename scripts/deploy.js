/**
 * deploy.js - 部署辅助脚本
 * 用法: node scripts/deploy.js --target github-pages
 *      node scripts/deploy.js --target vercel
 */

import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import minimist from 'minimist';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const args = minimist(process.argv.slice(2));

const log = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✓'), msg),
  warn: (msg) => console.log(chalk.yellow('⚠'), msg),
  error: (msg) => console.log(chalk.red('✗'), msg),
  step: (msg) => console.log(chalk.cyan('\n▶'), chalk.bold(msg)),
};

async function deployToGitHubPages() {
  log.step('部署到 GitHub Pages...');
  log.info('确保 build/ 目录已构建: npm run build');
  log.info('将 build/ 内容推送到 gh-pages 分支');
  log.info('或使用 GitHub Actions 自动部署');
  log.success('GitHub Pages 部署指令已输出');
}

async function deployToVercel() {
  log.step('部署到 Vercel...');
  try {
    execSync('npx vercel --prod', { cwd: ROOT, stdio: 'inherit' });
    log.success('Vercel 部署完成');
  } catch (e) {
    log.warn('请先安装 Vercel CLI: npm i -g vercel');
  }
}

async function deployToNetlify() {
  log.step('部署到 Netlify...');
  try {
    execSync('npx netlify deploy --prod --dir=build', { cwd: ROOT, stdio: 'inherit' });
    log.success('Netlify 部署完成');
  } catch (e) {
    log.warn('请先安装 Netlify CLI: npm i -g netlify-cli');
  }
}

async function main() {
  const target = args.target || 'github-pages';

  console.log(chalk.bold.cyan('  🚀 微言部署工具\n'));

  switch (target) {
    case 'github-pages':
      await deployToGitHubPages();
      break;
    case 'vercel':
      await deployToVercel();
      break;
    case 'netlify':
      await deployToNetlify();
      break;
    default:
      log.error(`未知部署目标: ${target}`);
      log.info('支持的目标: github-pages, vercel, netlify');
      process.exit(1);
  }
}

main().catch((err) => {
  log.error(err.message);
  process.exit(1);
});
