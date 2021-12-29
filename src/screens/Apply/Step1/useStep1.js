import { useQuery } from '@apollo/react-hooks';
import GET_PRODUCT_BY_ID from './getProductById.graphql';
import { resourceUrl, useHistory, useLocation } from '@skp/drivers';
import { useTranslation } from 'react-i18next';

export const useStep1 = ({ productId }) => {
    const { called, data, loading } = useQuery(GET_PRODUCT_BY_ID, {
        fetchPolicy: 'network-only',
        variables: { productId }
    });

    const { t } = useTranslation(['checkout']);

    const { productByID = null } = data || {};
    const product = productByID;

    const shouldShowLoadingIndicator = called && loading;

    const history = useHistory();

    const location = useLocation();
    const state = location.state;

    const handleSubmit = values => {
        if (values.plan) {
            const planResource =
                product &&
                product.apply_option &&
                product.apply_option.plan_resource
                    ? product.apply_option.plan_resource
                    : [];
            values.plan_name =
                values.plan == 0
                    ? t('checkout::Not Requested')
                    : planResource.find(plan => plan.value == values.plan)
                          .label;
        }

        if (values.plan_child == 0) {
            values.plan_child = t('checkout::Not Requested');
        }

        if (values.plan_adult == 0) {
            values.plan_adult = t('checkout::Not Requested');
        }

        history.push({
            pathname: resourceUrl(`/product/${productId}/apply/second-step`),
            state: {
                ...state,
                ...values
            }
        });
    };

    return { shouldShowLoadingIndicator, product, handleSubmit, state };
};
