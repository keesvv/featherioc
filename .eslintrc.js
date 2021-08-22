module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsdoc/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier', 'jsdoc'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
  overrides: [
    {
      files: ['*.spec.ts'],
      rules: {
        'jsdoc/require-jsdoc': 'off',
      },
    },
  ],
  rules: {
    'prettier/prettier': 'error',
    'max-classes-per-file': 'off',
    'no-shadow': 'off',
    'new-cap': 'off',
    'no-use-before-define': 'off',
    'class-methods-use-this': 'off',
    'jsdoc/require-returns': 'off',
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-jsdoc': [
      'warn',
      {
        require: {
          MethodDefinition: true,
        },
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
  },
};
