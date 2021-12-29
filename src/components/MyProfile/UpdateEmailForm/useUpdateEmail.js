import { useMutation } from '@apollo/react-hooks';

export const useUpdateEmail = props => {
    const { mutations } = props;
    const [
        updateEmail,
        { error: updateEmailError, loading, data }
    ] = useMutation(mutations.updateEmailMutation);

    const handleUpdate = async ({ email, password }) => {
        await updateEmail({
            variables: {
                email,
                password
            }
        });
        window.location.reload();
    };

    return {
        errors: updateEmailError,
        handleUpdate,
        inProgress: loading,
        result: data ? data.updateCustomer : false
    };
};
