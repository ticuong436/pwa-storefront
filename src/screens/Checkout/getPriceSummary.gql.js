import gql from 'graphql-tag';

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

const RedeemedSkyPointsFragment = gql`
    fragment RedeemedSkyPointsFragment on CartPrices {
        redeemed_skypoints {
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

const PriceSummaryFragment = gql`
    fragment PriceSummaryFragment on Cart {
        id
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

export const GET_PRICE_SUMMARY = gql`
    query getPriceSummary($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            earned_skypoints {
                value
                currency
            }
            additional_shipping_fee {
                value
                currency
            }
            ...PriceSummaryFragment
        }
    }
    ${PriceSummaryFragment}
`;
