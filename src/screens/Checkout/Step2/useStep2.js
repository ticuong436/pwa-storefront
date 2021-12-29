import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import SET_CART_BILLING_ADDRESS from './setCartBillingAddress.graphql';
import SET_PAYMENT_METHOD from '@skp/screens/Checkout/setPaymentMethod.graphql';
import SET_PAYMENT_METHOD_FREE from '@skp/screens/Checkout/setPaymentMethodFree.graphql';
import { resourceUrl, useHistory, useLocation } from '@skp/drivers';
import GET_CUSTOMER_SKY_POINT from './getCustomerSkyPoint.graphql';
import { useGiftFee } from '@skp/screens/Checkout/useGiftFee';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { useTranslation } from 'react-i18next';

export const useStep2 = ({ cartId, priceData }) => {
    const location = useLocation();

    const [cardState, setCardState] = useState({
        selectedCard: null,
        isSelectingCard: false
    });
    const [isShowModal, setShowModal] = useState(false);

    const { data: customerSkyPointResult, loading: isLoadingPoints } = useQuery(
        GET_CUSTOMER_SKY_POINT,
        {
            fetchPolicy: 'no-cache'
        }
    );
    const { giftFee } = useGiftFee({
        orderOptions: location.state ? location.state.orderOptions : null
    });

    const [setBillingAddress] = useMutation(SET_CART_BILLING_ADDRESS);
    const [setPaymentMethod] = useMutation(SET_PAYMENT_METHOD);
    const [setPaymentMethodFree] = useMutation(SET_PAYMENT_METHOD_FREE);

    const [, { setError }] = useNotificationContext();
    const { t } = useTranslation(['card']);

    const selectCard = async card => {
        if (priceData.total && priceData.total.value == 0) {
            return;
        }

        setCardState({ isSelectingCard: true });
        try {
            const cardName = card.name.trim().split(' ');
            const lastname = cardName.shift();
            const firstname = cardName.join(' ');

            const data = await setBillingAddress({
                variables: {
                    cartId,
                    firstname: firstname,
                    lastname: lastname,
                    street1: card.address_street1,
                    street2: card.address_street2,
                    city: card.city,
                    state: card.state_region_id ? null : card.state,
                    regionId: card.state_region_id || null,
                    postalCode: card.postal_code,
                    country: card.country
                }
            });

            await setPaymentMethod({
                variables: {
                    cartId,
                    paymentMethod:
                        data.data.setBillingAddressOnCart.cart
                            .available_payment_methods[0].code,
                    paymentToken: card.id
                }
            });

            setCardState({
                selectedCard: card,
                isSelectingCard: false
            });
        } catch (error) {
            console.error(error);
            setError(
                t('card::Error when selecting credit card, please try again!')
            );
        }
    };

    useEffect(() => {
        if (priceData.total && priceData.total.value == 0) {
            setPaymentMethodFree({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, priceData.total, setPaymentMethodFree]);

    const history = useHistory();
    const goToCheckoutStep3 = () => {
        history.push({
            pathname: resourceUrl('/checkout/third-step'),
            state: {
                order_option: location.state,
                card: cardState.selectedCard
            }
        });
    };

    const hideModal = () => {
        setShowModal(false);
    };

    return {
        selectCard,
        cardState,
        goToCheckoutStep3,
        skyPoints:
            customerSkyPointResult && customerSkyPointResult.currentCustomer
                ? customerSkyPointResult.currentCustomer.skyPoints.total
                : 0,
        isLoadingPoints,
        isShowModal,
        setShowModal,
        hideModal,
        giftFee,
        location,
        priceData
    };
};
