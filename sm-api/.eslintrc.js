module.exports = {
  // Игнорируемые паттерны на верхнем уровне
  ignorePatterns: ['**/dist'],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier', 'import', 'jsdoc', 'prefer-arrow'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        'prettier/prettier': 'error',
        'import/order': [
          'error',
          {
            groups: ['builtin', 'external', 'internal'],
            pathGroups: [
              {
                pattern: 'react',
                group: 'external',
                position: 'before',
              },
            ],
            pathGroupsExcludedImportTypes: ['react'],
            alphabetize: { order: 'asc', caseInsensitive: true },
            'newlines-between': 'always',
            warnOnUnassignedImports: true,
          },
        ],
        'import/named': 'off',
        'import/namespace': 'off',
        'import/default': 'off',
        'import/export': 'off',
        'jsdoc/check-alignment': 'warn',
        'jsdoc/check-param-names': 'warn',
        'jsdoc/check-tag-names': 'warn',
        'jsdoc/check-types': 'warn',
        'prefer-arrow/prefer-arrow-functions': 'off',
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
};
