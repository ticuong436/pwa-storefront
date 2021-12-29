import gql from 'graphql-tag';

export const SEND_INVITATION_MUTATION = gql`
    mutation sendInvitation($email: String!, $message: String!) {
        sendInvitation(email: $email, message: $message) {
            message
        }
    }
`;

export default {
    queries: {},
    mutations: {
        sendInvitationMutation: SEND_INVITATION_MUTATION
    }
};
