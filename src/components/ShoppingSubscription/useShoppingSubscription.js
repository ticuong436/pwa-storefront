import { useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { usePagination } from '@skp/hooks/usePagination';
import GET_SHOPPING_SUBSCRIPTIONS from './getShoppingSubscriptions.graphql';
import CANCEL_SUBSCRIPTION from './cancelSubscription.graphql';
import SKIP_SUBSCRIPTION from './skipSubscription.graphql';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { useTranslation } from 'react-i18next';

const DEFAULT_PAGE_SIZE = 9;

export const useShoppingSubscription = () => {
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const [, { setInfo, setError }] = useNotificationContext();
    const { t } = useTranslation([
        'profile',
        'common',
        'shopping_subscription'
    ]);

    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [popupType, setPopupType] = useState(null);
    const [subscriptionId, setSubscriptionId] = useState(null);

    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [cancelSubscription, { loading: isCancelSubscription }] = useMutation(
        CANCEL_SUBSCRIPTION
    );

    const [skipSubscription, { loading: isSkipSubscription }] = useMutation(
        SKIP_SUBSCRIPTION
    );
    const [runQuery, queryResponse] = useLazyQuery(GET_SHOPPING_SUBSCRIPTIONS, {
        fetchPolicy: 'network-only'
    });

    const { called, loading, error, data, refetch } = queryResponse;

    // Run the category query immediately and whenever its variable values change.
    useEffect(() => {
        runQuery({
            variables: {
                currentPage: Number(currentPage),
                onServer: false,
                pageSize: Number(pageSize)
            }
        });
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, [currentPage, pageSize, runQuery]);

    const shoppingSubscription =
        data && data.getShoppingSubscriptions
            ? data.getShoppingSubscriptions
            : null;

    const totalPagesFromData = shoppingSubscription
        ? shoppingSubscription.page_info.total_pages
        : null;

    const totalCount = shoppingSubscription
        ? shoppingSubscription.total_count
        : 0;

    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPagesFromData]);

    // If we get an error after loading we should try to reset to page 1.
    // If we continue to have errors after that, render an error message.
    useEffect(() => {
        if (error && !loading && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, error, loading, setCurrentPage]);

    const handleCancelSubscription = async id => {
        try {
            const { data } = await cancelSubscription({
                variables: { id }
            });

            if (data.success) {
                setInfo(t('profile::Cancel subscription successfully.'));
            } else {
                setError(t('common::Something went wrong!'));
            }
        } catch (deleteError) {
            setError(t('common::Something went wrong!'));
        }
        refetch();
    };

    const handleSkipSubscription = async id => {
        try {
            const { data } = await skipSubscription({
                variables: { id }
            });

            if (data.success) {
                setInfo(
                    t('shopping_subscription::Skip subscription successfully.')
                );
            } else {
                setError(t('common::Something went wrong!'));
            }
        } catch (deleteError) {
            setError(t('common::Something went wrong!'));
        }
        refetch();
    };

    return {
        handleCancelSubscription,
        isCancelSubscription,
        loading: !called || loading,
        pageControl,
        shoppingSubscription,
        error,
        totalPagesFromData,
        currentPage,
        pageSize,
        setPageSize,
        totalCount,
        isOpenPopup,
        setIsOpenPopup,
        subscriptionId,
        setSubscriptionId,
        popupType,
        setPopupType,
        handleSkipSubscription,
        isSkipSubscription
    };
};
