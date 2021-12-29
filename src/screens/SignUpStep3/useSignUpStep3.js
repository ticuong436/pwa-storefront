import { useQuery } from '@apollo/react-hooks';
import { useLocation } from '@skp/drivers';
import GET_WELCOME_PAGE_URL from './getWelcomePageUrl.graphql';

export default function useSignUpStep3() {
    const location = useLocation();
    let isRedirectFromSecondStep = false;

    if (location.state && location.state.fromStep === 2) {
        isRedirectFromSecondStep = true;
    }

    const {
        data: welcomePageUrlData,
        loading: loadingWelcomePageUrl
    } = useQuery(GET_WELCOME_PAGE_URL, {
        fetchPolicy: 'network-only'
    });

    return {
        isRedirectFromSecondStep,
        welcomePageUrl: (welcomePageUrlData || {}).welcomePageUrl,
        loadingWelcomePageUrl
    };
}
