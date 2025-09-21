// Preload script for Bun runtime
// This file is loaded before the main application

// Set up global error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Environment setup
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Development environment detected');
}

// Performance monitoring
if (typeof performance !== 'undefined') {
  const startTime = performance.now();

  process.nextTick(() => {
    const loadTime = performance.now() - startTime;
    console.log(`⚡ Preload completed in ${loadTime.toFixed(2)}ms`);
  });
}

export {};
