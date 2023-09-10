module.exports = {
  globals: { MyGlobal: true },
  env: { browser: true },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
      node: {
        paths: ['./'],
        extensions: ['.js', '.ts', '.json']
      },
    },
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint/eslint-plugin',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['airbnb-base', require.resolve('./rules')]
    },
    {
      files: ['*.{spec,e2e-spec}.ts', 'protractor.conf.js', 'test.ts'],
      extends: ['airbnb-base', require.resolve('./rules')],
      rules: {
        'import/no-extraneous-dependencies': ['off'],
        'max-len': ['error', { code: 166, ignoreStrings: true }]
      },
      env: {
        jasmine: true,
        node: true
      }
    },
  ]
}
