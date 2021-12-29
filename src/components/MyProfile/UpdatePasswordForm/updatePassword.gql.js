import gql from 'graphql-tag';

export const UPDATE_PASSWORD_MUTATION = gql`
    mutation changeCustomerPassword(
        $currentPassword: String!
        $newPassword: String!
    ) {
        changeCustomerPassword(
            currentPassword: $currentPassword
            newPassword: $newPassword
        ) {
            id
            email
        }
    }
`;

export default {
    queries: {},
    mutations: {
        updatePasswordMutation: UPDATE_PASSWORD_MUTATION
    }
};
