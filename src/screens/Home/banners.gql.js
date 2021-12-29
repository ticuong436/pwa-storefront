import gql from 'graphql-tag';

const GET_BANNERS = gql`
    query getListBanner {
        banners: getListBanner {
            title
            is_main_banner
            header
            description
            image
            link
        }
    }
`;

export default {
    queries: {
        getListBanner: GET_BANNERS
    }
};
