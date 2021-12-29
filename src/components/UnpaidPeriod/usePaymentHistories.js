import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PAYMENT_HISTORY_QUERY from './getPaymentHistories.graphql';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { useTranslation } from 'react-i18next';

export const usePaymentHistories = () => {
    const { t } = useTranslation(['common']);
    const {
        loading: loadingHistories,
        data,
        error: errorLoadingHistories,
        fetchMore
    } = useQuery(PAYMENT_HISTORY_QUERY, {
        fetchPolicy: 'no-cache'
    });

    const [, { setError }] = useNotificationContext();

    const [changePageLoading, setChangePageLoading] = useState(false);

    const [historiesData, setHistoriesData] = useState({
        histories: null,
        current_page: 1,
        has_more: false
    });

    useEffect(() => {
        const { paymentHistories = {} } = data || {};
        setHistoriesData(paymentHistories);
        if (errorLoadingHistories) {
            setError(t('common::Something went wrong'));
        }
    }, [data, errorLoadingHistories, setError, t]);

    const changePage = async (currentPage, next = true) => {
        try {
            setChangePageLoading(true);
            let response;
            if (next) {
                response = await fetchMore({
                    variables: {
                        pageSize: null,
                        currentPage: currentPage + 1,
                        startingAfter:
                            historiesData.histories[
                                historiesData.histories.length - 1
                            ].id
                    },
                    updateQuery: (_, { fetchMoreResult }) => {
                        return fetchMoreResult;
                    }
                });
            } else {
                response = await fetchMore({
                    variables: {
                        pageSize: null,
                        currentPage: currentPage - 1,
                        endingBefore: historiesData.histories[0].id
                    },
                    updateQuery: (_, { fetchMoreResult }) => {
                        return fetchMoreResult;
                    }
                });
            }
            const { data, error } = response;
            const { paymentHistories = {} } = data || {};
            setHistoriesData(paymentHistories);
            if (error) {
                setError('Something went wrong');
            }
        } catch (error) {
            console.log(error);
            setError('Something went wrong');
        }
        setChangePageLoading(false);
    };

    return {
        loadingHistories,
        errorLoadingHistories,
        changePageLoading,
        ...historiesData,
        changePage
    };
};
