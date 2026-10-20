import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(root, 'public');
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  let requested;
  try {
    requested = decodeURIComponent((req.url || '/').split('?')[0]);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Bad request');
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Method not allowed');
  }

  const relativePath = requested === '/' ? 'index.html' : requested.replace(/^\/+/, '');
  const file = path.resolve(publicDir, relativePath);
  if (file !== publicDir && !file.startsWith(publicDir + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Forbidden');
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT' && !path.extname(file)) {
        fs.readFile(path.join(publicDir, 'index.html'), (fallbackErr, fallback) => {
          if (fallbackErr) { res.writeHead(404); return res.end('Not found'); }
          res.writeHead(200, { 'Content-Type': types['.html'], 'Cache-Control': 'no-cache' }); res.end(fallback);
        });
      } else { res.writeHead(404); res.end('Not found'); }
      return;
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
});
server.listen(port, '0.0.0.0', () => console.log(`CivicAI preview listening on ${port}`));
