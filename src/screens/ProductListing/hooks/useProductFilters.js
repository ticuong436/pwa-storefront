import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryParams } from '@skp/hooks/useQueryParams';
import { useQuery } from '@apollo/react-hooks';
import GET_PRODUCT_FILTERS from '@skp/screens/ProductListing/graphql/productFilters.graphql';
import { useTranslation } from 'react-i18next';
import PriceFilterLabel from '@skp/screens/ProductListing/components/priceFilterLabel';
import { resourceUrl, useHistory, useLocation } from '@skp/drivers';
import { PILLAR_CODE, SERVICE_CODE } from '@skp/config';

export const MULTI_LABELS_FILTER_SEPARATOR = '　';

export const priceRangeFilterValue = range => {
    if (range[0] === null) {
        return '|' + range[1];
    }

    if (range[1] === null) {
        return range[0] + '|';
    }

    return range[0] + '|' + range[1];
};

export const PriceRangeFilterLabel = ({ range }) => {
    return (
        <>
            {range[0] && <PriceFilterLabel value={Number(range[0])} />}
            {' ～ '}
            {range[1] && <PriceFilterLabel value={Number(range[1])} />}
        </>
    );
};

export const getFilterValue = (params, key, defaultValue = undefined) => {
    return params[key] ? params[key].value : defaultValue;
};

export const useProductFilters = ({
    pillarCode,
    serviceCode,
    categoryId,
    isPillarHome = false
}) => {
    const { t } = useTranslation(['home', 'product_listing']);

    const { data } = useQuery(GET_PRODUCT_FILTERS, {
        variables: {
            pillar: pillarCode,
            // Only pass service code to non shopping pillar to get product count of categories filter by service
            serviceCode:
                pillarCode != PILLAR_CODE.shopping && pillarCode != PILLAR_CODE.estore ? serviceCode : undefined,
            categoryId
        },
        fetchPolicy: 'no-cache',
        skip: !pillarCode && !categoryId
    });

    const { productFilters = {} } = data || {};

    const history = useHistory();
    const location = useLocation();

    const goToProductListingByPillar = useCallback(
        params => {
            history.push({
                pathname: resourceUrl(`/${pillarCode}/listing`),
                search: params || location.search
            });
        },
        [history, location.search, pillarCode]
    );

    const { setQueryParam, getQueryParam, queryParams } = useQueryParams();
    const [searchFilterParams, setSearchFilterParams] = useState({});
    const addFilterParam = useCallback(
        (key, params, setQuery = true) => {
            if (setQuery) {
                setQueryParam(key, params.value);
            }
            setSearchFilterParams(oldParams => {
                if (oldParams[key] && oldParams[key].value == params.value) {
                    return oldParams;
                }
                return {
                    ...oldParams,
                    ...{ [key]: params }
                };
            });

            if (
                (isPillarHome || serviceCode == SERVICE_CODE.hotels) &&
                params.isLast
            ) {
                goToProductListingByPillar(queryParams.toString());
            }
        },
        [
            goToProductListingByPillar,
            isPillarHome,
            queryParams,
            serviceCode,
            setQueryParam
        ]
    );

    const removeFilterParam = useCallback(
        (key, isQuery = true) => {
            if (isQuery) {
                setQueryParam(key, '');
                setSearchFilterParams(oldParams => {
                    const params = { ...oldParams };
                    delete params[key];
                    return params;
                });
            } else {
                goToProductListingByPillar();
            }
        },
        [setQueryParam, goToProductListingByPillar]
    );

    const querySearch = getQueryParam('query');
    useEffect(() => {
        if (!querySearch) {
            if (searchFilterParams.query) {
                removeFilterParam('query');
            }
            return;
        }

        addFilterParam('query', {
            value: querySearch,
            isLast: true,
            label: `${t('product_listing::Keyword')}: ${querySearch}`
        });
    }, [
        addFilterParam,
        querySearch,
        removeFilterParam,
        searchFilterParams.query,
        t
    ]);

    //
    // Gift Wrapping
    //
    const queryGiftWrapping = getQueryParam('gift_wrapping');
    useEffect(() => {
        if (!queryGiftWrapping) {
            if (searchFilterParams.gift_wrapping) {
                removeFilterParam('gift_wrapping');
            }
            return;
        }

        addFilterParam('gift_wrapping', {
            value: queryGiftWrapping,
            label: t('home::Available for gift wrapping')
        });
    }, [
        addFilterParam,
        queryGiftWrapping,
        removeFilterParam,
        searchFilterParams.gift_wrapping,
        t
    ]);

    //
    // Good Review
    //
    const queryGoodReview = getQueryParam('good_review');
    useEffect(() => {
        if (!queryGoodReview) {
            if (searchFilterParams.good_review) {
                removeFilterParam('good_review');
            }
            return;
        }

        addFilterParam('good_review', {
            value: queryGoodReview,
            label: t('home::Have good review')
        });
    }, [
        addFilterParam,
        queryGoodReview,
        removeFilterParam,
        searchFilterParams.good_review,
        t
    ]);

    //
    // Price Range
    //
    const queryPriceRange = getQueryParam('price_range');
    useEffect(() => {
        if (!queryPriceRange) {
            if (searchFilterParams.price_range) {
                removeFilterParam('price_range');
            }
            return;
        }
        const priceRange = queryPriceRange.split('|');

        addFilterParam('price_range', {
            value: queryPriceRange,
            label: (
                <>
                    {t('product_listing::Price Range')}
                    {': '}
                    <PriceRangeFilterLabel range={priceRange} />
                </>
            )
        });
    }, [
        addFilterParam,
        queryPriceRange,
        removeFilterParam,
        searchFilterParams.price_range,
        t
    ]);

    //
    // Hotel Rating
    //
    const queryRating = getQueryParam('rating');
    useEffect(() => {
        if (!queryRating) {
            if (searchFilterParams.rating) {
                removeFilterParam('rating');
            }
            return;
        }
    }, [queryRating, removeFilterParam, searchFilterParams.rating]);

    //
    // Hotel Rating
    //
    const queryHotelPriceRange = getQueryParam('hotel_price_range');
    useEffect(() => {
        if (!queryHotelPriceRange) {
            if (searchFilterParams.hotel_price_range) {
                removeFilterParam('hotel_price_range');
            }
            return;
        }
    }, [
        queryHotelPriceRange,
        removeFilterParam,
        searchFilterParams.hotel_price_range
    ]);

    //
    // Hotel Categories
    //
    const queryHotelCategories = getQueryParam('hotel_categories');
    useEffect(() => {
        if (!queryHotelCategories) {
            if (searchFilterParams.hotel_categories) {
                removeFilterParam('hotel_categories');
            }
            return;
        }
    }, [
        queryHotelCategories,
        removeFilterParam,
        searchFilterParams.hotel_categories
    ]);

    //
    // Hotel Amenities
    //
    const queryHotelAmenities = getQueryParam('hotel_amenities');
    useEffect(() => {
        if (!queryHotelAmenities) {
            if (searchFilterParams.hotel_amenities) {
                removeFilterParam('hotel_amenities');
            }
            return;
        }
    }, [
        queryHotelAmenities,
        removeFilterParam,
        searchFilterParams.hotel_amenities
    ]);

    //
    // Plan Times
    //
    const queryPlanTimes = getQueryParam('plan_times', '');
    useEffect(() => {
        if (!queryPlanTimes) {
            if (searchFilterParams.plan_times) {
                removeFilterParam('plan_times');
            }
            return;
        }

        if (
            !productFilters.attributes ||
            !productFilters.attributes.sky_plan_times
        ) {
            return;
        }

        const selectedValues = queryPlanTimes.split('|');
        const selectedItems = productFilters.attributes.sky_plan_times.filter(
            item => selectedValues.indexOf(item.value) !== -1
        );
        if (!selectedItems.length) {
            return;
        }

        addFilterParam('plan_times', {
            value: queryPlanTimes,
            parsed_value: selectedItems,
            label: `${t('home::Plan Times')}: ${selectedItems
                .map(item => item.label)
                .join(MULTI_LABELS_FILTER_SEPARATOR)}`
        });
    }, [
        addFilterParam,
        productFilters.attributes,
        queryPlanTimes,
        removeFilterParam,
        searchFilterParams.plan_times,
        t
    ]);

    //
    // Category
    //
    const selectedCategory = useMemo(() => {
        if (!productFilters.categories || !productFilters.categories.length) {
            return null;
        }

        return productFilters.categories.find(
            category => category.id == categoryId
        );
    }, [categoryId, productFilters.categories]);

    useEffect(() => {
        if (!categoryId || !selectedCategory) {
            return;
        }

        addFilterParam(
            'category_id',
            {
                value: categoryId,
                label: `${t('product_listing::Category')}: ${
                    selectedCategory.name
                }`,
                isQuery: false
            },
            false
        );
    }, [addFilterParam, categoryId, selectedCategory, t]);

    const queryFeature = getQueryParam('feature');
    useEffect(() => {
        if (!queryFeature) {
            if (searchFilterParams.feature) {
                removeFilterParam('feature');
            }
            return;
        }

        if (
            !productFilters.attributes ||
            !productFilters.attributes.sky_feature
        ) {
            return;
        }

        const selectedValues = queryFeature.split('|');
        const selectedItems = productFilters.attributes.sky_feature.filter(
            serviceCategory =>
                selectedValues.indexOf(serviceCategory.value) !== -1
        );
        if (!selectedItems.length) {
            return;
        }

        let prefix = '';
        if (pillarCode == PILLAR_CODE.travel) {
            prefix = t('home::Feature');
        } else if (pillarCode == PILLAR_CODE.winedine) {
            prefix = t('home::Service Category 1');
        }

        addFilterParam('feature', {
            value: queryFeature,
            parsed_value: selectedItems,
            label: `${prefix}: ${selectedItems
                .map(item => item.label)
                .join(MULTI_LABELS_FILTER_SEPARATOR)}`
        });
    }, [
        addFilterParam,
        pillarCode,
        productFilters.attributes,
        queryFeature,
        removeFilterParam,
        searchFilterParams.feature,
        t
    ]);

    //
    // Service Category
    //
    const queryServiceCategory = getQueryParam('service_category');
    useEffect(() => {
        if (!queryServiceCategory) {
            if (searchFilterParams.service_category) {
                removeFilterParam('service_category');
            }
            return;
        }

        if (
            !productFilters.attributes ||
            !productFilters.attributes.sky_service_category
        ) {
            return;
        }

        const selectedValues = queryServiceCategory.split('|');
        const selectedItems = productFilters.attributes.sky_service_category.filter(
            serviceCategory =>
                selectedValues.indexOf(serviceCategory.value) !== -1
        );
        if (!selectedItems.length) {
            return;
        }

        let prefix = '';
        if (pillarCode == PILLAR_CODE.wellness) {
            prefix = t('home::Service Category');
        } else if (pillarCode == PILLAR_CODE.winedine) {
            prefix = t('home::Service Category 2');
        }

        addFilterParam('service_category', {
            value: queryServiceCategory,
            parsed_value: selectedItems,
            label: `${prefix}: ${selectedItems
                .map(item => item.label)
                .join(MULTI_LABELS_FILTER_SEPARATOR)}`
        });
    }, [
        addFilterParam,
        pillarCode,
        productFilters.attributes,
        queryServiceCategory,
        removeFilterParam,
        searchFilterParams.service_category,
        t
    ]);

    //
    // Category area
    //
    const queryArea = getQueryParam('area');
    useEffect(() => {
        if (!queryArea) {
            if (searchFilterParams.area) {
                removeFilterParam('area');
            }
            return;
        }

        if (!productFilters.categories || !productFilters.categories.length) {
            return;
        }

        const selectedArea = productFilters.categories.find(
            category => category.id == queryArea
        );

        addFilterParam('area', {
            value: selectedArea.id,
            isLast: true,
            label: `${t('product_listing::Category')}: ${selectedArea.name}`
        });
    }, [
        addFilterParam,
        removeFilterParam,
        queryArea,
        searchFilterParams.area,
        productFilters.categories,
        t
    ]);

    //
    // Shopping - Variety
    //
    const queryShoppingVariety = getQueryParam('sky_info_shp_variety');
    useEffect(() => {
        if (!queryShoppingVariety) {
            if (searchFilterParams.sky_info_shp_variety) {
                removeFilterParam('sky_info_shp_variety');
            }
            return;
        }

        if (
            !productFilters.attributes ||
            !productFilters.attributes.sky_info_shp_variety
        ) {
            return;
        }

        const selectedValues = queryShoppingVariety.split('|');
        const selectedItems = productFilters.attributes.sky_info_shp_variety.filter(
            item => selectedValues.indexOf(item.value) !== -1
        );
        if (!selectedItems.length) {
            return;
        }

        addFilterParam('sky_info_shp_variety', {
            value: queryShoppingVariety,
            parsed_value: selectedItems,
            label: `${t('product_listing::Variety')}: ${selectedItems
                .map(item => item.label)
                .join(MULTI_LABELS_FILTER_SEPARATOR)}`
        });
    }, [
        addFilterParam,
        productFilters.attributes,
        queryShoppingVariety,
        removeFilterParam,
        searchFilterParams.sky_info_shp_variety,
        t
    ]);

    //
    // Shopping - Taste
    //
    const queryShoppingTaste = getQueryParam('sky_info_shp_taste');
    useEffect(() => {
        if (!queryShoppingTaste) {
            if (searchFilterParams.sky_info_shp_taste) {
                removeFilterParam('sky_info_shp_taste');
            }
            return;
        }

        if (
            !productFilters.attributes ||
            !productFilters.attributes.sky_info_shp_taste
        ) {
            return;
        }

        const selectedValues = queryShoppingTaste.split('|');
        const selectedItems = productFilters.attributes.sky_info_shp_taste.filter(
            item => selectedValues.indexOf(item.value) !== -1
        );
        if (!selectedItems.length) {
            return;
        }

        addFilterParam('sky_info_shp_taste', {
            value: queryShoppingTaste,
            parsed_value: selectedItems,
            label: `${t('product_listing::Taste')}: ${selectedItems
                .map(item => item.label)
                .join(MULTI_LABELS_FILTER_SEPARATOR)}`
        });
    }, [
        addFilterParam,
        productFilters.attributes,
        queryShoppingTaste,
        removeFilterParam,
        searchFilterParams.sky_info_shp_taste,
        t
    ]);

    return {
        services: productFilters.services || [],
        timeEvents: productFilters.time_events || [],
        categories: productFilters.categories || [],
        features: productFilters.features || [],
        attributes: productFilters.attributes || {},
        hotelFilters: productFilters.hotel_filters || {},
        searchFilterParams,
        addFilterParam,
        removeFilterParam
    };
};
