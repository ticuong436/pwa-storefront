import { useQuery } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { GET_PRICE_SUMMARY } from './getPriceSummary.gql';

/**
 * Flattens query data into a simple object. We create this here rather than
 * having each line summary line component destructure its own data because
 * only the parent "price summary" component knows the data structure.
 *
 * @param {Object} data query data
 */
const flattenData = data => {
    if (!data) return {};

    return {
        subtotal: data.cart.prices.subtotal_excluding_tax,
        total: data.cart.prices.grand_total,
        discounts: data.cart.prices.discounts,
        shipping: data.cart.shipping_addresses,
        redeemed_skypoints: data.cart.prices.redeemed_skypoints,
        additional_shipping_fee: data.cart.additional_shipping_fee
    };
};

export const usePriceSummary = () => {
    const [{ cartId }] = useCartContext();

    const { loading, data, refetch } = useQuery(GET_PRICE_SUMMARY, {
        skip: !cartId,
        variables: {
            cartId
        },
        fetchPolicy: 'no-cache'
    });

    return {
        isLoading: !!loading,
        flatData: flattenData(data),
        refetchPrice: refetch,
        earned_skypoints: data
            ? data.cart
                ? data.cart.earned_skypoints
                : 0
            : 0
    };
};
