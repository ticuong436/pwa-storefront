import { useEffect, useMemo, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import GET_WISH_LIST from './getWishList.graphql';
import { usePagination } from '@skp/hooks/usePagination';
import { resourceUrl, useHistory, useLocation } from '@skp/drivers';

export default function useWishList() {
    const location = useLocation();
    const [pageSize, setPageSize] = useState(9);
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;
    const history = useHistory();
    const partnerType = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);

        if (searchParams.has('partner_type')) {
            return searchParams.get('partner_type');
        } else {
            return '0';
        }
    }, [location]);

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [runQuery, queryResponse] = useLazyQuery(GET_WISH_LIST, {
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
                partnerType: Number(partnerType)
            }
        });
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, [currentPage, pageSize, partnerType, runQuery]);

    const wishList = data ? data.customer.wishlist.paginatedItems.data : null;
    const totalCountItemsWishList = data
        ? data.customer.wishlist.paginatedItems.total_count
        : null;
    const totalPagesFromData = wishList
        ? data.customer.wishlist.paginatedItems.page_info.total_pages
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

    const handleFilterProduct = partnerType => {
        history.push(
            resourceUrl(`/customer/wishlist?partner_type=${partnerType}`)
        );
    };

    return {
        wishList,
        error,
        loading,
        currentPage,
        totalPagesFromData,
        pageControl,
        handleFilterProduct,
        partnerType,
        pageSize,
        setPageSize,
        totalCountItemsWishList,
        refetchWishList: refetch
    };
}
