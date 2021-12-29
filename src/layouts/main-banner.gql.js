import gql from 'graphql-tag';

const GET_MAIN_BANNER_QUERY = gql`
    query getMainBanner {
        mainBanner: getMainBanner {
            image
        }
    }
`;

export default {
    queries: {
        getMainBanner: GET_MAIN_BANNER_QUERY
    }
};
