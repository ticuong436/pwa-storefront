import { useEffect, useRef } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import GET_UPDATEINFO_LIST from './getPillarUpdateInfoList.graphql';
import { usePagination } from '@skp/hooks/usePagination';
import { useQueryParams } from '@skp/hooks/useQueryParams';

export const usePillarUpdateInfo = (pillarCode, pageSize) => {
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const firstTimeRef = useRef(true);

    // Declare a new state variable, which we'll call "month"
    const { getQueryParam } = useQueryParams();
    const month = getQueryParam('month');

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [runQuery, queryResponse] = useLazyQuery(GET_UPDATEINFO_LIST, {
        fetchPolicy: 'no-cache',
        variables: { pillarCode, month: month }
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

    const updateInfoList =
        data && data.updateInfoList ? data.updateInfoList : {};

    const totalPagesFromData = updateInfoList.page_info
        ? updateInfoList.page_info.total_pages
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

    useEffect(() => {
        if (firstTimeRef.current) {
            firstTimeRef.current = false;
            return;
        }

        if (currentPage !== 1) {
            setCurrentPage(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [month, pageSize]);

    return {
        updateInfoList,
        pillarInfo: data ? data.pillarInfo : {},
        error,
        loading,
        currentPage,
        totalPagesFromData,
        pageControl,
        month
    };
};
