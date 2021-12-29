import { useMutation } from '@apollo/react-hooks';
import { useState, useEffect } from 'react';
import { useNotificationContext } from '@skp/layouts/context/notification';

export const useHandleWishList = props => {
    const { mutations, product, refetchWishList } = props;
    const [isInWishList, setIsInWishList] = useState('');

    const [, { setError }] = useNotificationContext();

    useEffect(() => {
        setIsInWishList(product.is_in_wish_list);
    }, [product.is_in_wish_list]);

    const [addProductsToWishListMutation] = useMutation(
        mutations.addProductsToWishList
    );

    const [removeProductsFromWishListMutation] = useMutation(
        mutations.removeProductFromWishList
    );

    const addProductsToWishList = async input => {
        try {
            const { data } = await addProductsToWishListMutation({
                variables: {
                    wishListId: input.wishListId,
                    wishListItems: input.wishListItems
                }
            });

            if (!data.addProductsToWishlist.user_errors.length) {
                setIsInWishList(true);
            }
        } catch (e) {
            setError(e.message);
        }
    };

    const removeProductsFromWishList = async input => {
        try {
            const { data } = await removeProductsFromWishListMutation({
                variables: {
                    wishListId: input.wishListId,
                    productsIds: input.productsIds
                }
            });

            if (
                !data.removeProductsFromWishlistByProductsIds.user_errors.length
            ) {
                setIsInWishList(false);

                if (refetchWishList) {
                    refetchWishList();
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    return {
        addProductsToWishList,
        removeProductsFromWishList,
        isInWishList
    };
};
