module.exports = {
  extends: 'airbnb-typescript-prettier',
  parserOptions: {
    project: './tsconfig.json',
  },
  settings: {
    react: {
      version: '999.999.999', // Invalid version to prevent detection attempts
    },
  },
};
