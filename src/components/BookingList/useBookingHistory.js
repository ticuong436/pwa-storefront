import currentCustomerBookingHistory from './currentCustomerBookingHistory.graphql';
import { usePagination } from '@skp/hooks/usePagination';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

const DEFAULT_PAGE_SIZE = 9;

export const useBookingHistory = () => {
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [
        getCurrentCustomerBookingHistory,
        { loading, error, data: bookingHistoryData }
    ] = useLazyQuery(currentCustomerBookingHistory, {
        fetchPolicy: 'network-only'
    });

    useEffect(() => {
        getCurrentCustomerBookingHistory({
            variables: {
                currentPage: Number(currentPage),
                pageSize: Number(pageSize),
                onServer: false
            }
        });
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, [currentPage, pageSize, getCurrentCustomerBookingHistory]);

    const bookingList = bookingHistoryData
        ? bookingHistoryData.getCurrentCustomerBookingHistory
        : {};

    const bookingTotalPages =
        bookingList && bookingList.page_info
            ? bookingList.page_info.total_pages
            : 0;

    useEffect(() => {
        setTotalPages(bookingTotalPages);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, bookingTotalPages]);

    return {
        loading,
        error,
        bookingItems: bookingList.items || [],
        totalCount: bookingList.total_count || 0,
        pageControl,
        currentPage,
        pageSize,
        setPageSize
    };
};
