import React, { useEffect } from 'react';
import { useSearchResult } from './useSearchResult';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import Pagination from '@skp/components/Pagination';
import ItemPerPage from '@skp/components/ItemPerPage';
import PRODUCT_SEARCH from './productSearch.graphql';
import { resourceUrl, useHistory } from '@skp/drivers';
import ProductSort from '@skp/components/ProductSort';
import Breadcrumbs from '@skp/components/Breadcrumbs';
import {
    PRODUCTS_LIST_PAGE_SIZES,
    PRODUCTS_LIST_DEFAULT_PAGE_SIZE
} from '@skp/config';
import AlertMessage from '@skp/components/AlertMessage';
import { trackViewProduct } from '@skp/libs/tracking';
import ProductListingCard from '@skp/screens/ProductListing/components/productListingCard';
import { useQueryParams } from '@skp/hooks/useQueryParams';

const SearchResult = ({ pageSize: defaultPageSize }) => {
    const { setQueryParam, getQueryParam } = useQueryParams();
    const queryPageSize = getQueryParam('page_size', defaultPageSize);
    const talonProps = useSearchResult({
        queries: {
            productSearch: PRODUCT_SEARCH
        },
        pageSize: queryPageSize
    });
    const history = useHistory();

    const {
        result,
        loading,
        pageControl,
        currentSortValue,
        setSortValue,
        searchKeyword
    } = talonProps;

    const items = result ? result.items : [];

    useEffect(() => {
        if (!items || !items.length) {
            return;
        }

        trackViewProduct(items, 'Search Results', pageControl.currentPage);
    }, [items, pageControl.currentPage, searchKeyword]);

    if (loading) {
        return <LoadingIndicator />;
    }

    const deleteKeyWord = e => {
        e.preventDefault();
        history.push(resourceUrl('/search'));
    };

    const totalCount = result ? result.total_count : 0;

    if (!totalCount) {
        return (
            <AlertMessage type="warning">Could not be located.</AlertMessage>
        );
    }

    return (
        <>
            <Breadcrumbs items={[{ title: '検索結果' }]} />
            <div className="home-search-word">
                <div className="result-search">
                    <div className="result-key">
                        <div className="result-choose">
                            <ProductSort
                                currentSortValue={currentSortValue}
                                setSortValue={setSortValue}
                            />
                        </div>
                    </div>
                </div>
                <div className="listing">
                    <div className="result-key result-keyword">
                        <div className="result-word">
                            <div className="result-key-number">
                                {searchKeyword && (
                                    <p className="result-key-link">
                                        <span>{searchKeyword}</span>
                                        <a
                                            className="result-key--close"
                                            onClick={deleteKeyWord}
                                            href="#"
                                        >
                                            ×
                                        </a>
                                    </p>
                                )}
                            </div>
                        </div>
                        <span className="result-txt">
                            検索結果{totalCount}件
                        </span>
                    </div>
                </div>
            </div>
            <div className="result-full shopping-home result-keyword-search">
                <div className="result row">
                    {items.map((product, index) => {
                        return (
                            <div
                                className="result-item col-xl-3 col-lg-3 col-md-6"
                                key={`product-listing-div-${index}`}
                            >
                                <ProductListingCard
                                    key={product.id}
                                    displayType="search"
                                    product={product}
                                    productIndex={index}
                                    listName="Search Results"
                                />
                            </div>
                        );
                    })}
                </div>
                <div className="pagination">
                    <Pagination pageControl={pageControl} />
                    <ItemPerPage
                        listItems={PRODUCTS_LIST_PAGE_SIZES}
                        pageSize={queryPageSize}
                        setPageSize={value => setQueryParam('page_size', value)}
                    />
                </div>
            </div>
        </>
    );
};

export default SearchResult;

SearchResult.defaultProps = {
    // TODO: This can be replaced by the value from `storeConfig when the PR,
    // https://github.com/magento/graphql-ce/pull/650, is released.
    pageSize: PRODUCTS_LIST_DEFAULT_PAGE_SIZE
};
