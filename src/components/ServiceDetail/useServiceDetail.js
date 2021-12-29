import { useQuery } from '@apollo/react-hooks';
import GET_CUSTOMER_SERVICE_DETAIL from './serviceDetail.graphql';

export const useServiceDetail = serviceId => {
    // Fetch the data using apollo react hooks
    const { data, error, loading } = useQuery(GET_CUSTOMER_SERVICE_DETAIL, {
        fetchPolicy: 'no-cache',
        variables: { id: serviceId }
    });

    const serviceDetail =
        data && data.getCustomerServiceDetail
            ? data.getCustomerServiceDetail
            : {};

    return {
        serviceDetail,
        error,
        loading
    };
};
