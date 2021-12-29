import React from 'react';
import handleWishListOperations from './handleWishList.gql';
import { useHandleWishList } from './useHandleWishList';
import { useUserContext } from '@skp/layouts/context/user';

const HeartWishList = props => {
    const { product, refetchWishList } = props;

    const talonProps = useHandleWishList({
        product,
        ...handleWishListOperations,
        refetchWishList
    });

    const [{ currentUser }] = useUserContext();

    const {
        addProductsToWishList,
        removeProductsFromWishList,
        isInWishList
    } = talonProps;

    if (isInWishList) {
        return (
            <a
                className="product-wishlist__link product-wishlist__link--active"
                href="#"
                onClick={e => {
                    e.preventDefault();
                    removeProductsFromWishList({
                        wishListId: currentUser.wishlist_id,
                        productsIds: [product.id]
                    });
                }}
            >
                <span className="product-wishlist__name">Add to Wish List</span>
            </a>
        );
    }

    return (
        <a
            className="product-wishlist__link"
            href="#"
            onClick={e => {
                e.preventDefault();
                addProductsToWishList({
                    wishListId: currentUser.wishlist_id,
                    wishListItems: [
                        {
                            quantity: 1,
                            sku: product.sku
                        }
                    ]
                });
            }}
        >
            <span className="product-wishlist__name">Add to Wish List</span>
        </a>
    );
};

export default HeartWishList;
