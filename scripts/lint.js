/**
 * lint.js - 代码质量检查
 * 用法: node scripts/lint.js [--fix]
 */

import { readFile } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
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

// 内嵌基础检查规则
const rules = {
  'no-console': {
    check: (line) => !/\bconsole\.(log|debug|info)\s*\(/.test(line),
    message: '生产代码不应包含 console.log/debug/info',
    severity: 'warn',
  },
  'no-debugger': {
    check: (line) => !/\bdebugger\s*;/.test(line),
    message: '不应包含 debugger 语句',
    severity: 'error',
  },
  'no-alert': {
    check: (line) => !/\balert\s*\(/.test(line),
    message: '不应使用 alert()',
    severity: 'warn',
  },
  'eqeqeq': {
    check: (line) => !/(?<!\!)==(?!=)|!=/.test(line),
    message: '请使用 === 和 !== 代替 == 和 !=',
    severity: 'warn',
  },
  'trailing-spaces': {
    check: (line) => !/\s+$/.test(line),
    message: '行尾有多余空格',
    severity: 'warn',
  },
};

async function lintFile(filePath) {
  const content = await readFile(filePath, 'utf-8');
  const lines = content.split('\n');
  const issues = [];

  lines.forEach((line, index) => {
    for (const [ruleName, rule] of Object.entries(rules)) {
      if (!rule.check(line)) {
        issues.push({
          file: filePath,
          line: index + 1,
          rule: ruleName,
          message: rule.message,
          severity: rule.severity,
        });
      }
    }
  });

  return issues;
}

async function getAllJSFiles(dir) {
  const { readdir } = await import('node:fs/promises');
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'build' || entry.name === '.git') continue;
      files.push(...(await getAllJSFiles(fullPath)));
    } else if (entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  console.log(chalk.bold.cyan('  🔍 代码质量检查\n'));

  const jsDir = join(ROOT, 'public/js');
  const scriptsDir = join(ROOT, 'scripts');

  log.step('扫描 JavaScript 文件...');
  let allFiles = [];
  if (existsSafe(jsDir)) allFiles.push(...(await getAllJSFiles(jsDir)));
  if (existsSafe(scriptsDir)) allFiles.push(...(await getAllJSFiles(scriptsDir)));

  log.info(`发现 ${allFiles.length} 个 JS 文件`);

  let totalIssues = 0;
  let errorCount = 0;
  let warnCount = 0;

  for (const file of allFiles) {
    const issues = await lintFile(file);
    const relative = file.replace(ROOT + '/', '');
    for (const issue of issues) {
      totalIssues++;
      if (issue.severity === 'error') errorCount++;
      else warnCount++;
      const icon = issue.severity === 'error' ? chalk.red('✗') : chalk.yellow('⚠');
      console.log(`  ${icon} ${chalk.gray(relative)}:${chalk.gray(issue.line)}  ${issue.message}`);
    }
  }

  console.log();
  if (totalIssues === 0) {
    log.success('代码检查通过，没有发现问题！');
  } else {
    console.log(chalk.yellow(`  ${warnCount} 个警告, ${errorCount} 个错误`));
    if (errorCount > 0) {
      process.exit(1);
    }
  }
}

function existsSafe(path) {
  try {
    require('node:fs').accessSync(path);
    return true;
  } catch {
    return false;
  }
}

main().catch((err) => {
  log.error(err.message);
  process.exit(1);
});
