module.exports = {
    extends: ['airbnb', 'prettier', 'prettier/react', 'plugin:compat/recommended'],
    parser: 'babel-eslint',
    rules: {
        'no-underscore-dangle': ['error', {
            allow: []
        }],
        'no-console': ['error', {
            allow: ['warn', 'error']
        }],
        'no-plusplus': 'off',
        'no-continue': 'off',
        'no-restricted-syntax': 'off',
        'no-prototype-builtins': 'off',
        'no-param-reassign': 'off',
        'no-constant-condition': 'off',
        'no-shadow': 'off',
        'class-methods-use-this': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/prefer-default-export': 'off',
        'react/prop-types': 'off',
        'react/prefer-stateless-function': 'off',
        'react/no-multi-comp': 'off',
        'react/prefer-es6-class': 'off',
        'react/jsx-filename-extension': ['error', {
            extensions: ['.js']
        }],
        'react/require-default-props': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
    },
    globals: {}
}
