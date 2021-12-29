import { useEffect } from 'react';
import { useLocation } from '@skp/drivers';
import { useGooSearchScript } from '@skp/hooks/useGooSearchScript';
import { useUserContextQuery } from '@skp/layouts/context/user/context';

export const useConfirmation = () => {
    const { sendOrderInfo, isScriptAppended } = useGooSearchScript();
    const location = useLocation();

    const { selectedOptions, selectedAddress, product, orderData, giftFee } =
        location.state || {};

    useEffect(() => {
        try {
            const orderNumber = window.sessionStorage.getItem(
                'pollmall_apply_number'
            );

            if (
                isScriptAppended &&
                product &&
                orderData &&
                orderNumber != orderData.order_number
            ) {
                const amount =
                    product.price_range.minimum_price.final_price.value;
                const item = `${product.id},1,${amount}`;

                window.sessionStorage.setItem(
                    'pointmall_apply_number',
                    orderData.order_number
                );

                sendOrderInfo(item, amount);
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.log(error);
            }
        }
    }, [product, orderData, sendOrderInfo, isScriptAppended]);

    const { userContextFetchDetails } = useUserContextQuery();
    useEffect(() => {
        if (orderData) {
            userContextFetchDetails(true);
        }
    }, [orderData, userContextFetchDetails]);

    return {
        selectedOptions,
        selectedAddress,
        product,
        orderData,
        giftFee
    };
};
