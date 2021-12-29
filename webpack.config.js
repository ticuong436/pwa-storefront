const {
    configureWebpack,
    graphQL: { getMediaURL, getUnionAndInterfaceTypes },
    loadEnvironment
} = require('@magento/pwa-buildpack');
const { DefinePlugin } = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = async env => {
    const mediaUrl = await getMediaURL();

    global.MAGENTO_MEDIA_BACKEND_URL = mediaUrl;

    const unionAndInterfaceTypes = await getUnionAndInterfaceTypes();

    const webpackContext = __dirname;
    const projectConfig = loadEnvironment(webpackContext);
    if (projectConfig.error) {
        throw projectConfig.error;
    }

    const config = await configureWebpack({
        context: webpackContext,
        vendor: [
            '@apollo/react-hooks',
            'apollo-cache-inmemory',
            'apollo-cache-persist',
            'apollo-client',
            'apollo-link-context',
            'apollo-link-http',
            'informed',
            'react',
            'react-dom',
            'react-feather',
            'react-redux',
            'react-router-dom',
            'redux',
            'redux-actions',
            'redux-thunk'
        ],
        special: {
            'react-feather': {
                esModules: true
            },
            '@magento/peregrine': {
                esModules: true,
                cssModules: true
            },
            '@magento/venia-ui': {
                cssModules: true,
                esModules: true,
                graphqlQueries: true,
                // Provider RootComponents to our app automatically at src/RootComponents
                // Ref: https://magento.github.io/pwa-studio/pwa-buildpack/reference/configure-webpack/
                rootComponents: true,
                upward: true
            }
        },
        env
    });

    /**
     * configureWebpack() returns a regular Webpack configuration object.
     * You can customize the build by mutating the object here, as in
     * this example. Since it's a regular Webpack configuration, the object
     * supports the `module.noParse` option in Webpack, documented here:
     * https://webpack.js.org/configuration/module/#modulenoparse
     */
    config.module.noParse = [/braintree\-web\-drop\-in/];

    // Config public path, default is /, but we can deploy to /some/subfolder/path
    config.output.publicPath = projectConfig.env.PUBLIC_PATH;

    config.plugins = [
        ...config.plugins,
        new DefinePlugin({
            /**
             * Make sure to add the same constants to
             * the globals object in jest.config.js.
             */
            UNION_AND_INTERFACE_TYPES: JSON.stringify(unionAndInterfaceTypes),
            STORE_NAME: JSON.stringify('SKY PREMIUM')
        }),
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './template.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),
        // Copy to dist/
        new CopyPlugin([
            { from: './static/icons/apple-touch-icon.png' },
            { from: './static/favicon.ico' },
            { from: './static/browserconfig.xml' },
            { from: './static/robots.txt' }
            // { from: './static/locales' } // Copy when use server localse json file, see: src/i18n/initI18n.js
        ])
    ];

    const originalCssRule = config.module.rules.find(
        rule => rule.test && rule.test.toString().indexOf('css') > -1
    );
    if (
        originalCssRule &&
        originalCssRule.oneOf &&
        originalCssRule.oneOf.length
    ) {
        originalCssRule.oneOf[0].exclude = /index\.css$/;
    }
    config.module.rules.push(
        {
            // Don't apply css module for index.css
            test: /index\.css$/,
            include: [path.resolve(__dirname, 'src')],
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: false
                    }
                }
            ]
        },
        {
            // CSS loader for design css files
            test: /\.css$/,
            include: [path.resolve(__dirname, 'design/dest/css')],
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: false,
                        url: false
                    }
                },
                {
                    loader: 'string-replace-loader',
                    options: {
                        // replace url('../ to url('design/dest/
                        search: 'url\\(([\'"])..',
                        // replace: 'url(\\1/design/dest',
                        replace: (match, g1) =>
                            `url(${g1}${config.output.publicPath}/pwa-storefront/design/dest`,
                        flags: 'g'
                    }
                }
            ]
        }
    );
    // Alias for importing file in folder design/
    config.resolve.alias.design = path.resolve(__dirname, 'design/');
    config.resolve.alias['@skp'] = path.resolve(__dirname, 'src/');

    if (config.devServer) {
        // Using for custom domain of reverse proxy: https://sky-premium-pwa.test
        config.devServer.sockPort = 443;
    }

    return config;
};
