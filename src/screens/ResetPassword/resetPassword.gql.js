import gql from 'graphql-tag';

const RESET_PASSWORD_MUTATION = gql`
    mutation resetPassword(
        $email: String!
        $resetPasswordToken: String!
        $newPassword: String!
    ) {
        resetPassword(
            email: $email
            resetPasswordToken: $resetPasswordToken
            newPassword: $newPassword
        )
    }
`;

const CHECK_LINK_TOKEN_EXPIRED = gql`
    query checkLinkTokenExpired($email: String!, $resetPasswordToken: String!) {
        checkLinkTokenExpired(
            email: $email
            resetPasswordToken: $resetPasswordToken
        ) {
            result
            message
        }
    }
`;

export default {
    queries: {
        checkLinkTokenExpired: CHECK_LINK_TOKEN_EXPIRED
    },
    mutations: {
        resetPasswordMutation: RESET_PASSWORD_MUTATION
    }
};
