import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';
import { removeCart } from '@magento/peregrine/lib/store/actions/cart';
import { clearCheckoutDataFromStorage } from '@magento/peregrine/lib/store/actions/checkout';
import { removeCurrentSearch } from '@skp/components/HotelListing/utils/currentSearchParams';
import actions from './actions';

const storage = new BrowserPersistence();

export const signOut = (payload = {}) =>
    async function thunk(dispatch) {
        const { revokeToken, apolloClient } = payload;

        if (revokeToken) {
            // Send mutation to revoke token.
            try {
                await revokeToken();
            } catch (error) {
                console.error('Error Revoking Token', error);
            }
        }

        // Remove token from local storage and Redux.
        await dispatch(clearToken());
        await dispatch(actions.reset());
        await clearCheckoutDataFromStorage();
        await removeCurrentSearch();

        if (apolloClient) {
            // After logout, reset the store to set the bearer token.
            // https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout
            apolloClient.clearStore();
        }

        // Now that we're signed out, forget the old (customer) cart.
        // We don't need to create a new cart here because we're going to refresh
        // the page immediately after.
        await dispatch(removeCart());
    };

export const getUserDetails = ({ fetchUserDetails }) =>
    async function thunk(...args) {
        const [dispatch, getState] = args;
        const { user } = getState();

        if (user.isSignedIn) {
            dispatch(actions.getDetails.request());

            try {
                const { data } = await fetchUserDetails({
                    fetchPolicy: 'no-cache'
                });

                dispatch(actions.getDetails.receive(data.customer));
                return data;
            } catch (error) {
                dispatch(actions.getDetails.receive(error));
            }
        }
    };

export const getUserDetailsInBackground = ({ fetchUserDetails }) =>
    async function thunk(...args) {
        const [dispatch, getState] = args;
        const { user } = getState();

        if (user.isSignedIn) {
            try {
                const { data } = await fetchUserDetails({
                    fetchPolicy: 'no-cache'
                });

                dispatch(actions.getDetails.receive(data.customer));
                return data;
            } catch (error) {
                dispatch(actions.getDetails.receive(error));
            }
        }
    };

export const resetPassword = ({ email }) =>
    async function thunk(...args) {
        const [dispatch] = args;

        dispatch(actions.resetPassword.request());

        // TODO: actually make the call to the API.
        // For now, just return a resolved promise.
        await Promise.resolve(email);

        dispatch(actions.resetPassword.receive());
    };

export const setToken = payload =>
    async function thunk(...args) {
        const [dispatch] = args;

        // Store token in local storage.
        storage.setItem('signin_token', payload.token, payload.ttl);

        // Persist in store
        dispatch(actions.setToken(payload.token));
    };

export const clearToken = () =>
    async function thunk(...args) {
        const [dispatch] = args;

        // Clear token from local storage
        storage.removeItem('signin_token');

        // Remove from store
        dispatch(actions.clearToken());
    };
