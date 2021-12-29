import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMultipleCheckbox } from '@skp/screens/ProductListing/hooks/useMultipleCheckbox';
import {
    MULTI_LABELS_FILTER_SEPARATOR,
    PriceRangeFilterLabel,
    priceRangeFilterValue
} from '@skp/screens/ProductListing/hooks/useProductFilters';
import { useSingleCheckbox } from '@skp/screens/ProductListing/hooks/useSingleCheckbox';

const PILLAR_FILTER_PRICE_RANGE_WINEDINE = [
    [null, 8000],
    [8001, 15000],
    [15001, 25000],
    [25001, 35000],
    [35001, null]
];

export default function WineDineFilter({
    attributes,
    addFilterParam,
    searchFilterParams
}) {
    const { t } = useTranslation(['home', 'product_listing']);
    const {
        checkedItem: checkedItemPrice,
        setCheckedItem: setcheckedItemPrice
    } = useSingleCheckbox({
        searchFilterParams,
        paramKey: 'price_range'
    });

    const {
        checkedItems: checkedServiceCategories,
        handleClickCheckbox: handleClickServiceCategory,
        isChecked: isCheckedServiceCategory
    } = useMultipleCheckbox({
        searchFilterParams,
        paramKey: 'service_category'
    });
    const {
        checkedItems: checkedPlanTimes,
        handleClickCheckbox: handleClickPlanTime,
        isChecked: isCheckedPlanTime
    } = useMultipleCheckbox({
        searchFilterParams,
        paramKey: 'plan_times'
    });

    const handleFilter = () => {
        addFilterParam('service_category', {
            value: checkedServiceCategories.map(item => item.value).join('|'),
            parsed_value: checkedServiceCategories,
            label:
                `${t('home::Service Category')}: ` +
                checkedServiceCategories
                    .map(item => item.label)
                    .join(MULTI_LABELS_FILTER_SEPARATOR)
        });

        addFilterParam('plan_times', {
            value: checkedPlanTimes.map(item => item.value).join('|'),
            parsed_value: checkedPlanTimes,
            label: `${t('home::Plan Times')}: ${checkedPlanTimes
                .map(item => item.label)
                .join(MULTI_LABELS_FILTER_SEPARATOR)}`
        });

        addFilterParam('price_range', {
            value: checkedItemPrice,
            isLast: true,
            label: (
                <>
                    {t('product_listing::Price Range')}
                    {': '}
                    <PriceRangeFilterLabel
                        range={
                            checkedItemPrice != null
                                ? checkedItemPrice.split('|')
                                : ''
                        }
                    />
                </>
            )
        });
    };

    return (
        <>
            {/* Price Range */}
            <p className="search-product--sub">— 予算</p>
            {PILLAR_FILTER_PRICE_RANGE_WINEDINE.map((range, index) => {
                const targetValue = priceRangeFilterValue(range);
                return (
                    <div className="control" key={`price-range-${index}`}>
                        <div className="exguest-checkbox">
                            <input
                                type="radio"
                                name="price-range"
                                id={`filter-price-range-${index}`}
                                value={targetValue}
                                checked={targetValue == checkedItemPrice}
                                onChange={() =>
                                    setcheckedItemPrice(targetValue)
                                }
                            />
                            <label htmlFor={`filter-price-range-${index}`}>
                                <PriceRangeFilterLabel range={range} />
                            </label>
                        </div>
                    </div>
                );
            })}
            {/* Times */}
            {attributes.sky_plan_times && (
                <>
                    <p className="search-product--sub">
                        — {t('home::Plan Times')}
                    </p>

                    {attributes.sky_plan_times.map(time => (
                        <div className="control" key={time.value}>
                            <div className="exguest-checkbox">
                                <input
                                    type="checkbox"
                                    id={`filter-plan-time-${time.value}`}
                                    value={time.value}
                                    checked={isCheckedPlanTime(time)}
                                    onChange={() => handleClickPlanTime(time)}
                                />
                                <label
                                    htmlFor={`filter-plan-time-${time.value}`}
                                >
                                    {time.label}
                                </label>
                            </div>
                        </div>
                    ))}
                </>
            )}
            {/* Service Category2 */}
            <p className="search-product--sub">
                — {t('home::Service Category 2')}
            </p>
            {attributes.sky_service_category &&
                attributes.sky_service_category.map(category => (
                    <div className="control" key={category.value}>
                        <div className="exguest-checkbox">
                            <input
                                type="checkbox"
                                id={`filter-service-category-${category.value}`}
                                value={category.value}
                                checked={isCheckedServiceCategory(category)}
                                onChange={() =>
                                    handleClickServiceCategory(category)
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
