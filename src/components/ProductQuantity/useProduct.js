import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import getCartDetailsQuery from '@magento/venia-ui/lib/queries/getCartDetails.graphql';
import createCartMutation from '@magento/venia-ui/lib/queries/createCart.graphql';
import {
    trackAddProductToCart,
    trackRemoveProductFromCart
} from '@skp/libs/tracking';

export const useProduct = props => {
    const {
        item,
        mutations: { removeItemMutation, updateItemQuantityMutation },
        setIsCartUpdating,
        fetchProductListing
    } = props;
    const [isShowPopupConfirm, setShowPopupConfirm] = useState(false);
    const flatProduct = flattenProduct(item);
    const [
        removeItem,
        {
            called: removeItemCalled,
            error: removeItemError,
            loading: removeItemLoading
        }
    ] = useMutation(removeItemMutation);

    const [
        updateItemQuantity,
        {
            loading: updateItemLoading,
            error: updateError,
            called: updateItemCalled
        }
    ] = useMutation(updateItemQuantityMutation);

    useEffect(() => {
        if (updateItemCalled || removeItemCalled) {
            // If a product mutation is in flight, tell the cart.
            setIsCartUpdating(updateItemLoading || removeItemLoading);
        }

        // Reset updating state on unmount
        return () => setIsCartUpdating(false);
    }, [
        removeItemCalled,
        removeItemLoading,
        setIsCartUpdating,
        updateItemCalled,
        updateItemLoading
    ]);

    const [{ cartId }, { removeItemFromCart }] = useCartContext();
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);
    const [fetchCartId] = useMutation(createCartMutation);

    const [isFavorite, setIsFavorite] = useState(false);

    const derivedErrorMessage = useMemo(() => {
        if (!updateError && !removeItemError) return null;

        const errorTarget = updateError || removeItemError;

        if (errorTarget.graphQLErrors) {
            // Apollo prepends "GraphQL Error:" onto the message,
            // which we don't want to show to an end user.
            // Build up the error message manually without the prepended text.
            return errorTarget.graphQLErrors
                .map(({ message }) => message)
                .join(', ');
        }

        // A non-GraphQL error occurred.
        return errorTarget.message;
    }, [removeItemError, updateError]);

    const handleToggleFavorites = useCallback(() => {
        setIsFavorite(!isFavorite);
    }, [isFavorite]);

    const sendGACartHandle = useCallback(
        (action, quantity) => {
            const { product } = item;

            if (action == 'remove') {
                trackRemoveProductFromCart(
                    product,
                    quantity,
                    flatProduct.unitPrice
                );
            } else {
                trackAddProductToCart(product, quantity, flatProduct.unitPrice);
            }
        },
        [flatProduct.unitPrice, item]
    );

    const handleRemoveFromCart = useCallback(async () => {
        await removeItemFromCart({
            item,
            fetchCartDetails,
            fetchCartId,
            removeItem
        });
        fetchProductListing();

        sendGACartHandle('remove', 0);
    }, [
        removeItemFromCart,
        item,
        fetchCartDetails,
        fetchCartId,
        removeItem,
        fetchProductListing,
        sendGACartHandle
    ]);

    const handleUpdateItemQuantity = useCallback(
        async quantity => {
            if (quantity === 0) {
                await removeItemFromCart({
                    item,
                    fetchCartDetails,
                    fetchCartId,
                    removeItem
                });
            } else {
                await updateItemQuantity({
                    variables: {
                        cartId,
                        itemId: item.id,
                        quantity
                    }
                });
            }

            fetchProductListing();

            sendGACartHandle('add', quantity);
        },
        [
            fetchProductListing,
            cartId,
            sendGACartHandle,
            removeItemFromCart,
            item,
            fetchCartDetails,
            fetchCartId,
            removeItem,
            updateItemQuantity
        ]
    );

    return {
        errorMessage: derivedErrorMessage,
        handleRemoveFromCart,
        handleToggleFavorites,
        handleUpdateItemQuantity,
        isEditable: !!flatProduct.options.length,
        isFavorite,
        product: flatProduct,
        isShowPopupConfirm,
        setShowPopupConfirm
    };
};

const flattenProduct = item => {
    const {
        configurable_options: options = [],
        prices,
        product,
        quantity
    } = item;

    const { price } = prices;
    const { value: unitPrice, currency } = price;

    const {
        name,
        small_image,
        service_name,
        sky_point: skyPoint,
        saleable_status: productSaleableStatus
    } = product;
    const { url: image } = small_image;

    return {
        currency,
        image,
        name,
        options,
        quantity,
        unitPrice,
        service_name,
        skyPoint,
        productSaleableStatus
    };
};
