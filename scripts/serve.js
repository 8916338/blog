/**
 * serve.js - 轻量级开发服务器
 * 用法: node scripts/serve.js [--port 3000] [--host 0.0.0.0]
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import minimist from 'minimist';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const args = minimist(process.argv.slice(2));
const PORT = args.port || process.env.PORT || 3000;
const HOST = args.host || 'localhost';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

async function handleRequest(req, res) {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  // SPA fallback - 所有路由返回 index.html
  if (!extname(urlPath)) {
    if (urlPath === '/') urlPath = '/index.html';
    else if (!urlPath.endsWith('/') && !urlPath.includes('.')) {
      // 可能是 SPA 路由
      urlPath = '/index.html';
    }
  }

  const filePath = join(ROOT, urlPath);

  // 安全：防止目录遍历
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const stats = await stat(filePath);

    if (stats.isDirectory()) {
      // 尝试 index.html
      const indexPath = join(filePath, 'index.html');
      try {
        await stat(indexPath);
        await sendFile(res, indexPath);
      } catch {
        res.writeHead(404);
        res.end('Not Found');
      }
      return;
    }

    await sendFile(res, filePath);
  } catch (e) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
}

async function sendFile(res, filePath) {
  const ext = extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
  const content = await readFile(filePath);

  res.writeHead(200, {
    'Content-Type': mimeType,
    'Content-Length': content.length,
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(content);

  const relativePath = filePath.replace(ROOT, '');
  console.log(chalk.gray(`  ${new Date().toLocaleTimeString()}`) + chalk.green(' ✓ ') + chalk.gray(relativePath));
}

const server = createServer(handleRequest);

server.listen(PORT, HOST, () => {
  console.log();
  console.log(chalk.bold.cyan('  🚀 微言开发服务器已启动\n'));
  console.log(chalk.gray('  本地访问:  ') + chalk.cyan(`http://${HOST}:${PORT}`));
  console.log(chalk.gray('  网络访问:  ') + chalk.cyan(`http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`));
  console.log(chalk.gray('  按 Ctrl+C 停止\n'));
});

// 优雅退出
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n  👋 服务器已停止'));
  server.close(() => process.exit(0));
});
