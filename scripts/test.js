/**
 * test.js - 项目测试脚本
 * 用法: node scripts/test.js [--watch] [--coverage]
 */

import { readFile } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
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

// ===== 简易测试框架 =====
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
  }

  describe(name, fn) {
    console.log(chalk.bold(`\n  ${name}`));
    fn();
  }

  it(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    for (const { name, fn } of this.tests) {
      try {
        await fn();
        console.log(chalk.green('    ✓') + chalk.gray(` ${name}`));
        this.passed++;
      } catch (e) {
        console.log(chalk.red('    ✗') + chalk.gray(` ${name}`));
        console.log(chalk.red(`      ${e.message}`));
        this.failed++;
      }
    }
  }

  expect(actual) {
    return {
      toBe: (expected) => {
        if (actual !== expected) {
          throw new Error(`期望 ${JSON.stringify(expected)}，实际得到 ${JSON.stringify(actual)}`);
        }
      },
      toEqual: (expected) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`期望 ${JSON.stringify(expected)}，实际得到 ${JSON.stringify(actual)}`);
        }
      },
      toBeTruthy: () => {
        if (!actual) throw new Error(`期望为真值，实际得到 ${actual}`);
      },
      toBeFalsy: () => {
        if (actual) throw new Error(`期望为假值，实际得到 ${actual}`);
      },
      toContain: (expected) => {
        if (!String(actual).includes(String(expected))) {
          throw new Error(`期望包含 "${expected}"，实际为 "${actual}"`);
        }
      },
      toHaveLength: (expected) => {
        if (actual.length !== expected) {
          throw new Error(`期望长度为 ${expected}，实际为 ${actual.length}`);
        }
      },
      toBeGreaterThan: (expected) => {
        if (!(actual > expected)) {
          throw new Error(`期望大于 ${expected}，实际为 ${actual}`);
        }
      },
      toMatch: (regex) => {
        if (!regex.test(String(actual))) {
          throw new Error(`期望匹配 ${regex}，实际为 "${actual}"`);
        }
      },
    };
  }

  assertTrue(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
  }
}

// ===== 测试用例 =====
const runner = new TestRunner();

// 文件结构测试
runner.describe('项目文件结构', () => {
  runner.it('index.html 存在', async () => {
    const path = join(ROOT, 'index.html');
    const { access } = await import('node:fs/promises');
    await access(path);
  });

  runner.it('package.json 存在', async () => {
    const path = join(ROOT, 'package.json');
    const { access } = await import('node:fs/promises');
    await access(path);
  });

  runner.it('manifest.json 存在', async () => {
    const path = join(ROOT, 'public/manifest.json');
    const { access } = await import('node:fs/promises');
    await access(path);
  });

  runner.it('Service Worker 存在', async () => {
    const path = join(ROOT, 'public/sw.js');
    const { access } = await import('node:fs/promises');
    await access(path);
  });
});

// CSS 测试
runner.describe('样式文件', () => {
  runner.it('main.css 存在且非空', async () => {
    const path = join(ROOT, 'public/css/main.css');
    const content = await readFile(path, 'utf-8');
    runner.expect(content.length).toBeGreaterThan(100);
  });

  runner.it('包含 CSS 变量定义', async () => {
    const path = join(ROOT, 'public/css/main.css');
    const content = await readFile(path, 'utf-8');
    runner.expect(content).toContain('--color-');
  });

  runner.it('包含响应式媒体查询', async () => {
    const path = join(ROOT, 'public/css/main.css');
    const content = await readFile(path, 'utf-8');
    runner.expect(content).toContain('@media');
  });
});

// JavaScript 模块测试
runner.describe('JavaScript 模块', () => {
  const jsFiles = ['utils.js', 'data.js', 'markdown.js', 'router.js', 'components.js', 'app.js'];

  jsFiles.forEach((file) => {
    runner.it(`${file} 存在且非空`, async () => {
      const path = join(ROOT, `public/js/${file}`);
      const content = await readFile(path, 'utf-8');
      runner.expect(content.length).toBeGreaterThan(50);
    });
  });

  runner.it('utils.js 包含必要工具函数', async () => {
    const path = join(ROOT, 'public/js/utils.js');
    const content = await readFile(path, 'utf-8');
    runner.expect(content).toContain('export');
  });

  runner.it('data.js 包含文章数据', async () => {
    const path = join(ROOT, 'public/js/data.js');
    const content = await readFile(path, 'utf-8');
    runner.expect(content).toContain('posts');
  });

  runner.it('markdown.js 包含渲染函数', async () => {
    const path = join(ROOT, 'public/js/markdown.js');
    const content = await readFile(path, 'utf-8');
    runner.expect(content).toContain('render');
  });
});

// HTML 结构测试
runner.describe('HTML 结构', () => {
  runner.it('index.html 包含正确 DOCTYPE', async () => {
    const path = join(ROOT, 'index.html');
    const content = await readFile(path, 'utf-8');
    runner.expect(content).toMatch(/<!DOCTYPE html>/i);
  });

  runner.it('index.html 包含 viewport meta', async () => {
    const path = join(ROOT, 'index.html');
    const content = await readFile(path, 'utf-8');
    runner.expect(content).toContain('viewport');
  });

  runner.it('index.html 引入 CSS', async () => {
    const path = join(ROOT, 'index.html');
    const content = await readFile(path, 'utf-8');
    runner.expect(content).toContain('.css');
  });

  runner.it('index.html 引入 JS 模块', async () => {
    const path = join(ROOT, 'index.html');
    const content = await readFile(path, 'utf-8');
    runner.expect(content).toContain('app.js');
  });
});

// PWA 测试
runner.describe('PWA 配置', () => {
  runner.it('manifest.json 包含必要字段', async () => {
    const path = join(ROOT, 'public/manifest.json');
    const content = await readFile(path, 'utf-8');
    const manifest = JSON.parse(content);
    runner.expect(manifest.name).toBeTruthy();
    runner.expect(manifest.short_name).toBeTruthy();
    runner.expect(manifest.start_url).toBeTruthy();
    runner.expect(manifest.display).toBeTruthy();
  });

  runner.it('manifest.json 包含图标配置', async () => {
    const path = join(ROOT, 'public/manifest.json');
    const content = await readFile(path, 'utf-8');
    const manifest = JSON.parse(content);
    runner.expect(manifest.icons).toBeTruthy();
    runner.expect(manifest.icons.length).toBeGreaterThan(0);
  });
});

// ===== 运行测试 =====
async function main() {
  console.log(chalk.bold.gradient('cyan', 'magenta')('  ╔══════════════════════════════════════╗'));
  console.log(chalk.bold.gradient('cyan', 'magenta')('  ║       微言 - 项目测试套件          ║'));
  console.log(chalk.bold.gradient('cyan', 'magenta')('  ╚══════════════════════════════════════╝'));

  await runner.run();

  console.log(chalk.bold('\n  ───────────────────────────────'));
  console.log(chalk.green(`  ✓ 通过: ${runner.passed}`), chalk.red(`✗ 失败: ${runner.failed}`), chalk.yellow(`⊘ 跳过: ${runner.skipped}`));
  console.log(chalk.bold('  ───────────────────────────────\n'));

  if (runner.failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  log.error(err.message);
  process.exit(1);
});
