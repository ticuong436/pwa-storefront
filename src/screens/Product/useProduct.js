import { useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useGooSearchScript } from '@skp/hooks/useGooSearchScript';
import { useUserContext } from '@skp/layouts/context/user';
import { getPriceSelling } from '@skp/utils/product';
/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that
 * controls the logic for the Product Root Component.
 *
 * @kind function
 *
 * @param {object}      props
 * @param {Function}    props.mapProduct - A function for updating products to the proper shape.
 * @param {GraphQLAST}  props.query - The query to fetch a product.
 * @param {String}      props.id - The id of this product.
 *
 * @returns {object}    result
 * @returns {Bool}      result.error - Indicates a network error occurred.
 * @returns {Bool}      result.loading - Indicates the query is in flight.
 * @returns {Bool}      result.product - The product's details.
 */
export const useProduct = props => {
    const { mapProduct, query, id } = props;
    const {
        sendProductDetail,
        sendProductAddToCart,
        isScriptAppended,
        goosearchScriptLoading
    } = useGooSearchScript();
    const [{ currentUser }] = useUserContext();
    const { loading, error, data, refetch } = useQuery(query, {
        // Once we're able to remove the manual cache lookup,
        // this fetch policy can change to 'cache-and-network'.
        fetchPolicy: 'network-only',
        variables: {
            onServer: false,
            id
        }
    });

    const product = useMemo(() => {
        if (data && data.productDetail) {
            return mapProduct(data.productDetail);
        }

        // The product isn't in the cache and we don't have a response from GraphQL yet.
        return null;
    }, [data, mapProduct]);

    useEffect(() => {
        try {
            if (isScriptAppended && data) {
                const { price_selling: amount } = getPriceSelling(
                    data.productDetail,
                    currentUser.group_id
                );
                const item = `${data.productDetail.id},1,${amount}`;
                sendProductDetail(item, amount);
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.log(error);
            }
        }
    }, [sendProductDetail, data, isScriptAppended, currentUser]);

    return {
        error,
        loading,
        product,
        refetch,
        sendProductAddToCart,
        goosearchScriptLoading
    };
};
