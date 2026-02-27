// proxy.js — run with: node proxy.js
// Serves the HTML file AND proxies Kalshi API requests to avoid CORS

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const HTML_FILE = path.join(__dirname, 'index.html');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Proxy: /kalshi/* → https://api.elections.kalshi.com/trade-api/v2/*
  if (parsedUrl.pathname.startsWith('/kalshi/')) {
    const kalshiPath = parsedUrl.pathname.replace('/kalshi/', '/trade-api/v2/');
    const queryString = parsedUrl.search || '';
    const targetUrl = `https://api.elections.kalshi.com${kalshiPath}${queryString}`;

    console.log(`[proxy] ${targetUrl}`);

    const proxyReq = https.get(targetUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    }, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (e) => {
      console.error('Proxy error:', e.message);
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    });

    return;
  }

  // Serve the HTML file at /
  if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html') {
    fs.readFile(HTML_FILE, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('HTML file not found — make sure nba-winprob-kalshi.html is in the same folder as proxy.js');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`\n✓ Proxy running at http://localhost:${PORT}`);
  console.log(`  Open that URL in your browser\n`);
});
