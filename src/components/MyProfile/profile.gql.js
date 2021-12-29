import gql from 'graphql-tag';

const GET_CURRENT_CUSTOMER = gql`
    query getCurrentCustomerInMyProfile {
        customer: getCurrentCustomer {
            firstname
            lastname
            gender
            dob
            uid
            occupation
            nationality
            email
            group
            group_image
            new_change_type_can_update
            change_type
            registration_country_number
            registration_phone_number
            registration_country
            registration_state
            registration_postal_code
            registration_city
            registration_address1
            registration_address2
            next_payment_amount
            next_payment_date
            profile_alert_flag
            profile_alert_message
        }
    }
`;

const UPDATE_CUSTOMER = gql`
    mutation updateCurrentCustomer($inputUpdateCustomer: InputUpdateCustomer) {
        updateCurrentCustomer(input: $inputUpdateCustomer)
    }
`;

export default {
    queries: {
        getCurrentCustomer: GET_CURRENT_CUSTOMER
    },
    mutations: {
        updateCustomer: UPDATE_CUSTOMER
    }
};
