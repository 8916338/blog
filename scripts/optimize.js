/**
 * optimize.js - 资源优化（图片压缩等）
 * 用法: node scripts/optimize.js
 */

import { readFile, writeFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import minimist from 'minimist';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BUILD_DIR = join(ROOT, 'build');
const args = minimist(process.argv.slice(2));

const log = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✓'), msg),
  warn: (msg) => console.log(chalk.yellow('⚠'), msg),
  step: (msg) => console.log(chalk.cyan('\n▶'), chalk.bold(msg)),
};

async function optimizeSVGs() {
  log.step('优化 SVG 文件...');
  const { execSync } = await import('node:child_process');

  try {
    const result = execSync(
      `find ${BUILD_DIR} -name "*.svg" -type f`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }
    ).trim();

    if (!result) {
      log.info('没有找到 SVG 文件');
      return;
    }

    const files = result.split('\n');
    let totalSaved = 0;

    for (const file of files) {
      const before = (await stat(file)).size;
      let content = await readFile(file, 'utf-8');

      // 移除注释
      content = content.replace(/<!--[\s\S]*?-->/g, '');
      // 移除多余空白
      content = content.replace(/\s+/g, ' ');
      content = content.replace(/> </g, '><');
      // 移除 XML 声明（非必需）
      content = content.replace(/<\?xml[^>]*\?>/, '');

      await writeFile(file, content.trim());
      const after = (await stat(file)).size;
      totalSaved += before - after;
    }

    log.success(`SVG 优化完成，节省 ${(totalSaved / 1024).toFixed(2)}KB`);
  } catch (e) {
    log.warn('SVG 优化跳过');
  }
}

async function generateSitemap() {
  log.step('生成 sitemap.xml...');
  const posts = await getPostList();
  const siteUrl = process.env.SITE_URL || 'https://your-domain.com';

  const urls = [
    { loc: siteUrl, priority: '1.0', changefreq: 'daily' },
    { loc: `${siteUrl}/#/archive`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${siteUrl}/#/tags`, priority: '0.6', changefreq: 'weekly' },
    { loc: `${siteUrl}/#/about`, priority: '0.3', changefreq: 'monthly' },
    ...posts.map((p) => ({
      loc: `${siteUrl}/#/post/${p.id}`,
      priority: '0.7',
      changefreq: 'monthly',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
    <changefreq>${u.changefreq}</changefreq>
  </url>`
  )
  .join('\n')}
</urlset>`;

  await writeFile(join(BUILD_DIR, 'sitemap.xml'), xml);
  log.success('sitemap.xml 已生成');
}

async function generateRobotsTxt() {
  log.step('生成 robots.txt...');
  const siteUrl = process.env.SITE_URL || 'https://your-domain.com';
  const content = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
  await writeFile(join(BUILD_DIR, 'robots.txt'), content);
  log.success('robots.txt 已生成');
}

async function getPostList() {
  try {
    const path = join(ROOT, 'public/js/data.js');
    const content = await readFile(path, 'utf-8');
    // 简单提取 posts 数据
    const match = content.match(/export const posts = (\[[\s\S]*?\]);/);
    if (match) {
      // 使用 eval 不太安全，这里用一个安全的解析方式
      return JSON.parse(match[1].replace(/(\w+):/g, '"$1":').replace(/'/g, '"'));
    }
  } catch {
    // 忽略错误
  }
  return [];
}

async function main() {
  console.log(chalk.bold.cyan('  ⚡ 资源优化\n'));

  await optimizeSVGs();
  await generateSitemap();
  await generateRobotsTxt();

  log.success('\n资源优化完成！');
}

main().catch((err) => {
  log.error(err.message);
  process.exit(1);
});
