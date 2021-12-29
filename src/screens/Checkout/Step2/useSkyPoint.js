import { useCallback, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import GET_CUSTOMER_SKY_POINT from './getCustomerSkyPoint.graphql';
import REDEEM_SKYPOINTS_MUTATION from './redeemSkyPointsToCart.graphql';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { useTranslation } from 'react-i18next';
export const DEFAULT_REDEEM_METHOD = 1;

export const useSkyPoint = ({
    cartId,
    onSkyPointsRedeemed,
    initialRedeemedSkypoints
}) => {
    const { data: customerSkyPointResult, loading: isLoadingPoints } = useQuery(
        GET_CUSTOMER_SKY_POINT,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const [inputSkyPoint, setInputSkyPoint] = useState(
        initialRedeemedSkypoints
    );

    const [isRedeemSuccess, setRedemSuccess] = useState(false);

    const [redeemMethod, setRedeemMethod] = useState(null);

    const [
        redeemSkyPointsMutation,
        { error: errorWhenRedeem, loading: isRedeeming }
    ] = useMutation(REDEEM_SKYPOINTS_MUTATION);

    const [errorValidateInput, setErrorValidateInput] = useState('');

    useEffect(() => {
        setInputSkyPoint(initialRedeemedSkypoints);
    }, [initialRedeemedSkypoints]);

    const [, { setInfo }] = useNotificationContext();
    const { t } = useTranslation(['checkout']);

    const redeemSkyPoints = useCallback(
        async (amount, redeemMethod) => {
            setErrorValidateInput('');
            if (
                amount.length > 9 &&
                (redeemMethod == DEFAULT_REDEEM_METHOD || !redeemMethod)
            ) {
                setErrorValidateInput(
                    t('checkout::You dont have enough Sky Points!')
                );
            } else if (
                (amount === '' || !/^[0-9]*$/.test(amount)) &&
                (redeemMethod == DEFAULT_REDEEM_METHOD || !redeemMethod)
            ) {
                setErrorValidateInput(t('checkout::Please input number.'));
            } else {
                const amountRedem =
                    redeemMethod == DEFAULT_REDEEM_METHOD ? amount : 0;

                const result = await redeemSkyPointsMutation({
                    variables: {
                        cartId,
                        amount: amountRedem,
                        type: redeemMethod
                    }
                });

                await onSkyPointsRedeemed();

                setInfo(
                    t('checkout::You have applied {{number}} SKY POINTS', {
                        number: result.data.redeemedSkyPoint
                    })
                );

                setRedemSuccess(true);
            }
        },
        [redeemSkyPointsMutation, setInfo, cartId, onSkyPointsRedeemed, t]
    );

    return {
        inputSkyPoint,
        setInputSkyPoint,
        skyPoints:
            customerSkyPointResult && customerSkyPointResult.currentCustomer
                ? customerSkyPointResult.currentCustomer.skyPoints.total
                : 0,
        redeemSkyPoints,
        errorWhenRedeem,
        errorValidateInput,
        isLoadingPoints,
        isRedeeming,
        redeemMethod,
        setRedeemMethod,
        isRedeemSuccess,
        setRedemSuccess
    };
};
