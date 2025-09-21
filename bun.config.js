// Bun configuration file
export default {
  // Build configuration
  build: {
    target: 'browser',
    format: 'esm',
    minify: process.env.NODE_ENV === 'production',
    splitting: true,
    sourcemap: process.env.NODE_ENV !== 'production',
    outdir: 'dist',
    entrypoints: ['./src/app.ts'],
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VERSION': JSON.stringify(process.env.npm_package_version || '2.0.0'),
      'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString())
    },
    external: [],
    // Asset handling
    loader: {
      '.ts': 'ts',
      '.png': 'file',
      '.jpg': 'file',
      '.jpeg': 'file',
      '.gif': 'file',
      '.svg': 'file',
      '.ico': 'file',
      '.woff': 'file',
      '.woff2': 'file',
      '.ttf': 'file',
      '.eot': 'file'
    }
  },

  // Test configuration
  test: {
    preload: ['./src/test-setup.js'],
    coverage: {
      threshold: {
        line: 80,
        function: 80,
        branch: 70,
        statement: 80
      },
      exclude: ['node_modules/**', 'dist/**', 'scripts/**', '**/*.test.js', '**/*.spec.js']
    },
    timeout: 5000
  },

  // Development server configuration
  dev: {
    port: 3000,
    host: 'localhost',
    hot: true,
    cors: {
      origin: true,
      credentials: true
    }
  },

  // Install configuration
  install: {
    cache: {
      disable: false,
      dir: '.bun-cache'
    },
    frozen: process.env.NODE_ENV === 'production',
    production: process.env.NODE_ENV === 'production'
  }
};
