#!/usr/bin/env bun

import { $ } from 'bun';
import { copyFile, mkdir, readdir, stat } from 'fs/promises';
import { join, dirname } from 'path';

console.log('🚀 Building TypeScript Color Mixer Game...');

// Clean and create dist directory
try {
  await $`rm -rf dist`;
} catch {}
await mkdir('dist', { recursive: true });

// Build TypeScript
console.log('📦 Building TypeScript...');
await $`bun build src/app.ts --outdir dist --minify --splitting --target browser --sourcemap`;

// Copy assets
console.log('📁 Copying assets...');

// Copy CSS
await $`cp -r src/css dist/`;

// Copy data
await $`cp -r src/data dist/`;

// Copy and modify HTML
const htmlContent = await Bun.file('src/index.html').text();
const modifiedHtml = htmlContent.replace(
  '<script type="module" src="app.ts"></script>',
  '<script type="module" src="app.js"></script>'
);
await Bun.write('dist/index.html', modifiedHtml);

console.log('✅ Build complete! Files are in the dist/ directory.');
console.log('🌐 Run "bun run serve:dist" to preview the built application.');
