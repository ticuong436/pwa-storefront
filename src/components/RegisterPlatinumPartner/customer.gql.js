import gql from 'graphql-tag';

const GET_CURRENT_CUSTOMER = gql`
    query getCurrentCustomer {
        customer: getCurrentCustomer {
            group
            can_register_platinum_partner
            next_payment_amount
            subscription_payment_cycle
            partner_payment_amount
        }
    }
`;

const CREATE_PLATINUM_PARTNER_CUSTOMER = gql`
    mutation createPlatinumPartnerCustomer(
        $inputCreatePlatinumCustomer: InputCreatePlatinumCustomer
    ) {
        createPlatinumPartnerCustomer(input: $inputCreatePlatinumCustomer)
    }
`;

export default {
    queries: {
        getCurrentCustomer: GET_CURRENT_CUSTOMER
    },
    mutations: {
        createPlatinumPartnerCustomer: CREATE_PLATINUM_PARTNER_CUSTOMER
    }
};
