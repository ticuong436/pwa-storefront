import { useMutation } from '@apollo/react-hooks';
import { resourceUrl, useHistory, useLocation } from '@skp/drivers';
import CHECKOUT_LOTTERY from './applyLotteryProduct.graphql';
import { useListCard } from '@skp/components/CreditCard/useListCard';

export const useStep3 = productId => {
    const [
        checkoutLottery,
        { loading: submitting, error: submitError }
    ] = useMutation(CHECKOUT_LOTTERY);
    const history = useHistory();
    const location = useLocation();

    const { cards } = useListCard(() => {});
    const {
        selectedAddress,
        selectedCard: selectedCardState,
        product,
        giftFee,
        ...selectedOptions
    } = location.state;

    const selectedCard =
        cards.find(card => card.id == selectedCardState.id) || {};

    const handleCheckoutLottery = async (
        product_id,
        selectedAddress,
        selectedCard,
        sky_options
    ) => {
        try {
            const skyOptions = Object.keys(sky_options).length
                ? JSON.stringify(sky_options)
                : null;

            const response = await checkoutLottery({
                variables: {
                    product_id,
                    shipping_address_id: selectedAddress.id,
                    payment_card_id: selectedCard.id,
                    sky_options: skyOptions
                }
            });

            history.push({
                pathname: resourceUrl(
                    `/product/${productId}/lottery-checkout/confirmation`
                ),
                state: {
                    applyData: response.data.applyLotteryProduct,
                    applyOption: location.state,
                    plan: {},
                    selectedAddress,
                    selectedCard
                }
            });
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }
        }
    };

    return {
        handleCheckoutLottery,
        submitting,
        submitError,
        giftFee,
        state: location.state,
        selectedOptions,
        selectedCard,
        selectedAddress,
        product
    };
};
