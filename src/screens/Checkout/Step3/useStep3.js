import { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import PLACE_ORDER_MUTATION from './placeOrder.graphql';
import { extractItemId } from '@skp/screens/Checkout/formHelper';
import { useLocation } from '@skp/drivers';
import { useGiftFee } from '@skp/screens/Checkout/useGiftFee';

export const useStep3 = cartId => {
    const [
        placeOrderMutation,
        {
            loading: isPlacingOrder,
            data: placeOrderData = {},
            error: placeOrderError
        }
    ] = useMutation(PLACE_ORDER_MUTATION);

    const [orderPlaced, updateOrderPlaced] = useState(false);

    const location = useLocation();
    const state = location.state;
    const { order_option: orderOptionSelected } = state || {};

    const { giftFee } = useGiftFee({
        orderOptions: orderOptionSelected
            ? orderOptionSelected.orderOptions
            : null
    });

    const orderMutationVar = { cartId };
    const options = {};
    const ticketInfos = {};

    if (orderOptionSelected && orderOptionSelected.orderOptions) {
        for (const [itemKey, option] of Object.entries(
            orderOptionSelected.orderOptions
        )) {
            if (option.members || option.emails) {
                ticketInfos[extractItemId(itemKey)] = option;
            } else {
                options[extractItemId(itemKey)] = option;
            }
        }

        if (Object.keys(options).length) {
            orderMutationVar.options = JSON.stringify(options);
        }

        if (Object.keys(ticketInfos).length) {
            orderMutationVar.ticketInfos = JSON.stringify(ticketInfos);
        }
    }

    const placeOrder = async () => {
        await placeOrderMutation({
            variables: orderMutationVar
        });
        updateOrderPlaced(true);
        window.scrollTo(0, 0);
    };

    return {
        placeOrder,
        orderPlaced,
        isPlacingOrder,
        placeOrderData,
        placeOrderError,
        state,
        orderOptionSelected,
        giftFee
    };
};
