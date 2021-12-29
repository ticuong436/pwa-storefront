import { useCallback, useEffect, useRef, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import SEARCH_HOTELS from './graphql/searchHotels.graphql';
import debounce from 'lodash.debounce';
import SUGGEST_HOTELS from './graphql/suggestHotels.graphql';
import Moment from 'moment';

export const useHotelListing = ({ defaultPageSize, searchFilterParams }) => {
    const [sortCondition, setSortContition] = useState(null);
    const [currentCloudSearchPage, setCurrentCloudSearchPage] = useState(1);

    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [hotels, setHotels] = useState([]);

    const formApiRef = useRef();
    const [roomsInput, setRoomsInput] = useState([
        { adults: 2, children_and_ages: [] }
    ]);

    const [runQuery, { data, loading: isSearching, called }] = useLazyQuery(
        SEARCH_HOTELS,
        {
            fetchPolicy: 'network-only'
        }
    );

    const handleSubmitSearch = useCallback(
        (values, pageNumber) => {
            setRoomsInput(roomsInput);
            runQuery({
                variables: {
                    keyword: values.keyword,
                    page: pageNumber ? pageNumber : 1,
                    pageSize: pageSize,
                    checkInDate: Moment(values.checkInDate).format(
                        'YYYY-MM-DD'
                    ),
                    checkOutDate: Moment(values.checkOutDate).format(
                        'YYYY-MM-DD'
                    ),
                    rooms: roomsInput,
                    sortField: JSON.parse(sortCondition)
                        ? JSON.parse(sortCondition).sort_field
                        : null,
                    sortDirection: JSON.parse(sortCondition)
                        ? JSON.parse(sortCondition).sort_direction
                        : null,
                    rating: searchFilterParams.rating
                        ? searchFilterParams.rating.value
                        : null,
                    price_range: searchFilterParams.hotel_price_range
                        ? searchFilterParams.hotel_price_range.value
                        : null,
                    categories: searchFilterParams.hotel_categories
                        ? searchFilterParams.hotel_categories.value
                        : null,
                    amenities: searchFilterParams.hotel_amenities
                        ? searchFilterParams.hotel_amenities.value
                        : null
                }
            });
        },
        [
            roomsInput,
            runQuery,
            pageSize,
            sortCondition,
            searchFilterParams.rating,
            searchFilterParams.hotel_price_range,
            searchFilterParams.hotel_categories,
            searchFilterParams.hotel_amenities
        ]
    );

    const handleLoadMore = useCallback(() => {
        if (formApiRef && formApiRef.current) {
            handleSubmitSearch(
                formApiRef.current.getValues(),
                currentCloudSearchPage + 1
            );
        }
    }, [currentCloudSearchPage, handleSubmitSearch]);

    useEffect(() => {
        if (
            formApiRef &&
            formApiRef.current &&
            formApiRef.current.getValue('keyword')
        ) {
            setCurrentCloudSearchPage(1);
            setHotels([]);
            handleSubmitSearch(formApiRef.current.getValues());
        }
    }, [handleSubmitSearch, searchFilterParams, sortCondition]);

    useEffect(() => {
        if (data && data.hotelSearch) {
            setHotels([
                ...hotels,
                ...(data && data.hotelSearch ? data.hotelSearch.items : [])
            ]);
            setCurrentCloudSearchPage(data.hotelSearch.current_search_cursor);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, setHotels]);

    const [suggestedKeywords, setSuggestedKeywords] = useState([]);
    const [cancelSuggestion, setCancelSuggestion] = useState(true);
    const [suggestSearchQuery, { data: suggestData }] = useLazyQuery(
        SUGGEST_HOTELS,
        {
            fetchPolicy: 'network-only'
        }
    );

    useEffect(() => {
        setSuggestedKeywords(
            suggestData && suggestData.hotels ? suggestData.hotels : []
        );
    }, [suggestData]);

    const delayedSuggestSearch = useCallback(
        debounce(keyword => {
            if (cancelSuggestion || !keyword) {
                setSuggestedKeywords([]);
                return;
            }

            suggestSearchQuery({
                variables: { keyword: keyword, size: 5 }
            });
        }, 400),
        [cancelSuggestion]
    );

    const onInputKeyword = useCallback(
        keyword => {
            setCancelSuggestion(false);
            delayedSuggestSearch(keyword);
        },
        [delayedSuggestSearch]
    );

    const onClickSuggestedKeyword = keyword => {
        formApiRef.current.setValue('keyword', keyword);
        setCancelSuggestion(true);
        setSuggestedKeywords([]);
    };

    const onClickSortOption = sortCondition => {
        setSortContition(sortCondition);
    };

    return {
        formApiRef,
        roomsInput,
        setRoomsInput,
        isSearching,
        hotels,
        suggestedKeywords,
        pageSize,
        setPageSize,
        onInputKeyword,
        onClickSuggestedKeyword,
        handleSubmitSearch,
        onClickSortOption,
        handleLoadMore,
        hasMore: data && data.hotelSearch && data.hotelSearch.has_more,
        setHotels,
        setCurrentCloudSearchPage,
        searchApiCalled: called
    };
};
