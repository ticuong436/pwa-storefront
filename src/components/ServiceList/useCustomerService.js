import { useState, useEffect } from 'react';
import listCustomerServiceOperations from './listCustomerService.graphql';
import { useLazyQuery } from '@apollo/react-hooks';
import { usePagination } from '@skp/hooks/usePagination';

const DEFAULT_PAGE_SIZE = 9;

export const useCustomerService = () => {
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
        listCustomerServiceOperations,
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

    const customerService = data ? data.getCurrentCustomerOrders : {};
    const serviceItems = customerService.items || [];
    const totalCount = customerService ? customerService.total_count : 0;
    const totalPagesFromData = customerService
        ? customerService.page_info
            ? customerService.page_info.total_pages
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
        serviceItems,
        pageControl,
        currentPage,
        pageSize,
        setPageSize,
        totalCount,
        error,
        loading
    };
};
