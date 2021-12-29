import { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { resourceUrl, useHistory } from '@skp/drivers';
import { useCheckLoginSession } from '@skp/hooks/useCheckLoginSession';

export const useUpdatePassword = props => {
    const { mutations } = props;
    const [inProgress, setInProgress] = useState(false);
    const [updatePassword, { error: updatePasswordError, data }] = useMutation(
        mutations.updatePasswordMutation
    );
    const history = useHistory();

    const { signOutApi } = useCheckLoginSession({ watchToken: false });

    const handleFormSubmit = async ({ currentPassword, newPassword }) => {
        setInProgress(true);
        try {
            await updatePassword({
                variables: {
                    currentPassword,
                    newPassword
                }
            });

            await signOutApi();

            history.push(resourceUrl('/login'));
        } catch (error) {
            console.error(error);
            setInProgress(false);
        }
    };

    return {
        formErrors: updatePasswordError,
        handleFormSubmit,
        inProgress,
        resultSubmit: data ? data.changeCustomerPassword : false
    };
};
