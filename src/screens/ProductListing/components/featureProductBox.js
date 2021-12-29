import React from 'react';
import { resourceUrl } from '@skp/drivers';
import { trackClickProduct } from '@skp/libs/tracking';
import { SPECIAL_FONT_SIZE_BY_NAME_XS } from '@skp/config';
import { useTranslation } from 'react-i18next';
import HeartWishList from '@skp/components/ProductPrice/heartWishList';
import ExternalSupportLink from '@skp/components/ExternalSupportLink';

export default function FeatureProductBox({
    product,
    productIndex = null,
    listName = null,
    timeEvent = {},
    feature = {},
    category = {},
}) {
    const { t } = useTranslation(['product']);

    const onProductClick = () => {
        trackClickProduct(product, listName, productIndex + 1);
    };

    const productLink = product.external_detail_url || {
        pathname: resourceUrl(`/product/${product.id}`),
        state: {
            timeEvent,
            feature,
            category
        }
    };

    return (
        <>
            <ExternalSupportLink
                className="result-img"
                to={productLink}
                onClick={onProductClick}
            >
                <img src={product.small_image} alt="" />
            </ExternalSupportLink>
            <div className="result-box">
                <div className="result-cate">
                    <span className="text-pillar">{product.pillar_name}</span>
                    <div className="d-flex">
                        <HeartWishList product={product} />
                    </div>
                </div>
                <ExternalSupportLink
                    className="result-box--title"
                    to={productLink}
                    onClick={onProductClick}
                >
                    <span
                        className={
                            SPECIAL_FONT_SIZE_BY_NAME_XS.includes(product.name)
                                ? 'result-box--title__special'
                                : ''
                        }
                    >
                        {product.name}
                    </span>
                </ExternalSupportLink>
                <div className="result-btn">
                    <ExternalSupportLink
                        className="result--submit"
                        to={productLink}
                        onClick={onProductClick}
                    >
                        {t('product::View details')}
                    </ExternalSupportLink>
                </div>
            </div>
        </>
    );
}
