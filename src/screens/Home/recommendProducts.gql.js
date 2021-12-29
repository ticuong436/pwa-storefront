import gql from 'graphql-tag';

const GET_RECOMMEND_PRODUCTS_QUERY = gql`
    query {
        productsOfRecommend {
            id
            name
            small_image {
                url
            }
            external_detail_url
            service_name {
                value
                label
            }
            pillar {
                code
                name
            }
            detail_middle_category
            type_id
            url_key
            is_new
            sku
            is_in_wish_list
            sky_point
            short_description {
                html
            }
            service_description
            sky_info_wad_category2
            sky_info_wad_state
            sky_info_wad_city
            price_range {
                minimum_price {
                    regular_price {
                        currency
                        value
                    }
                    discount {
                        amount_off
                        percent_off
                    }
                    final_price {
                        currency
                        value
                    }
                }
            }
            is_the_time
            is_sky_special_price
            price_tiers_the_time {
                group_id
                discount {
                    amount_off
                    percent_off
                }
                final_price {
                    value
                    currency
                }
            }
            special_price
        }
    }
`;

export default {
    queries: {
        productsOfRecommendQuery: GET_RECOMMEND_PRODUCTS_QUERY
    }
};
