import { ProductListingFragment } from '@skp/screens/Checkout/productListingFragments.gql';
import gql from 'graphql-tag';

import { PriceSummaryFragment } from '@magento/venia-ui/lib/components/CartPage/PriceSummary/priceSummaryFragments';
import { AppliedCouponsFragment } from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode/couponCodeFragments';

export const GET_FULL_CART_DETAILS = gql`
    query getFullCartDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            total_quantity
            additional_shipping_fee {
                value
                currency
            }
            ...AppliedCouponsFragment
            ...PriceSummaryFragment
            ...ProductListingFragment
            earned_skypoints {
                value
                currency
            }
        }
    }
    ${AppliedCouponsFragment}
    ${PriceSummaryFragment}
    ${ProductListingFragment}
`;
