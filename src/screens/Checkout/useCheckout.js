import { useQuery } from '@apollo/react-hooks';
import { useUserContext } from '@skp/layouts/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { resourceUrl, useHistory } from '@skp/drivers';
import { GET_FULL_CART_DETAILS } from './getFullCartDetails.gql';

export const useCheckout = () => {
    const [{ isSignedIn }] = useUserContext();
    const [{ isEmpty, isLoading, cartId }] = useCartContext();

    const { called, error, data, loading: loadingAddress } = useQuery(
        GET_FULL_CART_DETAILS,
        {
            variables: { cartId },
            skip: !cartId,
            fetchPolicy: 'no-cache'
        }
    );

    let items = [];
    let isListContainInvalidProduct = false;
    if (called && !error && !loadingAddress && !isEmpty) {
        items = data.cart.items;
        const productError = items.find(item => {
            return !item.product.saleable_status['is_saleable'];
        });

        if (productError) {
            isListContainInvalidProduct = true;
        }
    }

    const {
        shipping_addresses: cartShippingAddresses,
        selected_payment_method: selectedPaymentMethod,
        applied_coupons: appliedCoupons = []
    } = data ? (data.cart ? data.cart : {}) : {};

    const history = useHistory();
    const goToPayment = () => {
        history.push(resourceUrl('/checkout/payment'));
    };

    return {
        isGuestCheckout: !isSignedIn,
        isLoading: !cartId || isLoading || loadingAddress,
        isCartEmpty: !isLoading && isEmpty,
        cartId,
        cartShippingAddresses,
        selectedPaymentMethod,
        appliedCoupons,
        goToPayment,
        items,
        isListContainInvalidProduct
    };
};
