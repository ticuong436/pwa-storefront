import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMultipleCheckbox } from '@skp/screens/ProductListing/hooks/useMultipleCheckbox';

import {
    MULTI_LABELS_FILTER_SEPARATOR,
    PriceRangeFilterLabel,
    priceRangeFilterValue
} from '@skp/screens/ProductListing/hooks/useProductFilters';
import { useSingleCheckbox } from '@skp/screens/ProductListing/hooks/useSingleCheckbox';

const PILLAR_FILTER_PRICE_RANGE_SHOPPING = [
    [null, 3000],
    [3001, 5000],
    [5001, 7000],
    [7001, 10000],
    [10001, null]
];

export default function ShoppingFilterSide({
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
        checkedItems: checkedItemsVariety,
        handleClickCheckbox: handleClickVariety,
        isChecked: isCheckedVariety
    } = useMultipleCheckbox({
        searchFilterParams,
        paramKey: 'sky_info_shp_variety'
    });
    const {
        checkedItems: checkedItemsTaste,
        handleClickCheckbox: handleClickTaste,
        isChecked: isCheckedTaste
    } = useMultipleCheckbox({
        searchFilterParams,
        paramKey: 'sky_info_shp_taste'
    });

    const handleFilter = () => {
        if (attributes.sky_info_shp_variety) {
            addFilterParam('sky_info_shp_variety', {
                value: checkedItemsVariety.map(item => item.value).join('|'),
                parsed_value: checkedItemsVariety,
                label:
                    `${t('product_listing::Variety')}: ` +
                    checkedItemsVariety
                        .map(item => item.label)
                        .join(MULTI_LABELS_FILTER_SEPARATOR)
            });
        }

        if (attributes.sky_info_shp_taste) {
            addFilterParam('sky_info_shp_taste', {
                value: checkedItemsTaste.map(item => item.value).join('|'),
                parsed_value: checkedItemsTaste,
                label:
                    `${t('product_listing::Taste')}: ` +
                    checkedItemsTaste
                        .map(item => item.label)
                        .join(MULTI_LABELS_FILTER_SEPARATOR)
            });
        }

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
            <p className="search-product--sub">— 価格帯</p>
            {PILLAR_FILTER_PRICE_RANGE_SHOPPING.map((range, index) => {
                const targetValue = priceRangeFilterValue(range);
                return (
                    <div className="control" key={`price-range-${index}`}>
                        <div className="exguest-checkbox">
                            <input
                                type="radio"
                                id={`filter-price-range-${index}`}
                                name="price-range"
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

            {/* Variety */}
            {attributes.sky_info_shp_variety && (
                <>
                    <p className="search-product--sub">
                        — {t('product_listing::Variety')}
                    </p>
                    {attributes.sky_info_shp_variety.map((variety, index) => (
                        <div
                            className="control"
                            key={`filter-service-variety-div-${index}`}
                        >
                            <div className="exguest-checkbox">
                                <input
                                    type="checkbox"
                                    id={`filter-service-variety-${index}`}
                                    value={variety.value}
                                    checked={isCheckedVariety(variety)}
                                    onChange={() => handleClickVariety(variety)}
                                />
                                <label
                                    htmlFor={`filter-service-variety-${index}`}
                                >
                                    {variety.label}
                                </label>
                            </div>
                        </div>
                    ))}
                </>
            )}

            {/* Taste */}
            {attributes.sky_info_shp_taste && (
                <>
                    <p className="search-product--sub">
                        — {t('product_listing::Taste')}
                    </p>
                    {attributes.sky_info_shp_taste.map((taste, index) => (
                        <div
                            className="control"
                            key={`filter-taste-div-${index}`}
                        >
                            <div className="exguest-checkbox">
                                <input
                                    type="checkbox"
                                    id={`filter-taste-${index}`}
                                    value={taste.value}
                                    checked={isCheckedTaste(taste)}
                                    onChange={() => handleClickTaste(taste)}
                                />
                                <label htmlFor={`filter-taste-${index}`}>
                                    {taste.label}
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
