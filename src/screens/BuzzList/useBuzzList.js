import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import GET_BUZZ_LIST from './getBuzzList.graphql';
import { usePagination } from '@skp/hooks/usePagination';
import { resourceUrl, useHistory, useParams } from '@skp/drivers';

export default function useWishList() {
    const DEFAULT_PAGE_SIZE = 30;
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;
    const history = useHistory();
    const { category } = useParams();
    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [runQuery, queryResponse] = useLazyQuery(GET_BUZZ_LIST, {
        fetchPolicy: 'no-cache'
    });

    const { loading, error, data, refetch } = queryResponse;

    // Run the category query immediately and whenever its variable values change.
    useEffect(() => {
        runQuery({
            variables: {
                currentPage: Number(currentPage),
                onServer: false,
                pageSize: Number(pageSize),
                category: category
            }
        });
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, [category, currentPage, pageSize, runQuery]);

    const buzzList = data ? data.getBuzzList.data : null;
    const totalCountBuzzList = data ? data.getBuzzList.total_count : null;
    const totalPagesFromData = buzzList
        ? data.getBuzzList.page_info.total_pages
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

    const handleFilterBuzzList = category => {
        if (category) {
            history.push(resourceUrl(`/buzz/${category}`));
        } else {
            history.push(resourceUrl(`/buzz`));
        }
    };

    return {
        buzzList,
        error,
        loading,
        currentPage,
        totalPagesFromData,
        pageControl,
        handleFilterBuzzList,
        category,
        totalCountBuzzList,
        refetchBuzzList: refetch,
        pageSize,
        setPageSize
    };
}
