// Servidor local, só para pré-visualizar o site no seu computador.
//
// IMPORTANTE: este arquivo precisa ficar FORA da raiz do projeto e listado
// no .vercelignore. Se ele estiver na raiz, a Vercel o detecta e roda o site
// como servidor Node em vez de site estático — e aí a pasta assets/ não vai
// junto no pacote, deixando CSS, JS e imagens com erro 404.
const http = require('http');
const fs = require('fs');
const path = require('path');

// A raiz do site é a pasta acima desta (scripts/).
const ROOT = path.join(__dirname, '..');
const PORT = 4321;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

http
  .createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split('?')[0]);
    if (rel === '/') rel = '/index.html';

    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    fs.readFile(file, (err, buf) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('404');
        return;
      }
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store'
      });
      res.end(buf);
    });
  })
  .listen(PORT, () => console.log('Servidor local em http://localhost:' + PORT));
