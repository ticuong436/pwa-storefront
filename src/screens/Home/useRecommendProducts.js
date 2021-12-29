import { useQuery } from '@apollo/react-hooks';
import recomemdProductsOperations from './recommendProducts.gql';

export const useRecommendProducts = () => {
    const { queries } = recomemdProductsOperations;
    const { productsOfRecommendQuery } = queries;

    // Fetch the data using apollo react hooks
    const { data, loading } = useQuery(productsOfRecommendQuery, {
        fetchPolicy: 'network-only'
    });

    const { productsOfRecommend = [] } = data || {};

    return {
        data: productsOfRecommend,
        loading
    };
};
