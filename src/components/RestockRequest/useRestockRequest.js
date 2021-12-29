import { useState, useEffect, useReducer } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { usePagination } from '@skp/hooks/usePagination';
import GET_CUSTOMER_RESTOCK_REQUEST from './getCustomerRestockRequest.graphql';
import DELETE_RESTOCK_REQUEST from './deleteRestockRequest.graphql';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { useTranslation } from 'react-i18next';

const DEFAULT_PAGE_SIZE = 9;

export const useRestockRequest = () => {
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;
    const [, { setInfo, setError }] = useNotificationContext();
    const { t } = useTranslation(['mypage', 'common']);

    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [deleteRestockRequest, { loading: isDeletingRequest }] = useMutation(
        DELETE_RESTOCK_REQUEST
    );
    const [runQuery, queryResponse] = useLazyQuery(
        GET_CUSTOMER_RESTOCK_REQUEST,
        {
            fetchPolicy: 'network-only'
        }
    );

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

    const restockRequest =
        data && data.getCustomerRestockRequest
            ? data.getCustomerRestockRequest
            : null;

    const totalPagesFromData = restockRequest
        ? restockRequest.page_info.total_pages
        : null;

    const totalCount = restockRequest ? restockRequest.total_count : 0;

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

    const reducer = (state, action) => {
        switch (action.type) {
            case 'show_confirm':
                return {
                    ...state,
                    isOpenConfirm: true,
                    product: action.product
                };
            case 'close_confirm':
                return {
                    ...state,
                    isOpenConfirm: false
                };
            default:
                throw new Error();
        }
    };

    const [{ isOpenConfirm, product }, dispatch] = useReducer(reducer, {
        product: {},
        isOpenConfirm: false
    });

    const closeConfirmation = () => dispatch({ type: 'close_confirm' });

    const openConfirmation = product =>
        dispatch({ type: 'show_confirm', product });

    const handleDeleteRequest = async () => {
        try {
            await deleteRestockRequest({
                variables: {
                    id: product.id
                }
            });

            refetch();
            closeConfirmation();
            setInfo(t('mypage::Delete restock request success.'));
        } catch (err) {
            closeConfirmation();
            setError(t('common::Something went wrong!'));

            if (process.env.NODE_ENV === 'development') {
                console.error(err);
            }
        }
    };

    return {
        handleDeleteRequest,
        isDeletingRequest,
        loading: !called || loading,
        pageControl,
        restockRequest,
        error,
        totalPagesFromData,
        currentPage,
        pageSize,
        setPageSize,
        totalCount,
        closeConfirmation,
        openConfirmation,
        isOpenConfirm
    };
};
