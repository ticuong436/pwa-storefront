import gql from 'graphql-tag';

export const CREATE_ACCOUNT_MUTATION = gql`
    mutation createCustomerWithAddress(
        $customerInput: CustomerWithAddressInput!
    ) {
        createCustomerWithAddress(input: $customerInput) {
            customer {
                firstname
            }
        }
    }
`;

export default {
    queries: {},
    mutations: {
        createAccountMutation: CREATE_ACCOUNT_MUTATION
    }
};
