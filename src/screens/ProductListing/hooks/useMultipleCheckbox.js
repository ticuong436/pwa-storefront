import { useEffect, useState } from 'react';

export const useMultipleCheckbox = ({ searchFilterParams, paramKey }) => {
    const [checkedItems, setCheckedItems] = useState([]);

    useEffect(() => {
        if (searchFilterParams[paramKey]) {
            setCheckedItems(searchFilterParams[paramKey].parsed_value);
        } else {
            setCheckedItems([]);
        }
    }, [paramKey, searchFilterParams]);

    const handleClickCheckbox = checkboxItem => {
        setCheckedItems(prevCheckedItems => {
            const selectedItem = prevCheckedItems.find(
                item => item.value == checkboxItem.value
            );
            if (selectedItem) {
                return prevCheckedItems.filter(
                    item => item.value != selectedItem.value
                );
            }

            const newItems = [...prevCheckedItems];
            newItems.push(checkboxItem);
            return newItems;
        });
    };

    const isChecked = checkboxItem =>
        !!checkedItems.find(item => item.value == checkboxItem.value);

    return {
        checkedItems,
        handleClickCheckbox,
        isChecked
    };
};
