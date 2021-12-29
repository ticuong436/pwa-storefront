import React from 'react';
import SimpleGroupConfigType from './SimpleGroupConfigType';
import LotteryVirtualType from './LotteryVirtualType';
import ConfigType from './ConfigType';

const ProductPrice = props => {
    const { product, variantId } = props;

    const productType = product.__typename;

    if (
        ['GroupedProduct', 'SimpleProduct', 'TicketProduct'].includes(
            productType
        )
    ) {
        return <SimpleGroupConfigType product={product} />;
    } else if (productType === 'ConfigurableProduct') {
        return (
            <ConfigType
                product={product}
                options={product.configurable_options}
                variantId={variantId}
            />
        );
    } else {
        return <LotteryVirtualType product={product} />;
    }
};

export default ProductPrice;
