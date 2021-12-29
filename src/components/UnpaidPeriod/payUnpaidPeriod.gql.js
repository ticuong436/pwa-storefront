import gql from 'graphql-tag';

const GET_CURRENT_CUSTOMER = gql`
    query getCurrentCustomer {
        customer: getCurrentCustomer {
            is_inactive
            unpaidMemberFee: unpaidMemberFee {
                totalAmount
                invoiceFromDate
                invoiceToDate
            }
        }
    }
`;

const PAY_UNPAID_PERIOD = gql`
    mutation payUnpaidPeriod($card_id: String!) {
        isSuccess: payUnpaidPeriod(cardId: $card_id)
    }
`;

export default {
    queries: {
        getCurrentCustomer: GET_CURRENT_CUSTOMER
    },
    mutations: {
        payUnpaidPeriod: PAY_UNPAID_PERIOD
    }
};
