import gql from 'graphql-tag';

const ADD_PRODUCTS_TO_WISH_LIST = gql`
    mutation addProductsToWishList(
        $wishListId: ID!
        $wishListItems: [WishlistItemInput!]!
    ) {
        addProductsToWishlist(
            wishlistId: $wishListId
            wishlistItems: $wishListItems
        ) {
            user_errors {
                code
                message
            }
            wishlist {
                id
            }
        }
    }
`;

const REMOVE_PRODUCTS_FROM_WISH_LIST = gql`
    mutation removeProductFromWishList($wishListId: ID!, $productsIds: [ID!]!) {
        removeProductsFromWishlistByProductsIds(
            wishlistId: $wishListId
            productsIds: $productsIds
        ) {
            user_errors {
                code
                message
            }
            wishlist {
                id
            }
        }
    }
`;

export default {
    mutations: {
        addProductsToWishList: ADD_PRODUCTS_TO_WISH_LIST,
        removeProductFromWishList: REMOVE_PRODUCTS_FROM_WISH_LIST
    }
};
