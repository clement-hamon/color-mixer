import { readdir, stat } from 'fs/promises';
import { join } from 'path';

async function analyzeBundle() {
  const distDir = 'dist';
  
  try {
    const files = await readdir(distDir, { recursive: true });
    
    let totalSize = 0;
    const analysis = [];
    
    for (const file of files) {
      const filePath = join(distDir, file);
      const stats = await stat(filePath);
      
      if (stats.isFile()) {
        totalSize += stats.size;
        analysis.push({
          file,
          size: stats.size,
          sizeKB: (stats.size / 1024).toFixed(2),
          sizeMB: (stats.size / 1024 / 1024).toFixed(2)
        });
      }
    }
    
    analysis.sort((a, b) => b.size - a.size);
    
    console.log('\n📊 Bundle Analysis Report');
    console.log('========================');
    console.log(`Total bundle size: ${(totalSize / 1024).toFixed(2)} KB (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`Number of files: ${analysis.length}\n`);
    
    console.log('📁 File breakdown:');
    analysis.forEach(({ file, sizeKB, sizeMB }, index) => {
      const icon = index === 0 ? '🔥' : index < 3 ? '📄' : '📋';
      console.log(`${icon} ${file}: ${sizeKB} KB${sizeMB > 1 ? ` (${sizeMB} MB)` : ''}`);
    });
    
    // Performance recommendations
    console.log('\n💡 Performance Recommendations:');
    if (totalSize > 500 * 1024) {
      console.log('⚠️  Bundle size is large (>500KB). Consider code splitting.');
    }
    if (analysis.some(f => f.size > 100 * 1024)) {
      console.log('⚠️  Large files detected (>100KB). Consider lazy loading.');
    }
    if (totalSize < 100 * 1024) {
      console.log('✅ Bundle size is optimal (<100KB).');
    }
    
  } catch (error) {
    console.error('❌ Bundle analysis failed:', error);
    process.exit(1);
  }
}

analyzeBundle();
