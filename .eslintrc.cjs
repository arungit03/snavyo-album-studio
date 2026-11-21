module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    // The repository predates the configured TypeScript plugin and contains legacy unused imports.
    'no-unused-vars': 'off',
    'no-console': 'off',
    'quotes': 'off',
    'react/no-unescaped-entities': 'off',
    // Disabled because we have PropTypes off
    'react/prop-types': 'off',
    // Basic formatting
    'semi': ['error', 'always'],
    // React-specific
    'react/react-in-jsx-scope': 'off',
  },
  settings: { react: { version: 'detect' } },
};
