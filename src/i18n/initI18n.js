import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

import bundles from './localeBundles';

// Load the right bundle depending on the requested locale and namespace
function loadLocaleBundle(locale, namespace) {
    return bundles[locale](namespace)
        .then(data => data.default) // ES6 default import
        .catch(err => {
            console.error(err);
        });
}

const backendOptions = {
    /**
     * loadPath: server path to json language file
     *
     * Now we use to pass language and namespace to custom XHR function.
     * Later if we want to use server file, we only need to remove `request` option
     * Note: check webpack.config.js to copy locale static file if needed
     */
    loadPath: '/static/locales/{{lng}}/{{ns}}.json',
    request: (options, url, payload, callback) => {
        /**
         * Instead of loading from a URL like i18next-http-backend is intended for,
         * we repurpose this plugin to load webpack chunks instead by overriding the default request behavior
         * it's easier to use webpack in our current CRA to dynamically import a JSON with the translations
         * than to update and serve a static folder with JSON files on the server (or CDN with cache invalidation)
         * This also takes benefit of code spliting and hot reloading when developing.
         *
         * Thanks to: https://medium.com/@danduan/translating-react-apps-using-i18next-d2f78bc87314#48b7
         */
        try {
            const [, locale, namespace] = url.match(/\/(\w{2})\/(\w+?)\.json$/);

            // This mocks the HTTP fetch plugin behavior so it works with the backend AJAX pattern in this XHR library
            // https://github.com/i18next/i18next-http-backend/blob/master/lib/request.js#L56
            loadLocaleBundle(locale, namespace).then(data => {
                callback(null, {
                    data: JSON.stringify(data),
                    status: 200 // Status code is required by XHR plugin to determine success or failure
                });
            });
        } catch (e) {
            console.error(e);
            callback(null, {
                status: 500
            });
        }
    }
};

export const initI18n = () => {
    i18n
        // Load translation using http, learn more: https://github.com/i18next/i18next-http-backend
        .use(Backend)
        // Pass the i18n instance to react-i18next.
        .use(initReactI18next)
        // Init i18next, for all options read: https://www.i18next.com/overview/configuration-options
        .init({
            backend: backendOptions,
            react: {
                /**
                 * Default to use React.Suspense mode, which is done in src/layouts/Routes/routes.js
                 * But note: there is issue with GraphQL cache-and-network fetch policy,
                 * please using network-only or no-cache instead
                 * TODO: check this later
                 */
                useSuspense: true
            },
            load: 'languageOnly', // Only load en, ja. Not en-US, ja-JP
            lng: process.env.SKY_STOREFRONT_LANGUAGE || 'ja',
            fallbackLng: false, // Since we using English string as key, we don't need fallback language
            ns: [
                'apply_button',
                'auth',
                'card',
                'checkout',
                'home',
                'invitation',
                'navigation',
                'product',
                'profile',
                'validation',
                'apply',
                'booking',
                'cart',
                'common',
                'hotel',
                'mypage',
                'page_title',
                'product_listing',
                'shipping_address',
                'order_status',
                'address'
            ], // Temporary fix ref https://github.com/facebook/react/issues/14438
            defaultNS: [], // We don't use default namespace, need to specify namespace when use useTranslation
            debug: process.env.NODE_ENV === 'development',
            keySeparator: false, // We do not use keys in form messages.welcome, we use English string as key instead
            nsSeparator: '::', // Namespace separator when using translate function, e.g. t('namespace::Some text')
            interpolation: {
                escapeValue: false // React already safes from xss
            }
        });
};
