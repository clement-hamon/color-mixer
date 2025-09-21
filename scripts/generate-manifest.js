import { writeFile } from 'fs/promises';
import { join } from 'path';

const manifest = {
  name: 'Color Mixer Pro',
  short_name: 'ColorMixer',
  description: 'Professional color mixing application',
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#667eea',
  orientation: 'portrait-primary',
  categories: ['games', 'education', 'utilities'],
  lang: 'en',
  scope: '/',
  icons: [
    {
      src: '/icons/icon-72.png',
      sizes: '72x72',
      type: 'image/png'
    },
    {
      src: '/icons/icon-96.png',
      sizes: '96x96',
      type: 'image/png'
    },
    {
      src: '/icons/icon-128.png',
      sizes: '128x128',
      type: 'image/png'
    },
    {
      src: '/icons/icon-144.png',
      sizes: '144x144',
      type: 'image/png'
    },
    {
      src: '/icons/icon-152.png',
      sizes: '152x152',
      type: 'image/png'
    },
    {
      src: '/icons/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable'
    },
    {
      src: '/icons/icon-384.png',
      sizes: '384x384',
      type: 'image/png'
    },
    {
      src: '/icons/icon-512.png',
      sizes: '512x512',
      type: 'image/png'
    }
  ]
};

try {
  await writeFile(join('dist', 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('✅ PWA manifest generated successfully');
} catch (error) {
  console.error('❌ Failed to generate manifest:', error);
  process.exit(1);
}
