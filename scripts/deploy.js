import { $ } from 'bun';

async function deploy() {
  console.log('🚀 Starting deployment process...');
  
  try {
    // Check if we're in a git repository
    await $`git status`;
    
    // Ensure dist directory exists and has content
    const distExists = await Bun.file('dist/index.html').exists();
    if (!distExists) {
      throw new Error('dist/index.html not found. Run "bun run build" first.');
    }
    
    console.log('📦 Adding build files to git...');
    await $`git add dist/`;
    
    const timestamp = new Date().toISOString();
    console.log('💾 Committing build...');
    await $`git commit -m "Deploy: ${timestamp}" --allow-empty`;
    
    console.log('🌐 Deploying to GitHub Pages...');
    // Using subtree to deploy dist folder to gh-pages branch
    await $`git subtree push --prefix dist origin gh-pages`;
    
    console.log('✅ Deployment successful!');
    console.log('🔗 Your app should be available at: https://clement-hamon.github.io/color-mixer/');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('git status')) {
      console.error('💡 Make sure you are in a git repository');
    } else if (error.message.includes('gh-pages')) {
      console.error('💡 Make sure the gh-pages branch exists and you have push permissions');
      console.error('💡 To create gh-pages branch: git checkout -b gh-pages && git push -u origin gh-pages');
    }
    
    process.exit(1);
  }
}

deploy();
