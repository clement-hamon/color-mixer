// Main entry point for Color Mixer Pro
import './css/styles.css';

// Initialize the application
async function initializeApp() {
  try {
    console.log('🎨 Color Mixer Pro v2.0.0 initializing...');

    // Load game configuration
    const gameConfig = await import('./data/game-config.json');
    console.log('📋 Game configuration loaded');

    // Initialize color mixer game
    const { ColorMixerGame } = await import('./js/color-mixer.js');
    const game = new ColorMixerGame(gameConfig.default);

    // Start the game
    await game.initialize();
    console.log('🚀 Color Mixer Pro initialized successfully');

    // Performance monitoring
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode active');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Color Mixer Pro:', error);

    // Show user-friendly error message
    document.body.innerHTML = `
      <div class="container mt-5">
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">Oops! Something went wrong</h4>
          <p>The Color Mixer Pro failed to load properly. Please refresh the page and try again.</p>
          <hr>
          <p class="mb-0">If the problem persists, please contact support.</p>
        </div>
      </div>
    `;
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Hot module replacement for development
if (process.env.NODE_ENV === 'development' && import.meta.hot) {
  import.meta.hot.accept();
}
