import React from 'react';
import { resourceUrl } from '@skp/drivers';
import HeartWishList from '@skp/components/ProductPrice/heartWishList';
import { useTranslation } from 'react-i18next';
import ProductInfoListItem from '@skp/design/ProductInfoListItem';
import TimeCountDown from '@skp/components/TimeCountDown';
import Moment from 'moment';
import { trackClickProduct } from '@skp/libs/tracking';
import ExternalSupportLink from '@skp/components/ExternalSupportLink';

export default function ProductListingListItem({
    product,
    productIndex = null,
    listName = null,
    timeEvent = {},
    feature = {},
    category = {}
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

    const actionButton = (
        <ExternalSupportLink to={productLink} onClick={onProductClick}>
            <span>{t('product::View details')}</span>
        </ExternalSupportLink>
    );

    let additionalInfo = null;

    if (product.sales_time.status === 'NOT_STARTED_YET') {
        // actionButton = (
        //     <ExternalSupportLink to={productLink} className="result--submit result--coming">
        //         <span>{t('product::Coming Soon')}</span>
        //     </ExternalSupportLink>
        // );
        const startDate = Moment(product.sales_time.start_at);
        additionalInfo = startDate.format('MM月DD日　HH時から');
    } else if (
        product.sales_time.status === 'ENDED' ||
        product.sales_time.status === 'INVALID'
    ) {
        // actionButton = (
        //     <ExternalSupportLink to={productLink} className="result--submit result--coming">
        //         <span>
        //             {product.product_type === 'virtual' ||
        //             product.product_type === 'sky_lottery'
        //                 ? t('apply_button::Out of date')
        //                 : t('product::Time sale is ended')}
        //         </span>
        //     </ExternalSupportLink>
        // );
    } else if (product.sales_time.status === 'IN_PROGRESS') {
        additionalInfo = (
            <TimeCountDown endTime={product.sales_time.end_at}>
                {time => time}
            </TimeCountDown>
        );
    }

    return (
        <ProductInfoListItem
            action={<HeartWishList product={product} />}
            onProductClick={onProductClick}
            detailUrl={productLink}
            additionalInfo={additionalInfo}
            detailAction={actionButton}
            mainDescription={product.sky_content_partner_benefit.html}
            rightDescription={product.sky_content_terms_and_conditions.html}
            product={{
                id: product.id,
                name: product.name,
                is_new: product.is_new,
                pillar_name: product.pillar.name,
                service_name: product.service_name.label,
                image: product.image
            }}
        />
    );
}
