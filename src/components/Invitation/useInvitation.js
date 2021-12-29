import { useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { getErrorMessage } from '@skp/utils/graphqlError';

export const useInvitation = props => {
    const {
        invitationOperations: { mutations }
    } = props;

    const [
        ,
        { setInfo, setError, reset: resetNotification }
    ] = useNotificationContext();

    const [
        sendInvitation,
        { loading, error: sendInvitationError }
    ] = useMutation(mutations.sendInvitationMutation);

    const handleSendInvitation = async ({ email, message }) => {
        resetNotification();
        try {
            const response = await sendInvitation({
                variables: {
                    email: email,
                    message: message
                }
            });
            setInfo(response.data.sendInvitation.message);
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        if (sendInvitationError) {
            setError(getErrorMessage(sendInvitationError));
        }
    }, [sendInvitationError, setError]);

    return {
        inProgress: loading,
        handleSendInvitation
    };
};
