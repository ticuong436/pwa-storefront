import { useEffect } from 'react';
import { useLocation } from '@skp/drivers';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import CREATE_CART_MUTATION from '@magento/venia-ui/lib/queries/createCart.graphql';
import GET_CUSTOMER_ORDER from './getCustomerOrder.graphql';
import { useGooSearchScript } from '@skp/hooks/useGooSearchScript';
import { useUserContextQuery } from '@skp/layouts/context/user/context';

export const useConfirmation = () => {
    const { sendOrderInfo, isScriptAppended } = useGooSearchScript();
    const location = useLocation();
    const { orderNumber } = location.state || {};

    const [, { createCart, removeCart }] = useCartContext();

    const [fetchCartId] = useMutation(CREATE_CART_MUTATION, {
        skip: !orderNumber
    });

    useEffect(() => {
        async function cleanUpCart() {
            await removeCart();

            await createCart({
                fetchCartId
            });
        }

        if (orderNumber) {
            cleanUpCart();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { data, loading } = useQuery(GET_CUSTOMER_ORDER, {
        skip: !orderNumber,
        variables: { orderNumber },
        fetchPolicy: 'no-cache'
    });

    useEffect(() => {
        try {
            const orderNumber = window.sessionStorage.getItem('order_number');
            if (
                isScriptAppended &&
                data &&
                orderNumber != data.getCustomerOrder.order_number
            ) {
                const amount = data.getCustomerOrder.sub_total;
                let items = '';
                data.getCustomerOrder.items.forEach(element => {
                    items += `${element.product.id},${element.qty},${element
                        .product.price * element.qty}|`;
                });

                window.sessionStorage.setItem(
                    'order_number',
                    data.getCustomerOrder.order_number
                );

                sendOrderInfo(items.slice(0, -1), amount);
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.log(error);
            }
        }
    }, [data, sendOrderInfo, isScriptAppended]);

    const { userContextFetchDetails } = useUserContextQuery();
    useEffect(() => {
        if (
            data &&
            data.getCustomerOrder &&
            data.getCustomerOrder.skypoint_redeemed
        ) {
            userContextFetchDetails(true);
        }
    }, [data, userContextFetchDetails]);

    return {
        orderNumber,
        loading,
        data
    };
};
