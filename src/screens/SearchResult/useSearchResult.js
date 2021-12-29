import { useEffect, useRef } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { useLocation, useHistory } from '@skp/drivers';
import { usePagination } from '@skp/hooks/usePagination';
import { getSearchParam } from '@magento/peregrine/lib/hooks/useSearchParam';
import { useGooSearchScript } from '@skp/hooks/useGooSearchScript';

export const useSearchResult = props => {
    const {
        queries: { productSearch },
        pageSize
    } = props;

    const { sendSearchResult, isScriptAppended } = useGooSearchScript();

    // Set up pagination.
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    // get the URL query parameters.
    const location = useLocation();
    const { search } = location;
    const searchKeyword = getSearchParam('query', location);
    const currentSortValue = getSearchParam('sort', location);

    const history = useHistory();
    const setSortValue = sortValue => {
        const queryParams = new URLSearchParams(search);
        if (sortValue) {
            queryParams.set('sort', sortValue);
        } else {
            queryParams.delete('sort');
        }

        history.push({ search: queryParams.toString() });
    };

    // Keep track of the search terms so we can tell when they change.
    const previousSearch = useRef(search);

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [
        runProductSearchQuery,
        { called: searchCalled, loading: searchLoading, data }
    ] = useLazyQuery(productSearch, {
        fetchPolicy: 'network-only'
    });

    useEffect(() => {
        const [sortAttribute = '', sortDirection = ''] = currentSortValue.split(
            ':'
        );
        runProductSearchQuery({
            variables: {
                currentPage: Number(currentPage),
                search: searchKeyword,
                pageSize: Number(pageSize),
                sort: sortAttribute
                    ? { [sortAttribute]: sortDirection.toUpperCase() }
                    : null
            }
        });

        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, [
        currentPage,
        searchKeyword,
        runProductSearchQuery,
        search,
        currentSortValue,
        pageSize
    ]);

    // Set the total number of pages whenever the data changes.
    useEffect(() => {
        const totalPagesFromData = data
            ? data.productSearch.page_info.total_pages
            : null;

        setTotalPages(totalPagesFromData);

        return () => {
            setTotalPages(null);
        };
    }, [data, setTotalPages]);

    useEffect(() => {
        try {
            if (isScriptAppended && data)
                sendSearchResult(
                    searchKeyword,
                    currentPage,
                    data.productSearch.total_count
                );
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.log(error);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, sendSearchResult, isScriptAppended]);

    // Reset the current page back to one (1) when the search string
    // or sort criteria
    // or page size changed
    useEffect(() => {
        // We don't want to compare page value.
        const prevSearch = new URLSearchParams(previousSearch.current);
        const nextSearch = new URLSearchParams(search);
        prevSearch.delete('page');
        nextSearch.delete('page');

        if (prevSearch.toString() !== nextSearch.toString()) {
            // The search term changed.
            setCurrentPage(1);
            // And update the ref.
            previousSearch.current = search;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, pageSize]);

    return {
        result: data ? data.productSearch : null,
        loading: !searchCalled || searchLoading,
        pageControl,
        currentSortValue,
        setSortValue,
        pageSize,
        searchKeyword
    };
};
