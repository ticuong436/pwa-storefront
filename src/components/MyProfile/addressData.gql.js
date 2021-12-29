import gql from 'graphql-tag';

const GET_ADDRESS_BY_POSTAL_CODE_QUERY = gql`
    query getAddress($post_code: String) {
        getAddressByPostCode(postalCode: $post_code) {
            id
            postal_code
            state_en
            city_en
            address_en
        }
    }
`;

export default {
    queries: {
        getAddress: GET_ADDRESS_BY_POSTAL_CODE_QUERY
    }
};
