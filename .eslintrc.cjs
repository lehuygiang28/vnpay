module.exports = {
    root: true,
    env: {
        node: true,
        es2022: true,
    },
    extends: ['eslint:recommended', 'prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    globals: {
        NodeJS: true,
        BufferEncoding: 'readonly',
    },
    rules: {
        'prettier/prettier': 'error',
        // Disable base rule as it conflicts with TypeScript version
        'no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            },
        ],
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            },
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        'prefer-const': 'error',
        'no-var': 'error',
        'no-undef': 'off',
    },
    ignorePatterns: [
        'dist/',
        'lib/',
        'coverage/',
        'build/',
        'node_modules/',
        '.docusaurus/',
        'docs/build/',
    ],
};
