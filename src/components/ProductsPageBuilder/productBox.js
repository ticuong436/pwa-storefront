import React from 'react';
import ProductSimpleBox from '@skp/design/ProductSimpleBox';
import { resourceUrl } from '@skp/drivers';

const ProductBox = ({ product }) => {
    return (
        <div className="result-item recommend-item col-xl-3 col-lg-3 col-md-3 col-xs-12">
            <ProductSimpleBox
                key={product.id}
                // action={null}
                detailUrl={resourceUrl(`/product/${product.id}`)}
                product={{
                    id: product.id,
                    name: product.name,
                    // is_new: product.is_new,
                    pillar_name: product.pillar.name,
                    service_name: product.service_name.label,
                    sky_point: product.sky_point || 0,
                    short_description: product.short_description.html,
                    image: product.small_image.url
                }}
            />
        </div>
    );
};

export default ProductBox;
