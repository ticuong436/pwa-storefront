import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useUserContext } from '@skp/layouts/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import REMOVE_CART_MUTATION from './graphql/removeCart.graphql';
import { useClearCouponAndRedeemSkyPoints } from '@skp/screens/Checkout/useClearCouponAndRedeemSkyPoints';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { useTranslation } from 'react-i18next';
import { useUpdateCartIcon } from '@skp/hooks/useUpdateCartIcon';
import { SERVICE_THE_TIME } from '@skp/config';

const LIMIT_CROSSSELL_LIST = 12;

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
        subtotal: data.cart.prices.subtotal_excluding_tax
    };
};

export const useShoppingCart = props => {
    const {
        queries: { getCartDetails }
    } = props;

    const [{ isSignedIn }] = useUserContext();
    const [{ cartId }, { actions: cartActions }] = useCartContext();

    const [forceRender, setForceRender] = useState(false);
    const [triggerRecollectTotals, setTriggerRecollectTotals] = useState(false);

    const [, { setInfo, setError }] = useNotificationContext();
    const { t } = useTranslation(['cart', 'common']);

    const [isCartUpdating, setIsCartUpdating] = useState(false);
    const [isShowPopupConfirm, setShowPopupConfirm] = useState(false);
    const [isRemoveCoupon, setIsRemoveCoupon] = useState(false);
    const { updateCartIcon } = useUpdateCartIcon(cartId);

    const { called, data, loading, error, refetch } = useQuery(getCartDetails, {
        fetchPolicy: 'no-cache',
        // Don't make this call if we don't have a cartId
        skip: !cartId,
        variables: { cartId }
    });

    let items = [];
    let crosssellProducts = new Map();
    let earnedSkypoints = 0;
    let isListContainInvalidProduct = false;
    let cart = null;

    if (called && !error && !loading && data) {
        earnedSkypoints = data.cart.earned_skypoints;
        items = data.cart.items;
        cart = data.cart;
        const productError = items.find(item => {
            return !item.product.saleable_status['is_saleable'];
        });

        if (productError) {
            isListContainInvalidProduct = true;
        }

        items.forEach(function(item) {
            item.product.crosssell_products.forEach(function(crosssell) {
                if (
                    crosssell.__typename == 'SimpleProduct' &&
                    crosssell.stock_status == 'IN_STOCK' &&
                    crosssell.service_name.value != SERVICE_THE_TIME &&
                    items.find(product => {
                        return product.product.id == crosssell.id;
                    }) == undefined
                ) {
                    crosssellProducts.set(crosssell.id, crosssell);
                }
            });
        });

        crosssellProducts = Array.from(crosssellProducts.values());

        crosssellProducts.sort((pre, next) => {
            return new Date(next.new_from_date) - new Date(pre.new_from_date);
        });

        if (crosssellProducts.length > LIMIT_CROSSSELL_LIST) {
            crosssellProducts = crosssellProducts.slice(
                0,
                LIMIT_CROSSSELL_LIST
            );
        }
    }

    const [removeCart, { loading: isDeletingCart }] = useMutation(
        REMOVE_CART_MUTATION
    );

    const handleRemoveCart = async cartId => {
        try {
            const { data } = await removeCart({
                variables: { cartId }
            });

            if (data.isSuccess) {
                setInfo(t('cart::Empty the cart successfully.'));
                // Reset cart state, but keep cart id
                cartActions.reset();
                cartActions.getCart.receive(cartId);
            } else {
                setError(t('common::Something went wrong!'));
            }
        } catch (deleteError) {
            setError(deleteError.message);
        }
    };

    const clearCouponAndRedeemSkyPoints = useClearCouponAndRedeemSkyPoints(
        cartId
    );
    const {
        removeCoupon,
        removeRedeemSkyPoint
    } = clearCouponAndRedeemSkyPoints;

    useEffect(() => {
        const resetSkyPoint = async () => {
            if (items.length && !isRemoveCoupon) {
                await removeCoupon(cartId);
                await removeRedeemSkyPoint();
                setIsRemoveCoupon(true);
                refetch();
            }
        };

        resetSkyPoint();
    }, [
        cartId,
        removeCoupon,
        removeRedeemSkyPoint,
        items,
        isRemoveCoupon,
        refetch
    ]);

    useEffect(() => {
        if (forceRender) {
            setForceRender(false);
            refetch();
        }

        if (triggerRecollectTotals) {
            setTriggerRecollectTotals(false);
            refetch();
        }
        // Let the cart page know it is updating while we're waiting on network data.
        setIsCartUpdating(loading);
    }, [loading, forceRender, cartId, refetch, triggerRecollectTotals]);

    useEffect(() => {
        if (data) {
            updateCartIcon();
        }
    }, [data, updateCartIcon]);

    const hasItems = !!(data && data.cart.total_quantity);
    const shouldShowLoadingIndicator =
        !cartId || (called && loading && !hasItems);

    return {
        hasItems,
        isSignedIn,
        isCartUpdating,
        setIsCartUpdating,
        shouldShowLoadingIndicator,
        handleRemoveCart,
        cartId,
        isDeletingCart,
        isShowPopupConfirm,
        setShowPopupConfirm,
        forceRender,
        setForceRender,
        items,
        earnedSkypoints,
        isListContainInvalidProduct,
        prices: flattenData(data),
        cart,
        triggerRecollectTotals,
        setTriggerRecollectTotals,
        crosssellProducts,
        refetch,
        error
    };
};
