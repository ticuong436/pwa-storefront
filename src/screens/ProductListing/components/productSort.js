import React, { useState } from 'react';
import {
    availableSortMethods,
    availableTheTimeSortMethods,
    optionSortValue
} from '@skp/components/ProductSort';
import { useQueryParams } from '@skp/hooks/useQueryParams';

const ProductSort = ({ isTheTimePage }) => {
    let sortMethods = availableSortMethods;
    if (isTheTimePage) {
        sortMethods = availableTheTimeSortMethods;
    }

    const { setQueryParam, getQueryParam } = useQueryParams();
    const currentSortValue = getQueryParam('sort');
    const currentSort =
        sortMethods.find(
            sortItem => currentSortValue == optionSortValue(sortItem)
        ) || sortMethods[0];
    const [showingSort, setShowingSort] = useState(false);

    return (
        <>
            <span
                className="sort-by__name dropdown-toggle"
                onClick={() => setShowingSort(showingSort => !showingSort)}
            >
                {currentSort.text}
            </span>
            <div
                className={`sort-by__menu dropdown-menu dropdown-menu-right ${
                    showingSort ? 'show' : ''
                }`}
            >
                <ul className="sort-by__list">
                    {sortMethods.map((sortItem, index) => (
                        <li className="sort-by__item" key={index}>
                            <a
                                className="sort-by__link"
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    setQueryParam(
                                        'sort',
                                        optionSortValue(sortItem)
                                    );
                                    setShowingSort(false);
                                }}
                            >
                                {sortItem.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default ProductSort;
