import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMultipleCheckbox } from '@skp/screens/ProductListing/hooks/useMultipleCheckbox';
import { MULTI_LABELS_FILTER_SEPARATOR } from '@skp/screens/ProductListing/hooks/useProductFilters';

export default function WellnessFilter({
    attributes,
    addFilterParam,
    searchFilterParams
}) {
    const { t } = useTranslation(['home']);
    const {
        checkedItems,
        handleClickCheckbox,
        isChecked
    } = useMultipleCheckbox({
        searchFilterParams,
        paramKey: 'service_category'
    });

    const handleFilter = () => {
        addFilterParam('service_category', {
            value: checkedItems.map(item => item.value).join('|'),
            parsed_value: checkedItems,
            isLast: true,
            label:
                `${t('home::Service Category')}: ` +
                checkedItems
                    .map(item => item.label)
                    .join(MULTI_LABELS_FILTER_SEPARATOR)
        });
    };

    return (
        <>
            {attributes.sky_service_category && (
                <>
                    <p className="search-product--sub">
                        — {t('home::Service Category')}
                    </p>
                    {attributes.sky_service_category.map(category => (
                        <div className="control" key={category.value}>
                            <div className="exguest-checkbox">
                                <input
                                    type="checkbox"
                                    id={`filter-service-category-${
                                        category.value
                                    }`}
                                    value={category.value}
                                    checked={isChecked(category)}
                                    onChange={() =>
                                        handleClickCheckbox(category)
                                    }
                                />
                                <label
                                    htmlFor={`filter-service-category-${
                                        category.value
                                    }`}
                                >
                                    {category.label}
                                </label>
                            </div>
                        </div>
                    ))}
                </>
            )}

            <div className="dropdown-search-bottom">
                <button
                    type="button"
                    className="button-action"
                    onClick={handleFilter}
                >
                    絞り込み
                </button>
            </div>
        </>
    );
}
