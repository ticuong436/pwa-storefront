import React from 'react';
import { Link, resourceUrl } from '@skp/drivers';
import HeartWishList from '@skp/components/ProductPrice/heartWishList';
import { useTranslation } from 'react-i18next';
import ProductInfoBox from '@skp/design/ProductInfoBox/productInfoBox';
import TimeCountDown from '@skp/components/TimeCountDown';
import Moment from 'moment';
import ProductBoxPriceArea from '@skp/components/ProductBoxPriceArea';
import { trackClickProduct } from '@skp/libs/tracking';
import { useCart } from '@skp/hooks/useCart';
import { SERVICE_THE_TIME } from '@skp/config';
import ExternalSupportLink from '@skp/components/ExternalSupportLink';

export default function ProductListingCard({
    product,
    displayType = 'shopping',
    productIndex = null,
    listName = null,
    timeEvent = {},
    feature = {},
    category = {},
    refetchCart = null
}) {
    const { t } = useTranslation(['product', 'apply_button']);
    const productLink = product.external_detail_url || {
        pathname: resourceUrl(`/product/${product.id}`),
        state: {
            timeEvent,
            feature,
            category
        }
    };
    const onProductClick = () => {
        trackClickProduct(product, listName, productIndex + 1);
    };

    const {
        checkProductInCart,
        handleAddSimpleProductToCart,
        checkProductOutOfStock,
        handleAddRestockRequest,
        checkProductInRestockRequest
    } = useCart();

    let actionButton = null;
    if (
        displayType == 'shopping' &&
        ((product.product_type == 'simple' && !product.sky_is_product_set) ||
            product.product_type == 'sky_ticket')
    ) {
        const isInCart = checkProductInCart(product);
        const isOutOfStock = checkProductOutOfStock(product);

        let actionLabel = t('product::ADD TO CART');
        let actionFunction = async () => {
            await handleAddSimpleProductToCart(product, 1);

            if (refetchCart) {
                refetchCart();
            }
        };
        if (isOutOfStock) {
            if (product.service_name.value == SERVICE_THE_TIME) {
                actionFunction = null;
                actionLabel = t('product::Out of stock');
            } else if (checkProductInRestockRequest(product)) {
                actionFunction = null;
                actionLabel = t('product::Existed In Restock Request');
            } else {
                actionFunction = () => handleAddRestockRequest(product.id);
                actionLabel = t('product::Add restock request');
            }
        } else if (isInCart) {
            actionLabel = t('product::Exist In Shopping Cart');
            actionFunction = null;
        }

        actionButton = (
            <Link
                className={`result--submit ${
                    isInCart
                        ? 'result--incart'
                        : !actionFunction
                        ? 'result--coming'
                        : ''
                }`}
                to="#"
                onClick={e => {
                    e.preventDefault();
                    if (actionFunction) {
                        actionFunction();
                    }
                }}
            >
                {actionLabel}
            </Link>
        );
    } else {
        actionButton = (
            <ExternalSupportLink
                className="result--submit"
                to={productLink}
                onClick={onProductClick}
            >
                {t('product::View details')}
            </ExternalSupportLink>
        );
    }

    let additionalInfo = null;

    if (displayType == 'shopping' && product.sales_time) {
        if (product.sales_time.status === 'NOT_STARTED_YET') {
            actionButton = (
                <ExternalSupportLink
                    to={productLink}
                    className="result--submit result--incart"
                    onClick={onProductClick}
                >
                    {t('product::Coming Soon')}
                </ExternalSupportLink>
            );

            const startDate = Moment(product.sales_time.start_at);
            additionalInfo = startDate.format('MM月DD日　HH時から');
        } else if (
            product.sales_time.status === 'ENDED' ||
            product.sales_time.status === 'INVALID'
        ) {
            actionButton = (
                <ExternalSupportLink
                    to={productLink}
                    className="result--submit result--coming"
                    onClick={onProductClick}
                >
                    {product.product_type === 'virtual' ||
                    product.product_type === 'sky_lottery'
                        ? t('apply_button::Out of date')
                        : t('product::Time sale is ended')}
                </ExternalSupportLink>
            );
        } else if (product.sales_time.status === 'IN_PROGRESS') {
            additionalInfo = (
                <TimeCountDown endTime={product.sales_time.end_at}>
                    {time => time}
                </TimeCountDown>
            );
        }
    }

    return (
        <ProductInfoBox
            action={<HeartWishList product={product} />}
            onProductClick={onProductClick}
            detailUrl={productLink}
            additionalInfo={additionalInfo}
            detailAction={actionButton}
            displayType={displayType}
            product={{
                id: product.id,
                name: product.name,
                is_new: product.is_new,
                pillar_name: product.pillar.name,
                service_name: product.service_name.label,
                sky_point: product.sky_point || 0,
                short_description: product.short_description,
                service_description: product.service_description,
                image: product.image
            }}
            priceArea={
                <ProductBoxPriceArea
                    product={product}
                    priceSelling={{
                        currency: 'SGD',
                        price: product.price,
                        price_selling: product.price_selling,
                        discount_percent:
                            product.price > 0
                                ? Math.round(
                                      ((product.price - product.price_selling) /
                                          product.price) *
                                          100
                                  )
                                : 0
                    }}
                />
            }
        />
    );
}
