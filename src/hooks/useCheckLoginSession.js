import SIGN_OUT_MUTATION from './signOut.graphql';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { useCallback, useEffect } from 'react';
import { checkValidToken, useUserContext } from '@skp/layouts/context/user';
import { resourceUrl, useHistory, useLocation } from '@skp/drivers';

export const useCheckLoginSession = ({ watchToken }) => {
    const apolloClient = useApolloClient();
    const [revokeToken, { loading: isLoggingOut }] = useMutation(
        SIGN_OUT_MUTATION
    );

    const [{ isSignedIn }, { signOut }] = useUserContext();

    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        if (!watchToken) {
            return;
        }
        if (!checkValidToken() || !isSignedIn) {
            // Token is invalid, so we don't need revoke
            signOut({ apolloClient });
        }
    }, [apolloClient, signOut, location, revokeToken, isSignedIn, watchToken]);

    const signOutApi = useCallback(async () => {
        await signOut({ revokeToken, apolloClient });
    }, [apolloClient, revokeToken, signOut]);

    const handleSignOut = useCallback(
        async event => {
            event.preventDefault();
            try {
                await signOutApi();

                history.push(resourceUrl('/login'));
            } catch (error) {
                console.error(error);
            }
        },
        [signOutApi, history]
    );

    return {
        isLoggingOut,
        signOutApi,
        handleSignOut
    };
};
