import React from 'react';
import { resourceUrl } from '@skp/drivers';
import ProductSimpleBox from '@skp/design/ProductSimpleBox';
import HeartWishList from '@skp/components/ProductPrice/heartWishList';

export default function ProductBox({ product }) {
    const productLink = product.external_detail_url || {
        pathname: resourceUrl(`/product/${product.id}`)
    };

    return (
        <ProductSimpleBox
            action={<HeartWishList product={product} />}
            detailUrl={productLink}
            product={{
                id: product.id,
                name: product.name,
                is_new: product.is_new,
                pillar_name: product.pillar.name,
                service_name: product.service_name.label,
                sky_point: product.sky_point || 0,
                short_description: product.short_description.html,
                image: product.small_image.url
            }}
        />
    );
}
