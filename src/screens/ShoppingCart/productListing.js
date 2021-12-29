import React, { Fragment } from 'react';
import Product from './product';

const ProductListing = props => {
    const { setIsCartUpdating, items, setForceRender } = props;

    if (items.length) {
        const productComponents = items.map(product => (
            <Product
                item={product}
                key={product.id}
                setIsCartUpdating={setIsCartUpdating}
                fetchProductListing={() => {
                    setForceRender(true);
                }}
            />
        ));

        return <Fragment>{productComponents}</Fragment>;
    }

    return null;
};

export default ProductListing;
