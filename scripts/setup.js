/**
 * setup.js - 环境安装与初始化脚本
 * 用法: node scripts/setup.js [--check] [--force]
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
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

async function checkNodeVersion() {
  const nodeVersion = process.version;
  const major = parseInt(nodeVersion.slice(1).split('.')[0], 10);
  if (major < 18) {
    log.error(`Node.js 版本过低: ${nodeVersion}，需要 >= 18.0.0`);
    process.exit(1);
  }
  log.success(`Node.js 版本检查通过: ${nodeVersion}`);
}

async function checkNpmVersion() {
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
    log.success(`npm 版本: ${npmVersion}`);
  } catch (e) {
    log.error('未检测到 npm，请先安装 Node.js');
    process.exit(1);
  }
}

async function installDependencies() {
  log.step('安装项目依赖...');
  try {
    execSync('npm install', { cwd: ROOT, stdio: 'inherit' });
    log.success('依赖安装完成');
  } catch (e) {
    log.error('依赖安装失败，请检查网络连接');
    process.exit(1);
  }
}

async function createDirectories() {
  log.step('创建目录结构...');
  const dirs = ['build', 'dist', 'docs', '.tmp', 'src/posts'];
  for (const dir of dirs) {
    const fullPath = join(ROOT, dir);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
      log.info(`创建目录: ${dir}/`);
    }
  }
  log.success('目录结构就绪');
}

async function checkEnvironment() {
  log.step('检查运行环境...');

  // 检查 Git
  try {
    const gitVersion = execSync('git --version', { encoding: 'utf-8' }).trim();
    log.success(`Git: ${gitVersion}`);
  } catch (e) {
    log.warn('未检测到 Git，建议安装以便版本管理');
  }

  // 检查构建工具
  const tools = ['node', 'npm'];
  for (const tool of tools) {
    try {
      const version = execSync(`${tool} --version`, { encoding: 'utf-8' }).trim();
      log.info(`${tool}: ${version}`);
    } catch (e) {
      log.error(`${tool} 未安装`);
    }
  }

  log.success('环境检查完成');
}

async function generateEnvFile() {
  const envPath = join(ROOT, '.env.example');
  const content = `# 微言微博模板 - 环境变量配置
# 复制此文件为 .env 并修改相应值

# 站点配置
SITE_TITLE=微言
SITE_DESCRIPTION=一个极简的微博模板
SITE_AUTHOR=你的名字
SITE_URL=https://your-domain.com

# 构建配置
NODE_ENV=development
BUILD_MODE=dev

# 功能开关
ENABLE_PWA=true
ENABLE_ANALYTICS=false
ENABLE_COMMENTS=false

# 主题
THEME=light
`;
  writeFileSync(envPath, content);
  log.success('生成 .env.example 文件');
}

async function main() {
  console.log(chalk.bold.gradient('cyan', 'magenta')('  ╔══════════════════════════════════════╗'));
  console.log(chalk.bold.gradient('cyan', 'magenta')('  ║    微言 - 环境安装与初始化脚本      ║'));
  console.log(chalk.bold.gradient('cyan', 'magenta')('  ╚══════════════════════════════════════╝'));

  await checkNodeVersion();
  await checkNpmVersion();

  if (args.check) {
    await checkEnvironment();
    return;
  }

  await installDependencies();
  await createDirectories();
  await generateEnvFile();
  await checkEnvironment();

  console.log(chalk.green.bold('\n✨ 环境初始化完成！\n'));
  console.log(chalk.gray('  接下来你可以：'));
  console.log(chalk.gray('  • 运行 ') + chalk.cyan('npm run dev') + chalk.gray(' 启动开发服务器'));
  console.log(chalk.gray('  • 运行 ') + chalk.cyan('npm run build') + chalk.gray(' 构建生产版本'));
  console.log(chalk.gray('  • 运行 ') + chalk.cyan('npm test') + chalk.gray(' 运行测试\n'));
}

main().catch((err) => {
  log.error(err.message);
  process.exit(1);
});
