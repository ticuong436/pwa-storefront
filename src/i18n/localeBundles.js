/**
 * The bundles here are configured
 * so that each locale only requires loading a single webpack chunk.
 *
 * This takes benefit of code spliting and hot reloading.
 *
 * Note: we use english as translation key, so we don't need to load english bundle
 */
const bundles = {
    // en: namespace => import(`./locales/en/${namespace}.json`),
    ja: namespace => import(`./locales/ja/${namespace}.json`)
};

export default bundles;
