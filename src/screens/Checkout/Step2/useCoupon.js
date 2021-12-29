import { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import APPLY_COUPON_MUTATION from './applyCouponToCart.graphql';
import REMOVE_COUPON_MUTATION from './removeCouponFromCart.graphql';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { useTranslation } from 'react-i18next';

export const useCoupon = (cartId, onCouponChanged, appliedCoupons) => {
    const [applyCouponMutation, { error, loading: isApplying }] = useMutation(
        APPLY_COUPON_MUTATION
    );
    const [removeCouponMutation] = useMutation(REMOVE_COUPON_MUTATION);

    const [textBtnRedeem, setTextBtnRedeem] = useState('REDEEM');
    const [couponCode, setCouponCode] = useState('');
    const [isShowInputCoupon, setShowInputCoupon] = useState(false);

    const [, { setInfo }] = useNotificationContext();
    const { t } = useTranslation(['checkout']);

    const applyCoupon = useCallback(
        async couponCode => {
            setShowInputCoupon(false);

            await applyCouponMutation({ variables: { cartId, couponCode } });

            await onCouponChanged();

            setTextBtnRedeem('REMOVE');

            setInfo(t('checkout::Your coupon has been applied'));
        },
        [applyCouponMutation, onCouponChanged, setInfo, cartId, t]
    );

    const removeCoupon = useCallback(async () => {
        await removeCouponMutation({ variables: { cartId } });

        await onCouponChanged();

        setTextBtnRedeem('REDEEM');
        setCouponCode('');
    }, [removeCouponMutation, onCouponChanged, cartId]);

    useEffect(() => {
        if (appliedCoupons && appliedCoupons.length > 0) {
            setCouponCode(appliedCoupons[0].code);
            setTextBtnRedeem('REMOVE');
        }
    }, [appliedCoupons]);

    return {
        applyCoupon,
        removeCoupon,
        textBtnRedeem,
        couponCode,
        setCouponCode,
        error,
        isApplying,
        isShowInputCoupon,
        setShowInputCoupon
    };
};
