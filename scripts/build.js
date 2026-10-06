/**
 * build.js - 项目构建脚本
 * 用法: node scripts/build.js [--mode production|development] [--watch]
 */

import { mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import minimist from 'minimist';
import CleanCSS from 'clean-css';
import UglifyJS from 'uglify-js';
import { minify } from 'html-minifier-terser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BUILD_DIR = join(ROOT, 'build');

const args = minimist(process.argv.slice(2));
const MODE = args.mode || process.env.NODE_ENV || 'production';
const IS_PROD = MODE === 'production';

const log = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✓'), msg),
  warn: (msg) => console.log(chalk.yellow('⚠'), msg),
  error: (msg) => console.log(chalk.red('✗'), msg),
  step: (msg) => console.log(chalk.cyan('\n▶'), chalk.bold(msg)),
};

async function cleanBuildDir() {
  log.step('清理构建目录...');
  if (existsSync(BUILD_DIR)) {
    await rm(BUILD_DIR, { recursive: true, force: true });
  }
  await mkdir(BUILD_DIR, { recursive: true });
  log.success('构建目录已清理');
}

async function copyAssets() {
  log.step('复制静态资源...');

  // 复制 public 目录
  const publicDir = join(ROOT, 'public');
  if (existsSync(publicDir)) {
    await copyDir(publicDir, join(BUILD_DIR, 'public'));
    log.success('public/ → build/public/');
  }

  // 复制 src/images
  const srcImages = join(ROOT, 'src/images');
  if (existsSync(srcImages)) {
    await copyDir(srcImages, join(BUILD_DIR, 'images'));
    log.success('src/images/ → build/images/');
  }
}

async function copyDir(src, dest) {
  const { readdir } = await import('node:fs/promises');
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

async function minifyCSS() {
  if (!IS_PROD) return;
  log.step('压缩 CSS...');

  const cssPath = join(BUILD_DIR, 'public/css/main.css');
  if (!existsSync(cssPath)) return;

  const input = await readFile(cssPath, 'utf-8');
  const result = new CleanCSS({
    level: 2,
    compatibility: 'ie11',
  }).minify(input);

  if (result.errors.length > 0) {
    result.errors.forEach((e) => log.error(e));
    return;
  }

  await writeFile(cssPath, result.styles);
  const saved = ((input.length - result.styles.length) / input.length * 100).toFixed(1);
  log.success(`CSS 压缩完成 (节省 ${saved}%)`);
}

async function minifyJS() {
  if (!IS_PROD) return;
  log.step('压缩 JavaScript...');

  const jsDir = join(BUILD_DIR, 'public/js');
  const { readdir } = await import('node:fs/promises');

  if (!existsSync(jsDir)) return;

  const files = await readdir(jsDir);
  let totalSaved = 0;
  let totalOriginal = 0;

  for (const file of files) {
    if (!file.endsWith('.js')) continue;
    const filePath = join(jsDir, file);
    const input = await readFile(filePath, 'utf-8');
    const result = UglifyJS.minify(input, {
      compress: {
        drop_console: IS_PROD,
        passes: 2,
      },
      mangle: true,
      output: {
        comments: /^!/,
      },
    });

    if (result.error) {
      log.error(`${file}: ${result.error}`);
      continue;
    }

    await writeFile(filePath, result.code);
    const saved = input.length - result.code.length;
    totalSaved += saved;
    totalOriginal += input.length;
    log.info(`  ${file}: ${(input.length / 1024).toFixed(1)}KB → ${(result.code.length / 1024).toFixed(1)}KB`);
  }

  if (totalOriginal > 0) {
    const pct = (totalSaved / totalOriginal * 100).toFixed(1);
    log.success(`JavaScript 压缩完成 (共节省 ${pct}%)`);
  }
}

async function minifyHTML() {
  if (!IS_PROD) return;
  log.step('压缩 HTML...');

  const htmlPath = join(BUILD_DIR, 'index.html');
  if (!existsSync(htmlPath)) return;

  const input = await readFile(htmlPath, 'utf-8');
  const result = await minify(input, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true,
  });

  await writeFile(htmlPath, result);
  const saved = ((input.length - result.length) / input.length * 100).toFixed(1);
  log.success(`HTML 压缩完成 (节省 ${saved}%)`);
}

async function generateManifest() {
  log.step('生成构建信息...');
  const buildInfo = {
    version: new Date().toISOString(),
    mode: MODE,
    commit: getGitCommit(),
    buildTime: Date.now(),
  };
  await writeFile(
    join(BUILD_DIR, 'build-info.json'),
    JSON.stringify(buildInfo, null, 2)
  );
  log.success('构建信息已生成');
}

function getGitCommit() {
  try {
    const { execSync } = require('node:child_process');
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return 'unknown';
  }
}

async function main() {
  console.log(chalk.bold.gradient('cyan', 'magenta')('  ╔══════════════════════════════════════╗'));
  console.log(chalk.bold.gradient('cyan', 'magenta')('  ║       微言 - 项目构建系统          ║'));
  console.log(chalk.bold.gradient('cyan', 'magenta')('  ╚══════════════════════════════════════╝'));
  console.log(chalk.gray(`  模式: ${MODE === 'production' ? '🔥 生产环境' : '🛠️  开发环境'}\n`));

  const startTime = Date.now();

  await cleanBuildDir();
  await copyAssets();
  await minifyCSS();
  await minifyJS();
  await minifyHTML();
  await generateManifest();

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(chalk.green.bold(`\n✨ 构建完成！耗时 ${duration}s`));
  console.log(chalk.gray(`  输出目录: ${relative(ROOT, BUILD_DIR)}/\n`));
}

main().catch((err) => {
  log.error(err.message);
  process.exit(1);
});
