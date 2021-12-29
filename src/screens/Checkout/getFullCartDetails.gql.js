import gql from 'graphql-tag';
import { ProductListingFragment } from './productListingFragments.gql';

const DiscountSummaryFragment = gql`
    fragment DiscountSummaryFragment on CartPrices {
        discounts {
            amount {
                currency
                value
            }
            label
        }
    }
`;

const ShippingSummaryFragment = gql`
    fragment ShippingSummaryFragment on Cart {
        id
        shipping_addresses {
            selected_shipping_method {
                amount {
                    currency
                    value
                }
            }
        }
    }
`;

const GrandTotalFragment = gql`
    fragment GrandTotalFragment on CartPrices {
        grand_total {
            currency
            value
        }
    }
`;
const SubTotalFragment = gql`
    fragment SubTotalFragment on CartPrices {
        subtotal_excluding_tax {
            currency
            value
        }
    }
`;

const RedeemedSkyPointsFragment = gql`
    fragment RedeemedSkyPointsFragment on CartPrices {
        redeemed_skypoints {
            currency
            value
        }
    }
`;

const PriceSummaryFragment = gql`
    fragment PriceSummaryFragment on Cart {
        id
        items {
            id
            quantity
        }
        ...ShippingSummaryFragment
        prices {
            ...DiscountSummaryFragment
            ...GrandTotalFragment
            ...RedeemedSkyPointsFragment
            ...SubTotalFragment
        }
    }
    ${DiscountSummaryFragment}
    ${GrandTotalFragment}
    ${ShippingSummaryFragment}
    ${RedeemedSkyPointsFragment}
    ${SubTotalFragment}
`;

export const GET_FULL_CART_DETAILS = gql`
    query getFullCartDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            shipping_addresses {
                firstname
                lastname
                company
                street
                city
                region {
                    code
                    label
                }
                postcode
                country {
                    code
                    label
                }
                telephone
                available_shipping_methods {
                    amount {
                        currency
                        value
                    }
                    available
                    carrier_code
                    carrier_title
                    method_code
                    method_title
                }
            }
            billing_address {
                firstname
                lastname
                company
                street
                city
                region {
                    code
                    label
                }
                postcode
                country {
                    code
                    label
                }
            }
            available_payment_methods {
                code
                title
            }
            selected_payment_method {
                code
                selected_card
            }
            applied_coupons {
                code
            }
            additional_shipping_fee {
                value
                currency
            }
            ...PriceSummaryFragment
            ...ProductListingFragment
        }
    }
    ${PriceSummaryFragment}
    ${ProductListingFragment}
`;
