import { useEffect } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@skp/layouts/context/user';
import { GET_ITEM_COUNT_QUERY } from '@magento/venia-ui/lib/components/Header/cartTrigger.gql';
import CREATE_CART_MUTATION from '@magento/venia-ui/lib/queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '@magento/venia-ui/lib/queries/getCartDetails.graphql';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { isRunningInWebview, sendEventToWebview } from '@skp/utils/webview';

export const useCartIcon = () => {
    const [{ isSignedIn }] = useUserContext();
    const apolloClient = useApolloClient();
    const [
        { cartId, details, isLoading },
        { getCartDetails }
    ] = useCartContext();
    const [fetchCartId] = useMutation(CREATE_CART_MUTATION);

    const { data } = useQuery(GET_ITEM_COUNT_QUERY, {
        fetchPolicy: 'network-only',
        variables: {
            cartId
        },
        skip: !isSignedIn || !cartId
    });
    const itemCount = data ? data.cart.total_quantity : 0;

    const fetchCartDetails = useAwaitQuery(GET_CART_DETAILS_QUERY);

    useEffect(() => {
        if (isRunningInWebview()) {
            sendEventToWebview('cart-qty-changed', itemCount);
        }
    }, [itemCount]);

    useEffect(() => {
        if (!isSignedIn || isLoading) {
            return;
        }

        // Currently, we use useRouteMatch for PillarRoute in routes.js,
        // when navigate to pillar route, it will trigger this to reload cart,
        // that is not we want. We only want this to be load on load page.
        // So we check if customer already loaded, we don't load again.
        if (details && details.items) {
            return;
        }

        // Passing apolloClient to wipe the store in event of auth token expiry
        // This will only happen if the user refreshes.
        getCartDetails({ apolloClient, fetchCartId, fetchCartDetails });
    }, [
        isSignedIn,
        apolloClient,
        fetchCartDetails,
        fetchCartId,
        getCartDetails,
        details,
        isLoading
    ]);

    return {
        itemCount
    };
};
