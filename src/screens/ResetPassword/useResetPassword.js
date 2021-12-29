import { useCallback, useMemo, useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useHistory, useLocation } from '@skp/drivers';

export const useResetPassword = props => {
    const { mutations, queries } = props;
    const [inProgress, setInProgress] = useState(false);
    const location = useLocation();
    const [resetPassword, { error: resetPasswordError, data }] = useMutation(
        mutations.resetPasswordMutation
    );
    const history = useHistory();

    const token = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);

        if (searchParams.has('token')) {
            return searchParams.get('token');
        } else {
            return null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const email = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);

        if (searchParams.has('email')) {
            return searchParams.get('email');
        } else {
            return null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        history.replace({
            search: ''
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFormSubmit = useCallback(
        async ({ newPassword }) => {
            setInProgress(true);
            try {
                await resetPassword({
                    variables: {
                        email: email,
                        resetPasswordToken: token,
                        newPassword: newPassword
                    }
                });
                setInProgress(false);
            } catch {
                setInProgress(false);
            }
        },
        [resetPassword, email, token]
    );

    const hasValidData = email && token;

    const { data: checkLinkTokenExpiredData } = useQuery(
        queries.checkLinkTokenExpired,
        {
            fetchPolicy: 'no-cache',
            variables: {
                email,
                resetPasswordToken: token
            },
            skip: !hasValidData
        }
    );

    return {
        formErrors: resetPasswordError,
        handleFormSubmit,
        inProgress,
        hasValidData,
        resultSubmit: data ? data.resetPassword : false,
        checkLinkTokenExpired: checkLinkTokenExpiredData
            ? checkLinkTokenExpiredData.checkLinkTokenExpired
            : null
    };
};
