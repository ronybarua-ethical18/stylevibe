module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  rules: {
    // ❗ Will catch unused variables and imports via TypeScript
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-unused-vars': 'off'
  },
  ignorePatterns: ['dist/', 'build/', 'node_modules/']
};
