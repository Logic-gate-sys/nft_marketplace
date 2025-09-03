module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  env: {
    node: true,
    es2021: true
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off'
  }
};
