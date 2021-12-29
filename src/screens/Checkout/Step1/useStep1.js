import { useEffect, useState, useReducer, useRef } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { resourceUrl, useHistory, useLocation } from '@skp/drivers';
import { extractItemId } from '@skp/screens/Checkout/formHelper';
import CHECK_AVAILABLE_TICKET_INFO from './checkAvailableOrderTicketInfo.graphql';
import { useClearCouponAndRedeemSkyPoints } from '@skp/screens/Checkout/useClearCouponAndRedeemSkyPoints';
import { useUpdateCartIcon } from '@skp/hooks/useUpdateCartIcon';

/**
 * Flattens query data into a simple object. We create this here rather than
 * having each line summary line component destructure its own data because
 * only the parent "price summary" component knows the data structure.
 *
 * @param {Object} data query data
 */
const flattenData = data => {
    if (!data) return {};
    return {
        subtotal: data.cart.prices.subtotal_excluding_tax,
        total: data.cart.prices.grand_total,
        discounts: data.cart.prices.discounts,
        shipping: data.cart.shipping_addresses,
        additional_shipping_fee: data.cart.additional_shipping_fee
    };
};

export const useStep1 = props => {
    const {
        queries: { getCartDetails }
    } = props;

    const [{ cartId, isEmpty }] = useCartContext();

    const [isCartUpdating, setIsCartUpdating] = useState(false);
    const [forceRender, setForceRender] = useState(false);
    const { updateCartIcon } = useUpdateCartIcon(cartId);

    const { called, error, data, loading, refetch } = useQuery(getCartDetails, {
        fetchPolicy: 'no-cache',
        // Don't make this call if we don't have a cartId
        skip: !cartId,
        variables: { cartId }
    });

    const clearCouponAndRedeemSkyPoints = useClearCouponAndRedeemSkyPoints(
        cartId
    );
    const {
        removeCoupon,
        removeRedeemSkyPoint
    } = clearCouponAndRedeemSkyPoints;

    useEffect(() => {
        // Let the cart page know it is updating while we're waiting on network data.
        setIsCartUpdating(loading);
        if (forceRender) {
            setForceRender(false);
            refetch();
        }
    }, [cartId, loading, setForceRender, refetch, forceRender]);

    useEffect(() => {
        removeCoupon(cartId);
        removeRedeemSkyPoint();
    }, [cartId, removeCoupon, removeRedeemSkyPoint]);

    useEffect(() => {
        if (data) {
            updateCartIcon();
        }
    }, [data, updateCartIcon]);

    const itemQuantity = data && data.cart ? (data.cart.items || []).length : 0;
    let items = [];
    let earnedSkypoints = 0;
    let isListContainInvalidProduct = 0;
    if (called && !error && !loading && !isEmpty) {
        items = data.cart.items;
        earnedSkypoints = data.cart.earned_skypoints;
        const productError = items.find(item => {
            return !item.product.saleable_status['is_saleable'];
        });

        if (productError) {
            isListContainInvalidProduct = true;
        }
    }
    const shouldShowLoadingIndicator = !cartId || !data || loading;

    const actionType = {
        ACTION_ADD: 'add',
        ACTION_EDIT: 'edit'
    };
    const initialShippingAddressActionPage = {
        type: null,
        currentAddress: {}
    };
    const [
        shippingAddressActionPage,
        setShippingAddressActionPage
    ] = useReducer((state, action) => {
        switch (action.type) {
            case null:
                return initialShippingAddressActionPage;
            case actionType.ACTION_ADD:
                return {
                    ...state,
                    type: action.type
                };
            case actionType.ACTION_EDIT:
                return {
                    type: action.type,
                    currentAddress: action.address
                };
        }
    }, initialShippingAddressActionPage);

    const history = useHistory();

    const location = useLocation();
    const state = location.state;

    const removeInitialValue = (productKey, ...fields) => {
        if (!state) {
            return;
        }

        fields.forEach(field => {
            if (state['orderOptions'][`p${productKey}`][field]) {
                delete state['orderOptions'][`p${productKey}`][field];
            }
        });

        history.replace({ state: { ...state } });
    };

    const checkAvailableOrderTicketInfo = useAwaitQuery(
        CHECK_AVAILABLE_TICKET_INFO
    );

    const apiRef = useRef();
    const validateTicketOrderInfo = async () => {
        apiRef.current.validate();
        const values = apiRef.current.getValues();
        const orderOptions = values.orderOptions;
        if (!orderOptions) {
            apiRef.current.submitForm();
            return;
        }

        const itemKeys = Object.keys(orderOptions);
        const ticketsInfo = {};

        itemKeys.forEach(itemKey => {
            const option = orderOptions[itemKey];
            if (!option.members) {
                return;
            }

            ticketsInfo[extractItemId(itemKey)] = option.members;
        });

        if (!Object.keys(ticketsInfo).length) {
            apiRef.current.submitForm();
            return;
        }

        const { data } = await checkAvailableOrderTicketInfo({
            fetchPolicy: 'no-cache',
            variables: {
                ticketsInfo: JSON.stringify(ticketsInfo),
                cartId: cartId
            }
        });

        if (!data.checkAvailableOrderTicketInfo) {
            apiRef.current.submitForm();
            return;
        }

        const errorTicketInfoResponse = JSON.parse(
            data.checkAvailableOrderTicketInfo
        );

        Object.keys(errorTicketInfoResponse).forEach(itemKey => {
            Object.keys(errorTicketInfoResponse[itemKey]).forEach(index => {
                apiRef.current.setError(
                    `orderOptions.p${itemKey}.members[${index}].uid`,
                    errorTicketInfoResponse[itemKey][index]
                );
            });
        });
    };

    const handleSubmit = (values, selectedAddress) => {
        history.push({
            pathname: resourceUrl('/checkout/second-step'),
            state: { ...state, ...values, selectedAddress }
        });
    };

    return {
        itemQuantity,
        isCartUpdating,
        setIsCartUpdating,
        shouldShowLoadingIndicator,
        shippingAddressActionPage,
        setShippingAddressActionPage,
        actionType,
        handleSubmit,
        state,
        removeInitialValue,
        validateTicketOrderInfo,
        apiRef,
        flatData: flattenData(data),
        refetchPrice: refetch,
        earnedSkypoints,
        items,
        setForceRender,
        isListContainInvalidProduct
    };
};
