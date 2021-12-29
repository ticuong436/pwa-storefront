import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const RoomSort = ({ onClickSortOption, showSort, totalCount }) => {
    const { t } = useTranslation(['hotel']);

    const sortSelectOption = {
        'Rank DESC': '{"sort_field":"rank", "sort_direction":"desc"}',
        // 'Rank ASC': '{"sort_field":"rank", "sort_direction":"asc"}',
        'Rating DESC': '{"sort_field":"rating", "sort_direction":"desc"}',
        // 'Rating ASC': '{"sort_field":"rating", "sort_direction":"asc"}',
        'Name ASC': '{"sort_field":"name", "sort_direction":"asc"}',
        'Name DESC': '{"sort_field":"name", "sort_direction":"desc"}'
    };

    const [sortCondition, setSortCondition] = useState(
        sortSelectOption['Rating DESC']
    );

    const sortSelectOptionHTML = Object.keys(sortSelectOption).map(
        (label, index) => {
            return (
                <option key={index} value={sortSelectOption[label]}>
                    {t(`hotel::${label}`)}
                </option>
            );
        }
    );

    return (
        <>
            {showSort && totalCount > 0 && (
                <div className="filter-select">
                    <div className="control member-select">
                        {/* eslint-disable-next-line jsx-a11y/no-onchange */}
                        <select
                            className="ex-result-select"
                            name="list"
                            onChange={e => {
                                setSortCondition(e.target.value);
                                onClickSortOption(e.target.value);
                            }}
                            defaultValue={sortCondition}
                        >
                            {sortSelectOptionHTML}
                        </select>
                    </div>
                </div>
            )}
        </>
    );
};

export default RoomSort;
