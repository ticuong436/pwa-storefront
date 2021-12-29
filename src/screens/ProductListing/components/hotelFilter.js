import React from 'react';
import { useMultipleCheckbox } from '@skp/screens/ProductListing/hooks/useMultipleCheckbox';

import {
    PriceRangeFilterLabel,
    priceRangeFilterValue
} from '@skp/screens/ProductListing/hooks/useProductFilters';
import { useSingleCheckbox } from '@skp/screens/ProductListing/hooks/useSingleCheckbox';

const PILLAR_FILTER_PRICE_RANGE_TRAVEL = [
    [null, 6000],
    [6000, 12000],
    [12000, 20000],
    [20000, 30000],
    [30000, null]
];

export default function HoltelFilter({
    hotelFilters,
    addFilterParam,
    searchFilterParams
}) {
    const {
        checkedItem: checkedItemPrice,
        setCheckedItem: setcheckedItemPrice
    } = useSingleCheckbox({
        searchFilterParams,
        paramKey: 'hotel_price_range'
    });

    const {
        checkedItems: checkedItemsRating,
        handleClickCheckbox: setcheckedItemRating,
        isChecked: isCheckedRating
    } = useMultipleCheckbox({
        searchFilterParams,
        paramKey: 'rating'
    });

    const {
        checkedItems,
        handleClickCheckbox: handleClickCheckboxCategory,
        isChecked: isCheckedAmenity
    } = useMultipleCheckbox({
        searchFilterParams,
        paramKey: 'hotel_categories'
    });

    const {
        checkedItems: checkedAmenities,
        handleClickCheckbox: handleClickCheckboxAmenity,
        isChecked: isAmenityChecked
    } = useMultipleCheckbox({
        searchFilterParams,
        paramKey: 'hotel_amenities'
    });

    const handleFilter = () => {
        addFilterParam('hotel_categories', {
            value: checkedItems.map(item => item.value).join('|'),
            parsed_value: checkedItems
        });

        addFilterParam('hotel_amenities', {
            value: checkedAmenities.map(item => item.value).join('|'),
            parsed_value: checkedAmenities
        });

        addFilterParam('rating', {
            value: checkedItemsRating.map(item => item.value).join('|'),
            parsed_value: checkedItemsRating
        });

        addFilterParam('hotel_price_range', {
            value: checkedItemPrice
        });
    };

    return (
        <>
            {/* Rating */}
            <p className="search-product--sub">— 宿泊施設クラス</p>
            {hotelFilters &&
                hotelFilters.rating &&
                hotelFilters.rating.map((rating, i) => {
                    return (
                        <div className="control" key={`rating-${i}`}>
                            <div className="exguest-checkbox">
                                <input
                                    type="checkbox"
                                    name="star"
                                    id={`filter-rating-${i}`}
                                    value={rating.value}
                                    checked={isCheckedRating(rating)}
                                    onChange={() =>
                                        setcheckedItemRating(rating)
                                    }
                                />
                                <label htmlFor={`filter-rating-${i}`}>
                                    {rating.label}
                                </label>
                            </div>
                        </div>
                    );
                })}

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

            {/* Categories */}
            <p className="search-product--sub">— 施設タイプ</p>
            {hotelFilters &&
                hotelFilters.categories &&
                hotelFilters.categories.map((category, index) => {
                    return (
                        <div className="control" key={`category-id-${index}`}>
                            <div className="exguest-checkbox">
                                <input
                                    type="checkbox"
                                    id={`filter-category-id-${index}`}
                                    value={category.value}
                                    checked={isCheckedAmenity(category)}
                                    onChange={() => {
                                        handleClickCheckboxCategory(category);
                                    }}
                                />
                                <label htmlFor={`filter-category-id-${index}`}>
                                    {category.label}
                                </label>
                            </div>
                        </div>
                    );
                })}

            {/* Categories */}
            <p className="search-product--sub">— 設備とサービス</p>
            {hotelFilters &&
                hotelFilters.amenities &&
                hotelFilters.amenities.map((amenity, index) => {
                    return (
                        <div className="control" key={`amenity-id-${index}`}>
                            <div className="exguest-checkbox">
                                <input
                                    type="checkbox"
                                    id={`filter-amenity-id-${index}`}
                                    value={amenity.value}
                                    checked={isAmenityChecked(amenity)}
                                    onChange={() => {
                                        handleClickCheckboxAmenity(amenity);
                                    }}
                                />
                                <label htmlFor={`filter-amenity-id-${index}`}>
                                    {amenity.label}
                                </label>
                            </div>
                        </div>
                    );
                })}

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
