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
    console.log('Starting LocalXpose Tunnel...');
    
    // LocalXpose is a powerful tunneling service
    // It requires the 'loclx' binary to be installed
    const tunnel = spawn('loclx', [
      'tunnel', 'http', '--to', `localhost:${PORT}`
    ]);

    tunnel.on('error', (err) => {
      console.error('Tunnel process error:', err.message);
      if (err.code === 'ENOENT') {
        console.log("Error: 'loclx' command not found. Please install LocalXpose CLI.");
        console.log("Install using the following commands in Colab:");
        console.log("!wget https://api.localxpose.io/api/v2/downloads/loclx-linux-amd64.zip");
        console.log("!unzip loclx-linux-amd64.zip");
        console.log("!chmod +x loclx");
        console.log("!sudo mv loclx /usr/local/bin/");
      }
    });

    tunnel.stdout.on('data', (data) => {
      const output = data.toString();
      // LocalXpose output contains the public URL
      const match = output.match(/https:\/\/[a-z0-9-]+\.loclx\.io/);
      if (match) {
        console.log(`\n✅ Tunnel established! Access your relay at: ${match[0]}`);
      }
      console.log('LocalXpose:', output.trim());
    });

    tunnel.stderr.on('data', (data) => {
      const output = data.toString();
      if (output.toLowerCase().includes('error') || output.toLowerCase().includes('failed')) {
          console.error(`LocalXpose Error: ${output.trim()}`);
      }
    });

    tunnel.on('close', (code) => {
      if (code !== 0 && code !== null) {
        console.log(`Tunnel process exited with code ${code}.`);
      }
    });
  }
});
