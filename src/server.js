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

    // Handle API routes for future expansion
    if (url.pathname.startsWith('/api/')) {
      return new Response(
        JSON.stringify({
          message: 'Color Mixer API',
          version: '2.0.0',
          endpoints: {
            '/api/colors': 'Color palette management',
            '/api/game': 'Game state management'
          }
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
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
