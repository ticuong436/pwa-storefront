import { useLocation, useHistory, resourceUrl } from '@skp/drivers';
import { useQuery, useMutation } from '@apollo/react-hooks';
import GET_PRODUCT_BY_ID from './getProductById.graphql';
import APPLY_VIRTUAL_PRODUCT_MUTATION from './applyVirtualProduct.graphql';
import Moment from 'moment';

export const useStep2 = ({ productId }) => {
    const { called, data, loading } = useQuery(GET_PRODUCT_BY_ID, {
        fetchPolicy: 'network-only',
        variables: { productId }
    });

    const { productByID = null } = data || {};
    const product = productByID;

    const shouldShowLoadingIndicator = called && loading;

    const [
        applyMutation,
        { loading: isApplying, error: applyError }
    ] = useMutation(APPLY_VIRTUAL_PRODUCT_MUTATION);

    const location = useLocation();

    const plan =
        product && location.state
            ? product.apply_option.plan_resource.find(({ value }) => {
                  return value == location.state.plan;
              }) || {}
            : {};

    const history = useHistory();

    const handleSubmit = async () => {
        const applyMutationVar = { productId: product.id };
        if (location.state && Object.keys(location.state).length) {
            const plan_date1 =
                location.state && location.state.plan_date1
                    ? Moment(location.state.plan_date1).format('YYYY/MM/DD')
                    : null;
            const plan_date2 =
                location.state && location.state.plan_date2
                    ? Moment(location.state.plan_date2).format('YYYY/MM/DD')
                    : null;
            const plan_date3 =
                location.state && location.state.plan_date3
                    ? Moment(location.state.plan_date3).format('YYYY/MM/DD')
                    : null;
            const state = {
                ...location.state,
                plan_date1,
                plan_date2,
                plan_date3
            };
            applyMutationVar.options = JSON.stringify(state);
        }
        const response = await applyMutation({
            variables: applyMutationVar
        });
        history.push({
            pathname: resourceUrl(`/product/${productId}/apply/confirmation`),
            state: {
                applyData: response.data.applyVirtualProduct,
                applyOption: location.state,
                plan: plan
            }
        });
    };

    return {
        shouldShowLoadingIndicator,
        product,
        handleSubmit,
        isApplying,
        applyError,
        applyOption: location.state
    };
};
