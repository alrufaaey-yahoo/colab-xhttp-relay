const http = require('http');
const https = require('https');
const url = require('url');
const { spawn } = require('child_process');

const TARGET_DOMAIN = process.env.TARGET_DOMAIN || 'https://thumbayan.com:443';

const STRIP_HEADERS = new Set([
  'host',
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'forwarded',
  'x-forwarded-host',
  'x-forwarded-proto',
  'x-forwarded-port',
]);

const server = http.createServer(async (req, res) => {
  if (!TARGET_DOMAIN) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Misconfigured: TARGET_DOMAIN is not set');
    return;
  }

  try {
    const parsedUrl = url.parse(req.url);
    const targetUrl = TARGET_DOMAIN + parsedUrl.path;

    const options = url.parse(targetUrl);
    options.method = req.method;
    options.headers = {};

    let clientIp = null;
    for (const [k, v] of Object.entries(req.headers)) {
      const lowerK = k.toLowerCase();
      if (STRIP_HEADERS.has(lowerK)) continue;
      if (lowerK.startsWith('x-vercel-')) continue;
      if (lowerK === 'x-real-ip') {
        clientIp = v;
        continue;
      }
      if (lowerK === 'x-forwarded-for') {
        if (!clientIp) clientIp = v;
        continue;
      }
      options.headers[k] = v;
    }
    if (clientIp) options.headers['x-forwarded-for'] = clientIp;

    const proxyReq = (options.protocol === 'https:' ? https : http).request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end('Bad Gateway: Proxy Request Failed');
    });

    req.pipe(proxyReq, { end: true });

  } catch (err) {
    console.error('Relay error:', err);
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Bad Gateway: Tunnel Failed');
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting Cloudflare Tunnel (Alternative to localhost.run)...');
    
    // Using Cloudflare Quick Tunnels (no account needed)
    // In Colab, the user should have cloudflared installed.
    // We try to use 'cloudflared' directly.
    const cf = spawn('cloudflared', [
      'tunnel',
      '--url', `http://localhost:${PORT}`,
      '--no-autoupdate'
    ]);

    cf.stderr.on('data', (data) => {
      const output = data.toString();
      // Cloudflare outputs the tunnel URL to stderr
      const match = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
      if (match) {
        console.log(`\n✅ Tunnel established! Access your relay at: ${match[0]}`);
      }
      
      if (output.includes('error') && !output.includes('failed to log to cloudflare')) {
          console.error(`Cloudflare Error: ${output.trim()}`);
      }
    });

    cf.on('close', (code) => {
      if (code !== 0 && code !== null) {
        console.log(`Cloudflare tunnel process exited with code ${code}. Make sure 'cloudflared' is installed.`);
        console.log("You can install it in Colab using: !curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared && chmod +x /usr/local/bin/cloudflared");
      }
    });
  }
});
