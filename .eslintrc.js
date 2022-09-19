module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    extends: ['plugin:@typescript-eslint/recommended'],
    plugins: ['@typescript-eslint'],
    parserOptions: {
        ecmaVersion: 2020,
        parser: '@typescript-eslint/parser'
    },
    rules: {
        'no-console': 'off',
        'no-debugger': 'warn',
        quotes: ['warn', 'single'],
        'no-use-before-define': 'off',
        'no-undef': 'off',
        'no-shadow': 'error',
        'no-labels': 'off',
        'linebreak-style': ['error', 'windows'],
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
        'dot-notation': 'off',
        'no-lonely-if': 'off',
        'import/no-cycle': 'off',

        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/ban-types': [
            'error',
            {
                types: {
                    Function: false
                }
            }
        ]
    }
};
