import { useState, useEffect, useCallback } from 'react';
import { useUserContext } from '@skp/layouts/context/user';
import { useApolloClient } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '@magento/peregrine/lib/Apollo/clearCustomerDataFromCache';
import { useSignInApi } from '@skp/hooks/signIn/useSignInApi';
import { resourceUrl, useLocation } from '@skp/drivers';
import { useHistory } from 'react-router-dom';
import { isAuthError } from '@skp/utils/graphqlError';
import { useUserContextQuery } from '@skp/layouts/context/user/context';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import GET_CREDIT_CARD_MESSAGE from '@skp/screens/MyPage/graphql/getCreditCardMessage.graphql';

export const useSignIn = () => {
    const apolloClient = useApolloClient();

    const [isSigningIn, setIsSigningIn] = useState(false);

    const [{ cartId }, { removeCart }] = useCartContext();
    const [
        { isGettingDetails, getDetailsError, isSignedIn }
    ] = useUserContext();

    const history = useHistory();
    const location = useLocation();
    const [redirectTo, setRedirectTo] = useState(
        isSignedIn ? resourceUrl('/') : null
    );

    const { userContextFetchDetails } = useUserContextQuery();

    const { signIn, signInError } = useSignInApi();

    const errors = [];
    if (signInError) {
        errors.push(signInError);
    }
    if (getDetailsError && !isAuthError(getDetailsError)) {
        errors.push(getDetailsError);
    }

    useEffect(() => {
        if (isSignedIn && !cartId) {
            return;
        }

        async function clearCache() {
            // Clear all cart/customer data from cache and redux.
            await clearCartDataFromCache(apolloClient);
            await clearCustomerDataFromCache(apolloClient);
            await removeCart();
        }

        clearCache();
    }, [isSignedIn, cartId, apolloClient, removeCart]);

    const clearErrorMessage = useCallback(() => {
        if (location.state && location.state.messageError) {
            history.replace({
                state: { ...location.state, ...{ messageError: '' } }
            });
        }
    }, [history, location]);

    const getCustomerCreditCardMessage = useAwaitQuery(GET_CREDIT_CARD_MESSAGE);

    const handleSubmit = async ({ email, password }) => {
        setIsSigningIn(true);
        try {
            await signIn(email, password);

            // No need to call these, because it is called when header, and layout is load
            // See: src/layouts/useAppContent.js and src/layouts/Header/useCartIcon.js
            // Create and get the customer's cart id.
            // await createCart({
            //     fetchCartId
            // });
            // await getCartDetails({ fetchCartId, fetchCartDetails });
            const { customer } = await userContextFetchDetails();

            if (customer.is_registering) {
                setRedirectTo(resourceUrl('/sign-up/third-step'));
                return;
            }

            if (customer.is_inactive) {
                setRedirectTo(resourceUrl('/customer/payment/history'));
                return;
            }

            if (customer.profile_alert_flag) {
                setRedirectTo(resourceUrl('/customer/account'));
                return;
            }

            const { data } = await getCustomerCreditCardMessage({
                fetchPolicy: 'no-cache'
            });

            if (data.customerCreditCardMessage) {
                setRedirectTo(resourceUrl('/customer/stripe/cards'));
            } else if (location.state && location.state.from) {
                setRedirectTo(location.state.from);
            } else {
                setRedirectTo(resourceUrl('/'));
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error(error);
            }

            setIsSigningIn(false);
        }
    };

    return {
        errors,
        clearErrorMessage,
        handleSubmit,
        isBusy: isGettingDetails || isSigningIn,
        redirectTo
    };
};
