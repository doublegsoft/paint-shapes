// src/staticServer.ts
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { readFileSync, statSync, readdirSync } from 'fs';
import { join, extname, resolve } from 'path';
// import mime from 'mime-types';

const PUBLIC_DIR = './demo'

const serveFile = (filePath: string, res: ServerResponse) => {
  try {
    const data = readFileSync(filePath);
    // const mimeType = mime.lookup(extname(filePath)) || 'application/octet-stream';
    let mimeType = 'text/html';
    if (filePath.endsWith(".js")) {
        mimeType = 'application/javascript';
    }
    res.writeHead(200, { 'Content-Type': mimeType, 'Cache-Control': 'public, max-age=3600' });
    res.end(data);
  } catch (err) {
    console.error(err);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('🚫 File not found');
  }
};

const router = (req: IncomingMessage, res: ServerResponse) => {
  const { pathname } = parse(req.url || '', true);
  if (!pathname) return;

  // Allow only GET & HEAD for static content
  if (!['GET', 'HEAD'].includes(req.method!)) {
    res.writeHead(405, { 'Allow': 'GET, HEAD' });
    return res.end();
  }

  // Resolve to file system path
  let filePath = join(PUBLIC_DIR, pathname);
  // If path is a directory, look for index.html
  try {
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      filePath = join(filePath, 'index.html');
    }
  } catch {
    // File/dir doesn't exist → 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('🚫 Not found');
  }

  serveFile(filePath, res);
};

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const server = createServer(router);

server.listen(PORT, () => {
  console.log(`🚀 Static server listening on http://localhost:${PORT}`);
});
