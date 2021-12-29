import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import GET_SPECIFIC_USER_PURCHASE_PRODUCTS from './getSpecificUserPurchaseProducts.graphql';
import { usePagination } from '@skp/hooks/usePagination';
import { LIST_ITEM_PER_PAGE } from '@skp/utils/listItemPerpage';

export default function useSkyPointHistory() {
    const [pageSize, setPageSize] = useState(LIST_ITEM_PER_PAGE[0]);
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const [runQueryGetProducts, queryGetProductsResponse] = useLazyQuery(
        GET_SPECIFIC_USER_PURCHASE_PRODUCTS,
        {
            fetchPolicy: 'network-only'
        }
    );

    const { loading, error, data: responseData } = queryGetProductsResponse;

    useEffect(() => {
        runQueryGetProducts({
            variables: {
                currentPage: Number(currentPage),
                pageSize: Number(pageSize)
            }
        });
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, [currentPage, pageSize, runQueryGetProducts]);

    const productsData =
        responseData && responseData.getSpecificUserPurchaseProducts
            ? responseData.getSpecificUserPurchaseProducts
            : {};
    const totalPagesFromData = productsData.page_info
        ? productsData.page_info.total_pages
        : null;

    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPagesFromData]);

    return {
        products: productsData.items,
        loading,
        error,
        currentPage,
        totalPages,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalCount: productsData.total_count
    };
}
