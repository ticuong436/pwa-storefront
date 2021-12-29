import ReactGA from 'react-ga';
import { initGA } from './initGA';

initGA();
ReactGA.ga('require', 'ec');

function getProductVariant(product) {
    if (
        product.__typename == 'ConfigurableProduct' ||
        product.type_id === 'configurable' ||
        product.product_type === 'configurable'
    ) {
        return product.attribute_set_name;
    }

    return null;
}

export const trackViewProductDetail = (product, priceSelling) => {
    ReactGA.ga('ec:addProduct', {
        id: product.sku,
        name: product.name,
        price: priceSelling,
        brand: product.sky_info_shp_brand,
        category: product.detail_middle_category,
        variant: getProductVariant(product)
    });

    ReactGA.ga('ec:setAction', 'detail');

    ReactGA.ga('send', 'event', 'engagement', 'view_item');
};

export const trackViewProduct = (productList, productListName, productPage) => {
    productList.forEach((product, index) => {
        ReactGA.ga('ec:addImpression', {
            id: product.sku,
            name: product.name,
            list: productListName,
            variant: getProductVariant(product),
            position: index + 1,
            list_position: productPage,
            category: product.detail_middle_category,
            brand: product.sky_info_shp_brand
        });
    });

    ReactGA.ga('send', 'event', 'engagement', 'view_item_list', {
        nonInteraction: true
    });
};

export const trackClickProduct = (product, productListName, position) => {
    ReactGA.ga('ec:addProduct', {
        id: product.sku,
        name: product.name,
        category: product.detail_middle_category,
        brand: product.sky_info_shp_brand,
        variant: getProductVariant(product),
        position
    });
    ReactGA.ga('ec:setAction', 'click', {
        list: productListName
    });
    ReactGA.ga('send', 'event', 'UX', 'click', 'Product In List');
};

export const trackAddProductToCart = (product, quantity, priceSelling) => {
    ReactGA.ga('ec:addProduct', {
        id: product.sku,
        name: product.name,
        price: priceSelling,
        brand: product.sky_info_shp_brand,
        category: product.detail_middle_category,
        quantity,
        variant: getProductVariant(product)
    });

    ReactGA.ga('ec:setAction', 'add');
    ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart');
};

export const trackRemoveProductFromCart = (product, quantity, priceSelling) => {
    ReactGA.ga('ec:addProduct', {
        id: product.sku,
        name: product.name,
        price: priceSelling,
        brand: product.sky_info_shp_brand,
        category: product.detail_middle_category,
        quantity,
        variant: getProductVariant(product)
    });

    ReactGA.ga('ec:setAction', 'remove');
    ReactGA.ga('send', 'event', 'UX', 'click', 'remove from cart');
};

export const trackCheckoutProduct = (items, step) => {
    items.map(({ product, quantity, prices }) => {
        ReactGA.ga('ec:addProduct', {
            id: product.sku,
            name: product.name,
            brand: product.sky_info_shp_brand,
            category: product.detail_middle_category,
            price: prices.price.value,
            quantity,
            variant: getProductVariant(product)
        });
    });

    ReactGA.ga('ec:setAction', 'checkout', {
        step
    });

    ReactGA.ga('send', 'event', 'ecommerce', 'checkout_progress', {
        eventValue: step
    });
};

export const trackPurchase = (
    orderNumber,
    items,
    subTotal,
    grandTotal,
    shippingFee,
    couponCode
) => {
    items.map(({ product, quantity, price }) => {
        ReactGA.ga('ec:addProduct', {
            id: product.sku,
            name: product.name,
            brand: product.sky_info_shp_brand,
            category: product.detail_middle_category,
            price: price,
            quantity,
            variant: getProductVariant(product)
        });
    });
    ReactGA.ga('ec:setAction', 'purchase', {
        id: orderNumber,
        affiliation: '',
        revenue: grandTotal,
        値: subTotal,
        tax: grandTotal,
        shipping: shippingFee,
        coupon: couponCode
    });

    ReactGA.ga('send', 'event', 'ecommerce', 'purchase');
};

export const trackViewPromo = (id, name) => {
    ReactGA.ga('ec:addPromo', {
        id,
        name
    });

    ReactGA.ga('ec:setAction', 'promo_click');

    ReactGA.ga('send', 'event', 'Internal Promotions', 'click', name);
};
