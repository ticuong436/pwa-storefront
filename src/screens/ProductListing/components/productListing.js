import React, { useEffect, useRef } from 'react';
import Pagination from '@skp/components/Pagination';
import ProductListingCard from './productListingCard';
import ProductListingListItem from './productListingListItem';
import { useLazyQuery } from '@apollo/react-hooks';
import { usePagination } from '@skp/hooks/usePagination';
import GET_PRODUCTS from '@skp/screens/ProductListing/graphql/getProducts.graphql';
import { useQueryParams } from '@skp/hooks/useQueryParams';
import { getErrorMessage } from '@skp/utils/graphqlError';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import {
    PRODUCTS_LIST_DEFAULT_PAGE_SIZE,
    PRODUCTS_LIST_PAGE_SIZES,
    PILLAR_CODE,
    SERVICE_THE_TIME
} from '@skp/config';
import ItemPerPage from '@skp/components/ItemPerPage';
import ProductSort from './productSort';
import { getFilterValue } from '@skp/screens/ProductListing/hooks/useProductFilters';
import { useGooSearchScript } from '@skp/hooks/useGooSearchScript';
import { useTranslation } from 'react-i18next';
import FeatureBanner from './featureBanner';
import ShoppingFilter from './shoppingFilter';
import { trackViewProduct, trackViewPromo } from '@skp/libs/tracking';

const SearchFilterParamTags = ({ params, removeFilterParam, totalCount }) => {
    const { t } = useTranslation(['product_listing']);
    return (
        <div className="listing">
            <div className="result-key result-keyword">
                <div className="result-word">
                    <div className="result-key-number">
                        {Object.keys(params).map((paramKey, index) => {
                            const param = params[paramKey];
                            return (
                                <p key={index} className="result-key-link">
                                    <span>{param.label || param.value}</span>
                                    <a
                                        className="result-key--close cursor-pointer"
                                        onClick={e => {
                                            e.preventDefault();
                                            removeFilterParam(
                                                paramKey,
                                                param.isQuery
                                            );
                                        }}
                                    >
                                        ×
                                    </a>
                                </p>
                            );
                        })}
                    </div>
                </div>
                <span className="result-txt">
                    {t('product_listing::Found {{total}} products', {
                        total: totalCount
                    })}
                </span>
            </div>
        </div>
    );
};

const ProductListing = ({
    pillarCode,
    service = {},
    timeEvent = {},
    pageSize: defaultPageSize,
    searchFilterParams,
    addFilterParam,
    removeFilterParam,
    category = {},
    feature = {}
}) => {
    const { id: categoryId } = category;
    const { id: timeEventId } = timeEvent;
    const { id: featureId, name: featureName } = feature;
    const { serviceCode, name: serviceName } = service;
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const firstTimeRef = useRef(true);
    const scrollRef = useRef(null);

    const { setQueryParam, getQueryParam } = useQueryParams();
    const { sendSearchResult, isScriptAppended } = useGooSearchScript();

    const querySort = getQueryParam('sort', '');
    const queryPageSize = getQueryParam('page_size', defaultPageSize);

    const timeEventDefaultPageSize = 100;

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [runQuery, queryResponse] = useLazyQuery(GET_PRODUCTS, {
        fetchPolicy: 'network-only'
    });

    const { data = {}, error } = queryResponse;

    const searchKeyword = getFilterValue(searchFilterParams, 'query');

    useEffect(() => {
        const priceRange =
            getFilterValue(searchFilterParams, 'price_range') || '';
        const [minPrice, maxPrice] = priceRange.split('|');
        const filters = {
            pillar_name: pillarCode,
            category_id:
                categoryId || getFilterValue(searchFilterParams, 'area'),
            service_name: serviceCode,
            event_id: timeEventId,
            feature_id: featureId,
            sky_gift_enabled:
                getFilterValue(searchFilterParams, 'gift_wrapping') === 'true'
                    ? true
                    : undefined,
            good_review:
                getFilterValue(searchFilterParams, 'good_review') === 'true'
                    ? true
                    : undefined,
            sky_plan_times: getFilterValue(searchFilterParams, 'plan_times'),
            sky_feature: getFilterValue(searchFilterParams, 'feature'),
            sky_service_category: getFilterValue(
                searchFilterParams,
                'service_category'
            ),
            sky_info_shp_variety: getFilterValue(
                searchFilterParams,
                'sky_info_shp_variety'
            ),
            sky_info_shp_taste: getFilterValue(
                searchFilterParams,
                'sky_info_shp_taste'
            ),
            price_range:
                minPrice || maxPrice
                    ? { min: Number(minPrice), max: Number(maxPrice) }
                    : undefined
        };

        const [sortAttribute = '', sortDirection = ''] = querySort.split(':');

        runQuery({
            variables: {
                search: searchKeyword,
                currentPage: Number(currentPage),
                filters,
                pageSize:
                    (timeEventId && !querySort) || featureId
                        ? timeEventDefaultPageSize
                        : Number(queryPageSize),
                sort: sortAttribute
                    ? { [sortAttribute]: sortDirection.toUpperCase() }
                    : null
            }
        });

        if (!firstTimeRef.current && scrollRef.current) {
            const yOffset = -190;
            const y =
                scrollRef.current.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset;

            window.scrollTo({ top: y });
        }
    }, [
        categoryId,
        currentPage,
        featureId,
        pillarCode,
        queryPageSize,
        querySort,
        runQuery,
        searchFilterParams,
        searchKeyword,
        serviceCode,
        timeEventId
    ]);

    useEffect(() => {
        if (data && data.products) {
            setTotalPages(data.products.page_info.total_pages);
        }

        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, data]);

    let productListName = `Pillar: ${pillarCode}`;

    if (searchKeyword) {
        productListName = 'Search Results';
    }

    if (categoryId) {
        productListName = `Category: ${categoryId}`;
    }

    if (serviceName) {
        productListName = `Service: ${serviceName}`;
    }

    if (timeEventId) {
        productListName = `Time Event: ${timeEventId}`;
    }

    useEffect(() => {
        if (
            !data ||
            !data.products ||
            !data.products.items ||
            !data.products.items.length
        ) {
            return;
        }

        if (featureId) {
            trackViewPromo(featureId, featureName);
        }

        trackViewProduct(data.products.items, productListName, currentPage);
    }, [
        categoryId,
        currentPage,
        data,
        featureId,
        featureName,
        pillarCode,
        productListName,
        searchKeyword,
        serviceCode,
        serviceName,
        timeEventId
    ]);

    useEffect(() => {
        if (data && data.products && isScriptAppended) {
            const categoryId = getFilterValue(
                searchFilterParams,
                'category_id'
            );
            const search = getFilterValue(searchFilterParams, 'query', '');

            const category = categoryId
                ? `c-${categoryId}`
                : featureId
                ? `f-${featureId}`
                : '';

            if (category) {
                sendSearchResult(
                    search,
                    currentPage,
                    data.products.total_count,
                    category
                );
            } else if (search) {
                sendSearchResult(
                    search,
                    currentPage,
                    data.products.total_count,
                    category
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isScriptAppended]);

    // Reset current page when filter changed
    useEffect(() => {
        /**
         * Do not reset page for the first time
         * e.g. case:
         * 1. Go to shopping listing
         * 2. Filter by price
         * 3. Go to page 3
         * 4. Go to product detail
         * 5. Click browser back button => Should keep page 3
         */
        if (firstTimeRef.current) {
            firstTimeRef.current = false;
            return;
        }

        if (currentPage !== 1) {
            setCurrentPage(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchFilterParams, queryPageSize]);

    if (error) {
        return <ErrorView>{getErrorMessage(error)}</ErrorView>;
    }

    const { items = [] } = data.products || {};
    const totalCount = data.products ? data.products.total_count : 0;

    const isInTimeEventOrFeaturePage = timeEventId || featureId;

    return (
        <>
            {Object.keys(searchFilterParams).length > 0 && (
                <SearchFilterParamTags
                    params={searchFilterParams}
                    removeFilterParam={removeFilterParam}
                    totalCount={totalCount}
                />
            )}
            <div ref={scrollRef} className="result-key justify-content-between">
                <div className="filter-sort">
                    {pillarCode === PILLAR_CODE.shopping && (
                        <ShoppingFilter
                            addFilterParam={addFilterParam}
                            removeFilterParam={removeFilterParam}
                            searchFilterParams={searchFilterParams}
                            serviceCode={serviceCode}
                        />
                    )}

                    {pillarCode === PILLAR_CODE.estore && (
                        <ShoppingFilter
                            addFilterParam={addFilterParam}
                            removeFilterParam={removeFilterParam}
                            searchFilterParams={searchFilterParams}
                            serviceCode={serviceCode}
                        />
                    )}

                </div>
                <div className="filter-sort">
                    <span className="filter-sort__label">並び替え</span>
                    <div className="sort-by dropdown">
                        <ProductSort
                            isTheTimePage={
                                serviceCode == SERVICE_THE_TIME || timeEventId
                            }
                        />
                    </div>
                </div>
            </div>
            <div
                className={`result-full ${
                    pillarCode && pillarCode != PILLAR_CODE.shopping && pillarCode != PILLAR_CODE.estore
                        ? 'mlisting'
                        : 'shopping-home'
                }`}
            >
                <div
                    className={`result ${
                        pillarCode && pillarCode != PILLAR_CODE.shopping && pillarCode != PILLAR_CODE.estore
                            ? ''
                            : 'row'
                    }`}
                >
                    {pillarCode && pillarCode != PILLAR_CODE.shopping && pillarCode != PILLAR_CODE.estore
                        ? items.map((product, index) => (
                              <div className="mlisting-list" key={product.id}>
                                  <ProductListingListItem
                                      product={product}
                                      productIndex={index}
                                      listName={productListName}
                                      timeEvent={timeEvent}
                                      feature={feature}
                                      category={category}
                                  />
                              </div>
                          ))
                        : items.map((product, index) => (
                              <div
                                  className="result-item col-lg-4 col-md-6"
                                  key={product.id}
                              >
                                  <ProductListingCard
                                      product={product}
                                      productIndex={index}
                                      listName={productListName}
                                      timeEvent={timeEvent}
                                      feature={feature}
                                      category={category}
                                  />
                              </div>
                          ))}
                </div>
                <div className="pagination">
                    <div className="pagination-count">
                        {totalCount > 0 && <span>{totalCount} Items</span>}
                    </div>
                    {!isInTimeEventOrFeaturePage && (
                        <Pagination pageControl={pageControl} />
                    )}
                    {!isInTimeEventOrFeaturePage && totalCount > 0 && (
                        <ItemPerPage
                            listItems={PRODUCTS_LIST_PAGE_SIZES}
                            pageSize={queryPageSize}
                            setPageSize={value =>
                                setQueryParam('page_size', value)
                            }
                        />
                    )}
                </div>
                <FeatureBanner pillarCode={pillarCode} />
            </div>
        </>
    );
};

export default ProductListing;

ProductListing.defaultProps = {
    // TODO: This can be replaced by the value from `storeConfig when the PR,
    // https://github.com/magento/graphql-ce/pull/650, is released.
    pageSize: PRODUCTS_LIST_DEFAULT_PAGE_SIZE
};
