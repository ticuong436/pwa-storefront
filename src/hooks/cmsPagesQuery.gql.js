import gql from 'graphql-tag';

const GET_SIGNUP_AGREEMENT_PAGES = gql`
    query getSignupAgreementPages {
        members: cmsPage(identifier: "public/sky_membership_agreement") {
            url_key
            title
        }
        term: cmsPage(identifier: "public/sky_agreement_term_of_use") {
            url_key
            title
        }
        policy: cmsPage(identifier: "public/sky_agreement_privacy_policy") {
            url_key
            title
        }
        points: cmsPage(identifier: "public/sky_agreement_points_regulation") {
            url_key
            title
        }
    }
`;

export default {
    queries: {
        getSignUpAgreementPages: GET_SIGNUP_AGREEMENT_PAGES
    }
};
