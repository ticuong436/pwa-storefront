import { GET_ITEM_COUNT_QUERY } from '@magento/venia-ui/lib/components/Header/cartTrigger.gql';
import { useLazyQuery } from '@apollo/react-hooks';

export const useUpdateCartIcon = cartId => {
    const [runQuery] = useLazyQuery(GET_ITEM_COUNT_QUERY, {
        fetchPolicy: 'network-only',
        variables: {
            cartId
        },
        skip: !cartId
    });

    return { updateCartIcon: runQuery };
};
