/**
 * Custom interceptors for the project.
 *
 * This project has a section in its package.json:
 *    "pwa-studio": {
 *        "targets": {
 *            "intercept": "./intercept.js"
 *        }
 *    }
 *
 * This instructs Buildpack to invoke this file during the intercept phase,
 * as the very last intercept to run.
 *
 * A project can intercept targets from any of its dependencies. In a project
 * with many customizations, this function would tap those targets and add
 * or modify functionality from its dependencies.
 */

module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');

    builtins.envVarDefinitions.tap(defs => {
        defs.sections.push({
            name: 'SkyPremium',
            variables: [
                {
                    name: 'PUBLIC_PATH',
                    type: 'str',
                    desc:
                        'Webpack publicPath (base path for base path for all the assets of app). End with slash /',
                    default: '/'
                },
                {
                    name: 'GRAPHQL_ENDPOINT',
                    type: 'str',
                    desc:
                        'GraphQL endpoint, if domain of this endpoint different from domain of app, you may need setup CORS',
                    default: 'https://sky-premium-pwa.test/graphql'
                },
                {
                    name: 'SKY_STOREFRONT_LANGUAGE',
                    type: 'str',
                    desc: 'Language code for storefront, i.e. en, ja',
                    default: 'ja'
                },
                {
                    name: 'SKY_GA_TRACKING_ID',
                    type: 'str',
                    desc: 'Google Universal Analytics Tracking ID',
                    default: ''
                },
                {
                    name: 'SKY_GMAP_KEY',
                    type: 'str',
                    desc: 'Google Map Key',
                    default: ''
                },
                {
                    name: 'SKY_BDASH_SCRIPT_TAG_MANAGER_URL',
                    type: 'str',
                    desc: 'BDash script tag manager url',
                    default: ''
                },
                {
                    name: 'SKY_COMMUNITY_PORTAL_URL',
                    type: 'str',
                    desc: 'Community Portal url',
                    default: ''
                }
            ]
        });
    });
};
