import gql from 'graphql-tag';

export const UPDATE_EMAIL_MUTATION = gql`
    mutation updateCustomer($email: String!, $password: String!) {
        updateCustomer(input: { email: $email, password: $password }) {
            customer {
                email
            }
        }
    }
`;

export default {
    queries: {},
    mutations: {
        updateEmailMutation: UPDATE_EMAIL_MUTATION
    }
};
