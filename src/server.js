import { serve } from 'bun';

const server = serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    // Handle root path
    if (url.pathname === '/') {
      const file = Bun.file('src/index.html');
      if (await file.exists()) {
        return new Response(file, {
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
          }
        });
      }
    }

    // Handle TypeScript files by compiling them on-the-fly
    if (url.pathname.endsWith('.ts')) {
      const tsFilePath = `src${url.pathname}`;
      const tsFile = Bun.file(tsFilePath);

      if (await tsFile.exists()) {
        try {
          // Compile TypeScript to JavaScript on-the-fly
          const result = await Bun.build({
            entrypoints: [tsFilePath],
            target: 'browser',
            format: 'esm',
            minify: false,
            sourcemap: 'inline'
          });

          if (result.success && result.outputs[0]) {
            const jsContent = await result.outputs[0].text();
            return new Response(jsContent, {
              headers: {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'no-cache'
              }
            });
          }
        } catch (error) {
          console.error(`Error compiling ${tsFilePath}:`, error);
          return new Response(`// Error compiling TypeScript: ${error.message}`, {
            status: 500,
            headers: {
              'Content-Type': 'application/javascript'
            }
          });
        }
      }
    }

    // Handle static assets
    const filePath = `src${url.pathname}`;
    const file = Bun.file(filePath);

    if (await file.exists()) {
      // Set appropriate content type
      const contentType = getContentType(url.pathname);
      return new Response(file, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        }
      });
    }

    // 404 for everything else
    return new Response('Not Found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
});

function getContentType(pathname) {
  const ext = pathname.split('.').pop()?.toLowerCase();

  const contentTypes = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    ts: 'application/javascript', // Serve TypeScript as JavaScript
    json: 'application/json',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    ico: 'image/x-icon'
  };

  return contentTypes[ext] || 'text/plain';
}

console.log(`🚀 Development server running at http://localhost:${server.port}`);
console.log('📁 Serving files from src/ directory');
console.log('🔄 Hot reload enabled - changes will be reflected automatically');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down development server...');
  server.stop();
  process.exit(0);
});
