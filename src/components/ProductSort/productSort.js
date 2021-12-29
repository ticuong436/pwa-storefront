import React from 'react';
import { availableSortMethods, optionSortValue } from '.';
import { useQueryParams } from '@skp/hooks/useQueryParams';

const ProductSort = () => {
    const { getQueryParam, setQueryParam } = useQueryParams();

    return (
        <div className="control filter-select">
            {/* eslint-disable-next-line jsx-a11y/no-onchange */}
            <select
                className="result-select"
                defaultValue={getQueryParam('sort')}
                onChange={e => setQueryParam('sort', e.target.value)}
            >
                {availableSortMethods.map((sortItem, index) => (
                    <option key={index} value={optionSortValue(sortItem)}>
                        {sortItem.text}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ProductSort;
