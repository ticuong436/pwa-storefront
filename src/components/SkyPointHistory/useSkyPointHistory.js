import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import GET_SKY_POINT_HISTORY from './getSkyPointHistory.graphql';
import { usePagination } from '@skp/hooks/usePagination';

export default function useSkyPointHistory() {
    const [pageSize, setPageSize] = useState(10);
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [runQuery, queryResponse] = useLazyQuery(GET_SKY_POINT_HISTORY, {
        fetchPolicy: 'no-cache'
    });

    const { loading, error, data } = queryResponse;

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

    const historySkyPoints =
        data && data.getHistorySkyPoints ? data.getHistorySkyPoints : {};

    const totalPagesFromData = historySkyPoints.page_info
        ? historySkyPoints.page_info.total_pages
        : null;
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
        historySkyPoints,
        error,
        loading,
        currentPage,
        totalPagesFromData,
        pageSize,
        setPageSize,
        pageControl
    };
}
