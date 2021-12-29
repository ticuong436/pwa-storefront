import { useQuery } from '@apollo/react-hooks';
import GET_CUSTOMER_ORDER_DETAIL from './orderDetail.graphql';

export const useOrderDetail = orderId => {
    // Fetch the data using apollo react hooks
    const { data, error, loading } = useQuery(GET_CUSTOMER_ORDER_DETAIL, {
        fetchPolicy: 'no-cache',
        variables: { id: orderId }
    });

    const orderDetail = data
        ? data.getCustomerOrder
            ? data.getCustomerOrder
            : {}
        : {};

    return {
        orderDetail,
        error,
        loading
    };
};
