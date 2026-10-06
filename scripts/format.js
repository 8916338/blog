/**
 * format.js - 代码格式化
 * 用法: node scripts/format.js
 */

import { readFile, writeFile } from 'node:fs/promises';
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
  step: (msg) => console.log(chalk.cyan('\n▶'), chalk.bold(msg)),
};

// 简易格式化：统一缩进、末尾换行、去除行尾空格
async function formatJSFile(filePath) {
  let content = await readFile(filePath, 'utf-8');
  let lines = content.split('\n');

  // 去除行尾空格
  lines = lines.map((line) => line.replace(/\s+$/, ''));

  // 统一缩进为 2 空格
  let indentLevel = 0;
  lines = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return '';

    // 减少缩进（闭合括号）
    if (/^[})]/.test(trimmed)) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    const indented = '  '.repeat(indentLevel) + trimmed;

    // 增加缩进（开口括号）
    if (/[{[]\s*$/.test(trimmed)) {
      indentLevel++;
    }

    return indented;
  });

  // 确保末尾有换行
  let result = lines.join('\n');
  if (!result.endsWith('\n')) result += '\n';

  await writeFile(filePath, result);
}

async function getAllJSFiles(dir) {
  const { readdir } = await import('node:fs/promises');
  const { existsSync } = await import('node:fs');
  if (!existsSync(dir)) return [];
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'build', '.git', 'dist'].includes(entry.name)) continue;
      files.push(...(await getAllJSFiles(fullPath)));
    } else if (entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  console.log(chalk.bold.cyan('  🎨 代码格式化\n'));

  log.step('格式化 JavaScript 文件...');
  const dirs = [join(ROOT, 'public/js'), join(ROOT, 'scripts')];
  let totalFiles = 0;

  for (const dir of dirs) {
    const files = await getAllJSFiles(dir);
    for (const file of files) {
      await formatJSFile(file);
      totalFiles++;
      log.info(`格式化: ${file.replace(ROOT + '/', '')}`);
    }
  }

  log.success(`共格式化 ${totalFiles} 个文件`);
}

main().catch((err) => {
  log.error(err.message);
  process.exit(1);
});
