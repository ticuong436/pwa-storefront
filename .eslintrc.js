const config = {
    parser: 'babel-eslint',
    extends: ['@magento'],
    plugins: ['import'],
    env: {
        browser: true,
        node: true,
        serviceworker: true
    },
    rules: {
        'jsx-a11y/alt-text': 'off', // TODO: fix a11y
        'jsx-a11y/anchor-is-valid': 'off', // TODO: fix a11y
        'jsx-a11y/no-noninteractive-element-interactions': 'off', // TODO: fix a11y
        'jsx-a11y/click-events-have-key-events': 'off', // TODO: fix a11y
        'jsx-a11y/no-static-element-interactions': 'off', // TODO: fix a11y
        'no-undef': 2, // 0: off, 1: warn, 2: error
        'no-useless-escape': 'off',
        'import/no-relative-parent-imports': 2
    },
    globals: {
        // Defined by webpack in webpack.config.js
        STORE_NAME: 'readonly',
        // From workbox-webpack-plugin
        workbox: 'readonly'
    }
};

module.exports = config;
