const { config } = require('@dhis2/cli-style')

module.exports = {
    parser: 'babel-eslint',

    extends: [config.eslint, 'airbnb-base', 'prettier'],

    env: {
        browser: true,
    },

    rules: {
        'prefer-promise-reject-errors': 0,
        'class-methods-use-this': 0,
        'max-len': [
            1,
            120,
            4,
            {
                ignoreComments: true,
                ignoreUrls: true,
                ignorePattern: '^\\s*var\\s.+=\\s*require\\s*\\(',
            },
        ],
        complexity: [1, 5],
        'import/no-extraneous-dependencies': [
            2,
            {
                optionalDependencies: false,
                peerDependencies: false,
            },
        ],
        'import/prefer-default-export': 0,
        'no-prototype-builtins': 0,
        'no-plusplus': [
            2,
            {
                allowForLoopAfterthoughts: true,
            },
        ],
        'no-multi-spaces': [
            2,
            {
                ignoreEOLComments: true,
            },
        ],
        'no-return-assign': [2, 'except-parens'],
        'prefer-destructuring': 0,
        'no-param-reassign': 0,
        'no-shadow': 0,
        'valid-typeof': 0,
        'no-restricted-globals': 0,
    },

    overrides: [
        {
            files: ['src/**/__tests__/**/*.js', 'src/**/__mocks__/**/*.js'],
            env: {
                jest: true,
                browser: true,
            },
            rules: {
                'arrow-body-style': 0,
            },
        },
        {
            files: 'src/__fixtures__/fixtures.js',
            rules: {
                'global-require': 0,
            },
        },
    ],
}
