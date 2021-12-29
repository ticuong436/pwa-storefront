import { useEffect, useRef } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import GET_FEATURE_LIST from './getFeatureList.graphql';
import { usePagination } from '@skp/hooks/usePagination';
import { useQueryParams } from '@skp/hooks/useQueryParams';

export const useFeature = (pillarCode, pageSize) => {
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const firstTimeRef = useRef(true);

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    // Declare a new state variable, which we'll call "month"
    const { getQueryParam } = useQueryParams();
    const month = getQueryParam('month');

    const [runQuery, queryResponse] = useLazyQuery(GET_FEATURE_LIST, {
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

    const featureList = data && data.featureList ? data.featureList : {};

    const totalPagesFromData = featureList.page_info
        ? featureList.page_info.total_pages
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
        featureList,
        pillarInfo: data ? data.pillarInfo : {},
        error,
        loading,
        currentPage,
        totalPagesFromData,
        pageControl,
        month
    };
};
