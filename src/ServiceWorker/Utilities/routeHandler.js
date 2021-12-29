/**
 * Checks if the given URL object belongs to the home route `/`.
 *
 * See pwa-storefront/src/utils/makeUrl.js to see how url is prefixed
 *
 * @param {URL} url
 *
 * @returns {boolean}
 */
export const isHomeRoute = url => url.pathname === process.env.PUBLIC_PATH;

/**
 * Checks if the given URL object belongs to the home route `/`
 * or has a `.html` extension.
 *
 * @param {URL} url
 *
 * @returns {boolean}
 */
export const isHTMLRoute = url =>
    isHomeRoute(url) || new RegExp('.html$').test(url.pathname);
