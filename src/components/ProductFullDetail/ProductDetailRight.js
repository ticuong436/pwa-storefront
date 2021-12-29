import React from 'react';
import HeartWishList from '@skp/components/ProductPrice/heartWishList';
import ProductInfoDetailRight from '@skp/design/ProductInfoDetailRight';
import TimeCountDown from '@skp/components/TimeCountDown';
import ApplyButton from '@skp/components/ApplyButton';
import ProductBadges from '@skp/components/ProductBadges';

export default function ProductDetailRight({
    isHide,
    product,
    handleAddRestockRequest
}) {
    const applyButton = isHide ? null : (
        <ApplyButton
            product={product}
            handleAddRestockRequest={handleAddRestockRequest}
        />
    );

    let additionalInfo = null;

    if (product.sky_time_sales.status === 'IN_PROGRESS') {
        additionalInfo = (
            <TimeCountDown endTime={product.sky_time_sales.end_at}>
                {time => time}
            </TimeCountDown>
        );
    }

    return (
        <ProductInfoDetailRight
            action={<HeartWishList product={product} />}
            actionBadges={<ProductBadges product={product} />}
            additionalInfo={additionalInfo}
            actionApply={applyButton}
            topDescription={product.short_description}
            bottomDescription={product.sky_content_partner_benefit}
            product={{
                id: product.id,
                name: product.name,
                is_new: product.is_new,
                pillar_name: product.pillar.name,
                is_show_platinum_icon: product.is_show_platinum_icon,
                service_name: product.service_name.label.toUpperCase(),
                detail_middle_category: product.detail_middle_category
            }}
        />
    );
}
