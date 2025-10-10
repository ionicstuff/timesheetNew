// backend/eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';

export default [
  // <-- NEW: replace .eslintignore with this block
  {
    ignores: ['node_modules', 'dist', 'build', 'coverage', '**/migrations/**', '**/seeders/**'],
  },

  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      // optional: allow empty catch blocs but keep others strict
      // "no-empty": ["error", { "allowEmptyCatch": true }]
    },
  },
];
