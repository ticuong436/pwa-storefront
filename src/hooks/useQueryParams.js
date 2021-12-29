import { useMemo } from 'react';
import { useHistory, useLocation } from '@skp/drivers';

export const useQueryParams = () => {
    const location = useLocation();
    const history = useHistory();

    const params = useMemo(() => new URLSearchParams(location.search), [
        location.search
    ]);

    const getQueryParam = (key, defaultValue = '') =>
        params.get(key) || defaultValue;

    const setQueryParam = (key, value) => {
        const currentValue = getQueryParam(key);
        if (currentValue != value) {
            if (value !== undefined && value !== null && value !== '') {
                params.set(key, value);
            } else {
                params.delete(key);
            }

            history.push({ ...location, search: params.toString() });
        }
    };

    return {
        getQueryParam,
        setQueryParam: setQueryParam,
        queryParams: params
    };
};
