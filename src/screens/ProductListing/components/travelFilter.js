import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMultipleCheckbox } from '@skp/screens/ProductListing/hooks/useMultipleCheckbox';

import {
    MULTI_LABELS_FILTER_SEPARATOR,
    PriceRangeFilterLabel,
    priceRangeFilterValue
} from '@skp/screens/ProductListing/hooks/useProductFilters';
import { useSingleCheckbox } from '@skp/screens/ProductListing/hooks/useSingleCheckbox';

const PILLAR_FILTER_PRICE_RANGE_TRAVEL = [
    [null, 15000],
    [15001, 30000],
    [30001, 45000],
    [45001, 60000],
    [60001, null]
];

export default function TravelFilter({
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
        checkedItems,
        handleClickCheckbox,
        isChecked
    } = useMultipleCheckbox({
        searchFilterParams,
        paramKey: 'feature'
    });

    const handleFilter = () => {
        addFilterParam('feature', {
            value: checkedItems.map(item => item.value).join('|'),
            parsed_value: checkedItems,
            label:
                `${t('home::Feature')}: ` +
                checkedItems
                    .map(item => item.label)
                    .join(MULTI_LABELS_FILTER_SEPARATOR)
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
            <p className="search-product--sub">— 予算（ペア料金）</p>
            {PILLAR_FILTER_PRICE_RANGE_TRAVEL.map((range, index) => {
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
            {/* Travel Feature */}
            <p className="search-product--sub">— {t('home::Feature')}</p>
            {attributes.sky_feature &&
                attributes.sky_feature.map(feature => (
                    <div className="control" key={feature.value}>
                        <div className="exguest-checkbox">
                            <input
                                type="checkbox"
                                id={`filter-service-feature-${feature.value}`}
                                value={feature.value}
                                checked={isChecked(feature)}
                                onChange={() => handleClickCheckbox(feature)}
                            />
                            <label
                                htmlFor={`filter-service-feature-${
                                    feature.value
                                }`}
                            >
                                {feature.label}
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
