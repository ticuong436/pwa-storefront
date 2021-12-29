import gql from 'graphql-tag';

export const CHANGE_TYPE_MUTATION = gql`
    mutation updateCustomerOfferType($type: String!) {
        updateCustomerOfferType(type: $type)
    }
`;

export default {
    queries: {},
    mutations: {
        changeGradeMutation: CHANGE_TYPE_MUTATION
    }
};
