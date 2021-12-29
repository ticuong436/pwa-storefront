import { useLocation } from '@skp/drivers';
import { useQuery } from '@apollo/react-hooks';
import GET_PRODUCT_BY_ID from '@skp/screens/LotteryCheckout/Step1/getProductById.graphql';
import { useGooSearchScript } from '@skp/hooks/useGooSearchScript';
import { useEffect } from 'react';

export const useConfirmation = ({ productId }) => {
    const { sendOrderInfo, isScriptAppended } = useGooSearchScript();
    const location = useLocation();
    const { called, data, loading } = useQuery(GET_PRODUCT_BY_ID, {
        fetchPolicy: 'network-only',
        variables: { productId },
        skip: !location.state
    });

    const { productByID: product } = data || {};

    const shouldShowLoadingIndicator = called && loading;

    const { applyData, applyOption, plan, selectedAddress, selectedCard } =
        location.state || {};

    useEffect(() => {
        try {
            const orderNumber = window.sessionStorage.getItem(
                'lottery_apply_number'
            );
            if (
                isScriptAppended &&
                product &&
                applyData &&
                orderNumber != applyData.apply_number
            ) {
                const amount =
                    product.price_range.minimum_price.final_price.value;
                const item = `${product.id},1,${amount}`;

                window.sessionStorage.setItem(
                    'lottery_apply_number',
                    applyData.apply_number
                );

                sendOrderInfo(item, amount);
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.log(error);
            }
        }
    }, [product, applyData, sendOrderInfo, isScriptAppended]);

    return {
        shouldShowLoadingIndicator,
        product,
        applyData,
        applyOption,
        plan,
        selectedAddress,
        selectedCard
    };
};
