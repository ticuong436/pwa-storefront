import { useCallback } from 'react';
import SIGN_IN_MUTATION from './signIn.graphql';
import { useUserContext } from '@skp/layouts/context/user';
import { useMutation } from '@apollo/react-hooks';

// TODO: should this move to user context?
export const useSignInApi = () => {
    const [signInMutation, { error: signInError }] = useMutation(
        SIGN_IN_MUTATION,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const [, { setToken }] = useUserContext();

    const signInApi = useCallback(
        async (email, password) => {
            const signInResponse = await signInMutation({
                variables: { email, password }
            });
            const tokenData = signInResponse.data.generateCustomerToken;
            await setToken(tokenData);
        },
        [signInMutation, setToken]
    );

    return {
        signInError,
        signIn: signInApi
    };
};
