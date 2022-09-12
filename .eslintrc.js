module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['eslint:recommended'],
    parserOptions: {
        ecmaVersion: 2020,
        parser: '@typescript-eslint/parser'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        quotes: ['error', 'single'],
        'no-use-before-define': 'off',
        'no-undef': 'off',
        'no-shadow': 'off',
        'no-labels': 'off',
        'linebreak-style': 'off',
        'import/prefer-default-export': 'off',
        'class-methods-use-this': 'off',
        'no-restricted-syntax': 'off',
        'max-classes-per-file': 'off',
        'no-continue': 'off',
        'no-param-reassign': ['error', { props: false }],
        'guard-for-in': 'off',
        'no-underscore-dangle': 'off',
        'no-useless-constructor': 'off',
        'no-plusplus': 'off',
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'dot-notation': 'off',
        'no-lonely-if': 'off',
        'import/no-cycle': 'off',
        'import/order': 'off'
    },
    overrides: [
        {
            files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
            env: {
                jest: true
            }
        }
    ]
};
