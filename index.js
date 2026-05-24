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
    console.log('Starting Bore tunnel (Oracle Cloud Optimized)...');
    
    // Bore is a modern TCP tunnel often hosted on high-performance clouds like Oracle
    // Using the public bore.pub server
    let bore;
    try {
      bore = spawn('bore', [
        'local', PORT,
        '--to', 'bore.pub'
      ]);
    } catch (err) {
      console.error('Failed to start Bore tunnel:', err.message);
      console.log("Make sure 'bore' is installed. You can install it using:");
      console.log("!curl -Ls https://github.com/ekzhang/bore/releases/latest/download/bore-v0.6.0-x86_64-unknown-linux-musl.tar.gz | tar -xz -C /usr/local/bin");
      return;
    }

    bore.on('error', (err) => {
      console.error('Bore process error:', err.message);
      if (err.code === 'ENOENT') {
        console.log("Error: 'bore' command not found in PATH.");
      }
    });

    bore.stdout.on('data', (data) => {
      const output = data.toString();
      // Bore output format: "listening at bore.pub:<PORT>"
      const match = output.match(/bore\.pub:[0-9]+/);
      if (match) {
        console.log(`\n✅ Tunnel established! Access your relay at: http://${match[0]}`);
      }
      console.log('Bore:', output.trim());
    });

    bore.stderr.on('data', (data) => {
      const errOutput = data.toString();
      if (errOutput.toLowerCase().includes('error')) {
          console.error(`Bore Error: ${errOutput.trim()}`);
      }
    });

    bore.on('close', (code) => {
      if (code !== 0 && code !== null) {
        console.log(`Bore process exited with code ${code}. Make sure 'bore' is installed.`);
        console.log("You can install it in Colab using: !curl -Ls https://github.com/ekzhang/bore/releases/latest/download/bore-linux-amd64.tar.gz | tar -xz -C /usr/local/bin");
      }
    });
  }
});
