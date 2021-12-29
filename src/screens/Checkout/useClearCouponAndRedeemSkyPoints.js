import REMOVE_COUPON_MUTATION from './Step2/removeCouponFromCart.graphql';
import REDEEM_SKYPOINTS_MUTATION from './Step2/redeemSkyPointsToCart.graphql';
import { useMutation } from '@apollo/react-hooks';
import { useCallback } from 'react';
import { DEFAULT_REDEEM_METHOD } from './Step2/useSkyPoint';

export const useClearCouponAndRedeemSkyPoints = cartId => {
    const [removeCouponMutation] = useMutation(REMOVE_COUPON_MUTATION);

    const removeCoupon = useCallback(
        async cartId => {
            if (!cartId) {
                return;
            }
            await removeCouponMutation({ variables: { cartId } });
        },
        [removeCouponMutation]
    );

    const [redeemSkyPointsMutation] = useMutation(REDEEM_SKYPOINTS_MUTATION);

    const removeRedeemSkyPoint = useCallback(async () => {
        if (!cartId) {
            return;
        }
        await redeemSkyPointsMutation({
            variables: {
                cartId,
                amount: 0,
                type: DEFAULT_REDEEM_METHOD
            }
        });
    }, [cartId, redeemSkyPointsMutation]);

    return {
        removeCoupon,
        removeRedeemSkyPoint
    };
};
