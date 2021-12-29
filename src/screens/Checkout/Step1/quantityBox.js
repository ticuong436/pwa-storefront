import React, { useEffect } from 'react';
import { Price } from '@skp/components/Price';
import { ProductQuantity } from '@skp/components/ProductQuantity';
import REMOVE_ITEM_MUTATION from '@skp/screens/ShoppingCart/graphql/removeItemFromCart.graphql';
import UPDATE_QUANTITY_MUTATION from '@skp/screens/ShoppingCart/graphql/updateItemQuantity.graphql';
import { useProduct } from '@skp/components/ProductQuantity/useProduct';
import { useTranslation } from 'react-i18next';

const QuantityBox = props => {
    const {
        item,
        setIsCartUpdating,
        fetchProductListing,
        quantity,
        setQuantity,
        variant,
        setErrorMessage
    } = props;

    const productProps = useProduct({
        item,
        mutations: {
            removeItemMutation: REMOVE_ITEM_MUTATION,
            updateItemQuantityMutation: UPDATE_QUANTITY_MUTATION
        },
        setIsCartUpdating,
        fetchProductListing
    });

    const { t } = useTranslation(['checkout']);

    const {
        handleUpdateItemQuantity,
        product,
        errorMessage: updateItemErrorMessage
    } = productProps;

    useEffect(() => {
        if (updateItemErrorMessage) {
            setErrorMessage(updateItemErrorMessage);
        }
    }, [setErrorMessage, updateItemErrorMessage]);

    return (
        <div className="col-lg-6 col-md-12 box-cart__right">
            <div className="quantity-cart">
                <span className="quantity-cart__text">
                    {t('checkout::quantity')}
                </span>
                <ProductQuantity
                    itemId={item.id}
                    initialValue={quantity}
                    onChange={handleUpdateItemQuantity}
                    updateQuantity={setQuantity}
                />
                <div className="quantity-cart__detail">
                    <span className="quantity-cart__price">
                        <Price
                            value={product.unitPrice}
                            currencyCode={product.currency}
                        />
                    </span>
                    <span className="quantity-cart__name">
                        {t('checkout::SKY DOLLARS')}{' '}
                        {variant ? variant.sky_point : product.skyPoint}
                    </span>
                </div>
            </div>
            <span className="box-cart__price">
                <Price
                    value={product.unitPrice * quantity}
                    currencyCode={product.currency}
                />
            </span>
        </div>
    );
};

export default QuantityBox;
