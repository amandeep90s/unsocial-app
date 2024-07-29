module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-typescript-prettier'],
  parserOptions: { ecmaVersion: 2018, sourceType: 'module' },
  settings: {
    react: {
      version: '999.999.999', // Invalid version to prevent detection attempts
    },
  },
};
