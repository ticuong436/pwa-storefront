import { resourceUrl, useHistory, useLocation } from '@skp/drivers';
import ORDER_POINT_MALL from './orderPointMall.graphql';
import { useMutation } from '@apollo/react-hooks';

export const useStep2 = () => {
    const history = useHistory();
    const location = useLocation();

    const { selectedAddress, product, giftFee, ...selectedOptions } =
        location.state || {};

    const [
        orderPointMall,
        { loading: orderLoading, error: orderError }
    ] = useMutation(ORDER_POINT_MALL);

    const handleCheckoutPointMall = async (
        productId,
        selectedAddress,
        selectedOptions
    ) => {
        const skyOptions = Object.keys(selectedOptions).length
            ? JSON.stringify(selectedOptions)
            : null;

        const response = await orderPointMall({
            variables: {
                product_id: productId,
                shipping_address_id: selectedAddress.id,
                sky_options: skyOptions,
                gift_fee: giftFee ? giftFee.value : 0
            }
        });

        history.push({
            pathname: resourceUrl(
                `/product/${productId}/point-mall-checkout/confirmation`
            ),
            state: {
                selectedOptions,
                selectedAddress,
                product,
                giftFee,
                orderData:
                    response.data && response.data.orderPointMall
                        ? response.data.orderPointMall
                        : {}
            }
        });
    };

    return {
        handleCheckoutPointMall,
        selectedOptions,
        selectedAddress,
        giftFee,
        product,
        state: location.state,
        orderLoading,
        orderError
    };
};
