import { useLocation } from '@skp/drivers';
import { useQuery } from '@apollo/react-hooks';
import GET_PRODUCT_BY_ID from '@skp/screens/Apply/Step2/getProductById.graphql';

export const useConfirmation = ({ productId }) => {
    const location = useLocation();
    const { called, data, loading } = useQuery(GET_PRODUCT_BY_ID, {
        fetchPolicy: 'network-only',
        variables: { productId },
        skip: !location.state
    });

    const { productByID = null } = data || {};
    const product = productByID;

    const shouldShowLoadingIndicator = called && loading;

    const { applyData, applyOption, plan } = location.state || {};

    return {
        shouldShowLoadingIndicator,
        product,
        applyData,
        applyOption,
        plan
    };
};
