import { useEffect, useState } from 'react';
import { getFilterValue } from './useProductFilters';

export const useSingleCheckbox = ({ searchFilterParams, paramKey }) => {
    const [checkedItem, setCheckedItem] = useState(null);

    useEffect(() => {
        const currentFilterValue = getFilterValue(searchFilterParams, paramKey);
        if (currentFilterValue) {
            setCheckedItem(currentFilterValue);
        } else {
            setCheckedItem(null);
        }
    }, [paramKey, searchFilterParams]);

    return {
        checkedItem,
        setCheckedItem
    };
};
