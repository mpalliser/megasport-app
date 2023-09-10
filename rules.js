

module.exports = {
  rules: {
    'class-methods-use-this': 'off',
    // IMPORT
    'import/default': 'error',
    'import/namespace': 'error',
    'import/imports-first': 'error',
    'arrow-parens': ['error', 'as-needed'],
    'no-empty-function': ['error', { allow: ['constructors'] }],
    'semi': ['error', 'never'],
    'max-len': ['error', { code: 150 }],
    'no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: true }],
    'no-useless-constructor': 'off',
    // IMPORT
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        'js': 'never',
        'jsx': 'never',
        'ts': 'never',
        'tsx': 'never'
      }
   ],
    // TYPESCRIPT
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'property',
        modifiers: [
          'readonly'
        ],
        format: [
          'camelCase',
          'UPPER_CASE'
        ]
      }
    ],
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: [
          'public-field',
          'private-field',
          'constructor',
          'public-method',
          'private-method'
        ]
      }
    ],
    '@typescript-eslint/no-array-constructor': 'error',
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: true }],
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/semi': ['error', 'never'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'curly': [2, 'all'],
    'brace-style': [2, '1tbs', { 'allowSingleLine': false }],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'warn'
  }
};