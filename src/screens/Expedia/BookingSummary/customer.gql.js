import gql from 'graphql-tag';

const GET_CURRENT_CUSTOMER = gql`
    query getCurrentCustomer {
        customer: getCurrentCustomer {
            firstname
            lastname
            gender
            email
            registration_country_number
            registration_phone_number
            registration_country
            registration_state
            registration_city
            registration_address1
            registration_address2
        }
    }
`;

export default {
    queries: {
        getCurrentCustomer: GET_CURRENT_CUSTOMER
    }
};
