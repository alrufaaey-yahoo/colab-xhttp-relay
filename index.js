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
    console.log('Starting Pinggy tunnel (Alternative to localhost.run)...');
    
    // Pinggy uses SSH for zero-install tunnels
    // The -T flag is often needed for non-interactive shells
    const ssh = spawn('ssh', [
      '-p', '443',
      '-R', `80:localhost:${PORT}`,
      '-o', 'StrictHostKeyChecking=no',
      '-o', 'UserKnownHostsFile=/dev/null',
      '-o', 'ServerAliveInterval=30',
      'a.pinggy.io'
    ]);

    ssh.stdout.on('data', (data) => {
      const output = data.toString();
      // Pinggy output contains the URL
      const match = output.match(/https:\/\/[a-z0-9-]+\.free\.pinggy\.link/);
      if (match) {
        console.log(`\n✅ Tunnel established! Access your relay at: ${match[0]}`);
      }
      // Log other output if needed for debugging
      if (output.includes('http')) {
         console.log('Pinggy Output:', output.trim());
      }
    });

    ssh.stderr.on('data', (data) => {
      // SSH stderr often contains connection info, not necessarily errors
      const errOutput = data.toString();
      if (errOutput.toLowerCase().includes('error') || errOutput.toLowerCase().includes('failed')) {
          console.error(`SSH Tunnel Error: ${errOutput.trim()}`);
      }
    });

    ssh.on('close', (code) => {
      console.log(`SSH tunnel process exited with code ${code}`);
    });
  }
});
