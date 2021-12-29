import React from 'react';
import { useTranslation } from 'react-i18next';
import { PRODUCT_SHIPPING_METHOD } from '@skp/config';
import badge1 from './productBadge1.png';
import badge2 from './productBadge2.png';
import badge3 from './productBadge3.png';

const getShippingMethodText = (shippingMethod, t) => {
    return PRODUCT_SHIPPING_METHOD[shippingMethod]
        ? t(PRODUCT_SHIPPING_METHOD[shippingMethod])
        : '';
};

const ProductBadges = props => {
    const { t } = useTranslation(['product']);
    const { product } = props;
    const { product_badges: badges } = product;

    // line1 : 数量限定、SKYおすすめ、ベストセラー
    // line2 : 送料無料・送料込み、〇〇配送、配送日指定可、配送時間帯指定可
    // line3 : ギフトサービス有

    const line1 = [];
    badges.sky_item_limited_stock && line1.push(t('product::Limited Item'));
    badges.recommendation && line1.push(t('product::recommendation'));
    badges.best_seller && line1.push(t('product::best_seller'));

    const line2 = [];
    badges.free_shipping && line2.push(t('product::free_shipping'));
    badges.shipping_method &&
        line2.push(getShippingMethodText(badges.shipping_method, t));
    badges.request_shipping_date &&
        line2.push(t('product::request_shipping_date'));
    badges.request_shipping_time &&
        line2.push(t('product::request_shipping_time'));

    const line3 = [];
    badges.gift_service && line3.push(t('product::gift_service'));

    return (
        <>
            <ul className="product-badges">
                {line1.length > 0 && (
                    <li className="product-badges__item">
                        <img src={badge1} className="product-badges__icon" />
                        <span>{line1.join('・')}</span>
                    </li>
                )}
                {line2.length > 0 && (
                    <li className="product-badges__item">
                        <img src={badge2} className="product-badges__icon" />
                        <span>{line2.join('・')}</span>
                    </li>
                )}
                {line3.length > 0 && (
                    <li className="product-badges__item">
                        <img src={badge3} className="product-badges__icon" />
                        <span>{line3.join('・')}</span>
                    </li>
                )}
            </ul>
        </>
    );
};

export default ProductBadges;
