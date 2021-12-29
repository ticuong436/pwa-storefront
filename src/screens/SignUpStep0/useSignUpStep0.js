import { useQuery } from '@apollo/react-hooks';
import { resourceUrl, useHistory, useParams } from '@skp/drivers';
import GET_INVITATION_INFO from './getInvitationInfo.graphql';
import { useTermLinks } from '@skp/hooks/useTermLinks';

export const useSignUpStep0 = () => {
    const { invite_code } = useParams();

    // Set a default value for data when not loaded data yet
    const { term, policy, points, members } = useTermLinks();

    const {
        loading: loadingInvitationInfo,
        data: dataInvitationInfo
    } = useQuery(GET_INVITATION_INFO, {
        variables: {
            invite_code
        },
        fetchPolicy: 'network-only'
    });

    const { invitationInfo = {} } = dataInvitationInfo || {};

    const history = useHistory();
    const handleFormSubmit = data => {
        const dataSignUp = { ...data, invite_code: invitationInfo.inviteCode };

        history.replace({
            pathname: resourceUrl('/sign-up/first-step'),
            state: { data: dataSignUp }
        });
    };

    return {
        handleFormSubmit,
        skyMemberShipPage: members,
        termOfUsePage: term,
        privacyPolicyPage: policy,
        skyPointsRegulationPage: points,
        loadingInvitationInfo,
        invitationInfo
    };
};
