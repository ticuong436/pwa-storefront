import gql from 'graphql-tag';

const GET_MEMBER_SUBSCRIPTION_PLANS = gql`
    query memberSubscriptionPlans {
        memberSubscriptionPlans {
            code
            name
            payment_cycles {
                currency
                description
                interval
                interval
                label
                price
            }
        }
    }
`;

const UPDATE_CUSTOMER_SIGN_UP_STEP2 = gql`
    mutation updateCustomerSignUpStep2(
        $updateCustomerInput: InputUpdateCustomerSignUpStep2!
    ) {
        updateCustomerSignUpStep2(input: $updateCustomerInput)
    }
`;

export default {
    queries: {
        getMemberSubscriptionPlans: GET_MEMBER_SUBSCRIPTION_PLANS
    },
    mutations: {
        updateCustomerSignUpStep2: UPDATE_CUSTOMER_SIGN_UP_STEP2
    }
};
