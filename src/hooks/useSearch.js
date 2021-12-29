import { useState, useCallback, useEffect } from 'react';
import { resourceUrl, useHistory } from '@skp/drivers';
import GET_SUGGEST_SEARCH from './suggestSearch.graphql';
import { useLazyQuery } from '@apollo/react-hooks';
import debounce from 'lodash.debounce';
import { useSiteContext } from '@skp/layouts/context/site';
import { useQueryParams } from './useQueryParams';

export const useSearch = () => {
    const [searchKeyword, setSearchKeyword] = useState('');

    const [{ isUsingGlobalSearch }] = useSiteContext();

    const [suggestSearchQuery, { data: suggestData }] = useLazyQuery(
        GET_SUGGEST_SEARCH,
        {
            fetchPolicy: 'network-only'
        }
    );

    const delayedSuggestSearch = useCallback(
        debounce(() => {
            if (!searchKeyword) {
                return;
            }

            suggestSearchQuery({ variables: { search: searchKeyword } });
        }, 400),
        [searchKeyword]
    );

    useEffect(() => {
        delayedSuggestSearch();

        return delayedSuggestSearch.cancel;
    }, [delayedSuggestSearch, searchKeyword, suggestSearchQuery]);

    const history = useHistory();
    const { setQueryParam } = useQueryParams();

    const goToSearch = useCallback(
        keyword => {
            if (isUsingGlobalSearch) {
                history.push(
                    resourceUrl(`/search?query=${encodeURIComponent(keyword)}`)
                );
            } else {
                setQueryParam('query', keyword);
            }
        },
        [history, isUsingGlobalSearch, setQueryParam]
    );

    const onSearchSubmit = useCallback(
        event => {
            // Enter key code = 13
            if (event.keyCode == 13) {
                goToSearch(searchKeyword);
            }
        },
        [goToSearch, searchKeyword]
    );

    return {
        searchKeyword,
        setSearchKeyword,
        goToSearch,
        onSearchSubmit,
        suggestSearch:
            suggestData && suggestData.suggestSearch
                ? suggestData.suggestSearch
                : {}
    };
};
