import { gzipSync } from 'bun';
import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function compressAssets() {
  const distDir = 'dist';
  
  try {
    const files = await readdir(distDir, { recursive: true });
    
    for (const file of files) {
      if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html')) {
        const filePath = join(distDir, file);
        const content = await readFile(filePath);
        const compressed = gzipSync(content);
        
        await writeFile(`${filePath}.gz`, compressed);
        console.log(`✅ Compressed ${file} (${((compressed.length / content.length) * 100).toFixed(1)}% of original)`);
      }
    }
    
    console.log('🎉 Asset compression complete!');
  } catch (error) {
    console.error('❌ Compression failed:', error);
    process.exit(1);
  }
}

compressAssets();
