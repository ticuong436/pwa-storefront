import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { ADD_SIMPLE_MUTATION } from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.gql';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import CREATE_CART_MUTATION from '@magento/venia-ui/lib/queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '@magento/venia-ui/lib/queries/getCartDetails.graphql';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { trackAddProductToCart } from '@skp/libs/tracking';
import { useGooSearchScript } from './useGooSearchScript';
import { useTranslation } from 'react-i18next';
import CREATE_RESTOCK_REQUEST from '@skp/components/ProductFullDetail/createRestockRequest.graphql';

export const useCart = () => {
    const [{ details }, { addItemToCart }] = useCartContext();
    const { items = [] } = details;
    const [, { setInfo, setError, reset }] = useNotificationContext();
    const { sendProductAddToCart } = useGooSearchScript();
    const { t } = useTranslation(['common']);

    const [addSimpleProductToCart, { error: addSimpleError }] = useMutation(
        ADD_SIMPLE_MUTATION
    );
    const fetchCartDetails = useAwaitQuery(GET_CART_DETAILS_QUERY);
    const [fetchCartId] = useMutation(CREATE_CART_MUTATION);
    const [createRestockRequest] = useMutation(CREATE_RESTOCK_REQUEST);
    const [productInRestockRequest, setProductInRestockRequest] = useState([]);

    const checkProductInCart = useCallback(
        product => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].product.id === product.id) {
                    return true;
                }
            }

            return false;
        },
        [items]
    );

    const checkProductOutOfStock = useCallback(product => {
        return product.stock_status == 'OUT_OF_STOCK';
    }, []);

    const checkProductInRestockRequest = useCallback(
        product => {
            return (
                product.is_in_stock_request ||
                productInRestockRequest.includes(product.id)
            );
        },
        [productInRestockRequest]
    );

    const handleAddRestockRequest = async productId => {
        const { data } = await createRestockRequest({
            variables: { productId }
        });
        reset();

        if (data.isSuccess) {
            setProductInRestockRequest([...productInRestockRequest, productId]);
            setInfo(
                t('product::Add product to Restock request list successfully.')
            );
        } else {
            setError(t('common::Something went wrong!'));
        }
    };

    const handleAddSimpleProductToCart = useCallback(
        async (product, quantity) => {
            reset();
            try {
                const payload = {
                    item: product,
                    quantity
                };

                await addItemToCart({
                    ...payload,
                    addItemMutation: addSimpleProductToCart,
                    fetchCartDetails,
                    fetchCartId
                });

                const item = `${
                    product.id
                },${quantity},${product.price_selling * quantity}`;

                try {
                    sendProductAddToCart(
                        item,
                        product.price_selling * quantity
                    );
                } catch (error) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log(error);
                    }
                }

                trackAddProductToCart(
                    product,
                    quantity,
                    quantity * product.price_selling
                );
            } catch (err) {
                setError(t('common::Something went wrong!'));
            }
        },
        [
            addItemToCart,
            addSimpleProductToCart,
            fetchCartDetails,
            fetchCartId,
            reset,
            sendProductAddToCart,
            setError,
            t
        ]
    );

    // Get derivedErrorMessage if addition to cart failed
    // Reference: https://github.com/magento/pwa-studio/pull/2505/commits/ae72580b91086efddfea0ea7ef73a1ce1ed13ef0
    const derivedErrorMessage = useMemo(() => {
        const errorTarget = addSimpleError;
        if (!errorTarget) return null;
        if (errorTarget.graphQLErrors) {
            // Apollo prepends "GraphQL Error:" onto the message,
            // which we don't want to show to an end user.
            // Build up the error message manually without the prepended text.
            return errorTarget.graphQLErrors
                .map(({ message }) => message)
                .join(', ');
        }
        return errorTarget.message;
    }, [addSimpleError]);

    useEffect(() => {
        if (derivedErrorMessage) {
            setError(derivedErrorMessage);
        }
    }, [derivedErrorMessage, setError]);

    return {
        checkProductInCart,
        handleAddSimpleProductToCart,
        checkProductOutOfStock,
        handleAddRestockRequest,
        checkProductInRestockRequest
    };
};
