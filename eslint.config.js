import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        colorMixer: 'writable',
        scrollToMixer: 'writable',
        randomizeColors: 'writable',
        copyToClipboard: 'writable',
        bootstrap: 'readonly'
      }
    },
    rules: {
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'no-console': ['warn', { 'allow': ['warn', 'error', 'log'] }],
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'brace-style': ['error', '1tbs'],
      'comma-dangle': ['error', 'never'],
      'no-multiple-empty-lines': ['error', { 'max': 2 }],
      'space-before-function-paren': ['error', 'never'],
      'keyword-spacing': 'error',
      'space-infix-ops': 'error',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'prefer-const': 'error',
      'no-var': 'error',
      'arrow-spacing': 'error',
      'template-curly-spacing': 'error'
    }
  },
  {
    files: ['**/*.html'],
    plugins: {
      html: (await import('eslint-plugin-html')).default
    },
    processor: 'html/html',
    rules: {
      'no-undef': 'off'
    }
  }
];
