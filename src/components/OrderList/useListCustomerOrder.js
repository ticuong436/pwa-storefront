import { useState, useEffect } from 'react';
import listCustomerOrderOperations from './listCustomerOrder.graphql';
import { useLazyQuery } from '@apollo/react-hooks';
import { usePagination } from '@skp/hooks/usePagination';

const DEFAULT_PAGE_SIZE = 9;

export const useListCustomerOrder = () => {
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [runQuery, queryResponse] = useLazyQuery(
        listCustomerOrderOperations,
        {
            fetchPolicy: 'network-only'
        }
    );

    const { loading, error, data } = queryResponse;

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

    const customerOrder = data ? data.getCurrentCustomerOrders : {};
    const orderItems = customerOrder.items || [];
    const totalCount = customerOrder ? customerOrder.total_count : 0;
    const totalPagesFromData = customerOrder
        ? customerOrder.page_info
            ? customerOrder.page_info.total_pages
            : 0
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

    return {
        orderItems,
        pageControl,
        currentPage,
        pageSize,
        setPageSize,
        totalCount,
        error,
        loading
    };
};
