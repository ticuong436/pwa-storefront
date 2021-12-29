import React, { useEffect } from 'react';
import ProductDetail from './productDetail';
import { generateItemKey } from '@skp/screens/Checkout/formHelper';
import { trackCheckoutProduct } from '@skp/libs/tracking';

const ProductListing = props => {
    const {
        setIsCartUpdating,
        tmpSelectedOption,
        removeInitialValue,
        items,
        setForceRender
    } = props;

    useEffect(() => {
        if (items.length) {
            trackCheckoutProduct(items, 1);
        }
    }, [items]);

    if (items.length) {
        const productComponents = items.map(item => (
            <ProductDetail
                item={item}
                key={item.id}
                setIsCartUpdating={setIsCartUpdating}
                fetchProductListing={() => {
                    setForceRender(true);
                }}
                tmpSelectedOption={
                    tmpSelectedOption
                        ? tmpSelectedOption[generateItemKey(item.id)]
                        : {}
                }
                removeInitialValue={removeInitialValue}
                price={item.prices.price.value}
                currency={item.prices.price.currency}
            />
        ));

        return <>{productComponents}</>;
    }

    return null;
};

export default ProductListing;
