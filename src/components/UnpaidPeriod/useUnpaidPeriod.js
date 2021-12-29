import { useMutation, useQuery } from '@apollo/react-hooks';
import { useEffect, useReducer } from 'react';
import unpaidOperations from './payUnpaidPeriod.gql';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { useUserContextQuery } from '@skp/layouts/context/user/context';
import { getErrorMessage } from '@skp/utils/graphqlError';
import { useTranslation } from 'react-i18next';

const ACTION_SELECT_CARD = 'select_card';
const ACTION_USER_UNPAID = 'user_unpaid';
const ACTION_PAID = 'user_paid';

export const useUnpaidPerod = () => {
    const { t } = useTranslation(['common']);
    const { queries, mutations } = unpaidOperations;
    const {
        loading: loadingCustomer,
        data: dataCustomer,
        error: errorLoadingCustomer
    } = useQuery(queries.getCurrentCustomer, {
        fetchPolicy: 'network-only'
    });

    const { userContextFetchDetails } = useUserContextQuery();
    const [, { setInfo, setError, reset }] = useNotificationContext();

    const { customer = {} } = dataCustomer || {};

    const [payUnpaidPeriod, { loading: submitting }] = useMutation(
        mutations.payUnpaidPeriod
    );

    const handleSubmit = async () => {
        try {
            reset();

            if (!unpaid.selectedCard) {
                throw new Error(t('common::You must select card first!'));
            }
            const input = {
                card_id: unpaid.selectedCard.id
            };

            const response = await payUnpaidPeriod({
                variables: input
            });

            if (response.data.isSuccess) {
                setInfo(t('common::You have paid successfully!'));
                await userContextFetchDetails();
            } else {
                setError(t('common::Something went wrong!'));
            }
        } catch (error) {
            setError(getErrorMessage(error.message));
        }
    };

    const handlePayUnpaid = async cardId => {
        try {
            reset();

            const response = await payUnpaidPeriod({
                variables: { card_id: cardId }
            });

            if (response.data.isSuccess) {
                setInfo(t('common::You have paid successfully!'));
                await userContextFetchDetails();
            } else {
                setError(t('common::Something went wrong!'));
            }
        } catch (error) {
            setError(getErrorMessage(error.message));
        }
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case ACTION_SELECT_CARD:
                return { ...state, selectedCard: action.payload };
            case ACTION_USER_UNPAID:
                return {
                    ...state,
                    isUnpaid: action.payload.isUnpaid,
                    unpaidMemberFee: action.payload.unpaidMemberFee
                };
            case ACTION_PAID:
                return {
                    selectedCard: null,
                    isUnpaid: false,
                    unpaidMemberFee: null
                };

            default:
                state;
        }
    };

    const [unpaid, setUnpaid] = useReducer(reducer, {
        selectedCard: null,
        isUnpaid: false,
        unpaidMemberFee: null
    });

    useEffect(() => {
        if (!loadingCustomer && customer.is_inactive) {
            setUnpaid({
                type: ACTION_USER_UNPAID,
                payload: {
                    isUnpaid: true,
                    unpaidMemberFee: customer.unpaidMemberFee
                }
            });
        }
    }, [loadingCustomer, customer]);

    useEffect(() => {
        if (errorLoadingCustomer) {
            setError(getErrorMessage(errorLoadingCustomer));
        }
    }, [errorLoadingCustomer, setError]);

    return {
        unpaid,
        setSelectCard: card => {
            setUnpaid({ type: ACTION_SELECT_CARD, payload: card });
        },
        loadingCustomer,
        submitting,
        handleSubmit,
        handlePayUnpaid
    };
};
