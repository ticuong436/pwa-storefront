import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

export const useForgotPassword = props => {
    const { mutations } = props;
    const [inProgress, setInProgress] = useState(false);
    const [resetPassword, { error: resetPasswordError, data }] = useMutation(
        mutations.resetPasswordMutation
    );

    const handleFormSubmit = useCallback(
        async ({ email }) => {
            setInProgress(true);
            try {
                await resetPassword({ variables: { email } });
                setInProgress(false);
            } catch {
                setInProgress(false);
            }
        },
        [resetPassword]
    );

    return {
        formErrors: resetPasswordError,
        handleFormSubmit,
        inProgress,
        resultSubmit: data ? data.requestPasswordResetEmail : false
    };
};
