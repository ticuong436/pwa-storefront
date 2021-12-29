import { ProductListingFragment } from './productListingFragments.gql';
import gql from 'graphql-tag';

export const GET_FULL_CART_DETAILS = gql`
    query getFullCartDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            total_quantity
            prices {
                subtotal_excluding_tax {
                    currency
                    value
                }
            }
            earned_skypoints {
                value
                currency
            }
            platinum_cart_infos {
                sub_total {
                    value
                    currency
                }
                sky_point
            }
            ...ProductListingFragment
        }
    }
    ${ProductListingFragment}
`;
