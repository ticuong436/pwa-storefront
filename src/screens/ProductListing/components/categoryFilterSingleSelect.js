import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from '@skp/drivers';
import { useTranslation } from 'react-i18next';
import { getFilterValue } from '@skp/screens/ProductListing/hooks/useProductFilters';

export default function CategoryFilterSingleSelect({
    categories,
    addFilterParam,
    searchFilterParams
}) {
    const { t } = useTranslation(['product_listing']);
    const currentCategoryId = getFilterValue(searchFilterParams, 'area');

    const filterCategory = {};
    categories.forEach(category => {
        if (!category.parent_id) {
            if (!filterCategory[category.id]) {
                filterCategory[category.id] = category;
                filterCategory[category.id].children = [];
            }
        } else {
            if (!filterCategory[category.parent_id]) {
                filterCategory[category.parent_id] = categories.find(
                    cate => cate.id == category.parent_id
                );
                filterCategory[category.parent_id].children = [];
            }

            filterCategory[category.parent_id].children.push(category);
        }
    });

    const selectedCategory =
        categories.find(category => category.id == currentCategoryId) || 0;

    const subSelectedId = selectedCategory.parent_id
        ? selectedCategory.parent_id
        : currentCategoryId;

    const [subSelected, setSubSelected] = useState(subSelectedId);
    useEffect(() => {
        if (subSelectedId) {
            setSubSelected(subSelectedId);
        }
    }, [subSelectedId]);

    const filterCategoryValues = useMemo(() => {
        return Object.values(filterCategory).sort(
            (a, b) => a.position - b.position
        );
    }, [filterCategory]);

    const subSelectedCategory = filterCategoryValues.find(
        v => v.id == subSelected
    );

    const handleCategoryClick = useCallback(
        category => {
            addFilterParam('area', {
                value: category.id,
                label: `${t('product_listing::Category')}: ${category.name}`
            });
        },
        [addFilterParam, t]
    );

    const handleSelectCategory = categoryId => {
        setSubSelected(categoryId);
        if (categoryId) {
            const category = filterCategoryValues.find(
                cat => cat.id == categoryId
            );
            category && handleCategoryClick(category);
        }
    };

    return (
        <>
            <div className="control search--category filter-select">
                {/* eslint-disable-next-line jsx-a11y/no-onchange */}
                <select
                    className="result-select"
                    value={subSelected}
                    onChange={e => handleSelectCategory(e.target.value)}
                >
                    <option value="0">選択してください</option>
                    {filterCategoryValues.length > 0 &&
                        filterCategoryValues.map(category =>
                            category.product_count == 0 ? (
                                false
                            ) : (
                                <option
                                    key={`ss-category-${category.id}`}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            )
                        )}
                </select>
                <ul>
                    {subSelectedCategory ? (
                        <>
                            <li
                                className="search-product-item-single"
                                key={`sub-category-${subSelectedCategory.id}`}
                            >
                                <Link
                                    to="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        handleCategoryClick(
                                            subSelectedCategory
                                        );
                                    }}
                                    className={
                                        currentCategoryId ===
                                        subSelectedCategory.id
                                            ? 'search--active'
                                            : ''
                                    }
                                    key={`category-detail-link-${
                                        subSelectedCategory.id
                                    }`}
                                >
                                    すべて
                                    <span
                                        key={`category-detail-count-${
                                            subSelectedCategory.id
                                        }`}
                                    >
                                        （{subSelectedCategory.product_count}）
                                    </span>
                                </Link>
                            </li>
                            {subSelectedCategory.children.map(childCate => (
                                <li
                                    className="search-product-item-single"
                                    key={`sub-category-${childCate.id}`}
                                >
                                    {childCate.product_count == 0 ? null : (
                                        <Link
                                            to="#"
                                            onClick={e => {
                                                e.preventDefault();
                                                handleCategoryClick(childCate);
                                            }}
                                            className={
                                                currentCategoryId ===
                                                childCate.id
                                                    ? 'search--active'
                                                    : ''
                                            }
                                            key={`category-detail-link-${
                                                childCate.id
                                            }`}
                                        >
                                            {childCate.name}
                                            <span
                                                key={`category-detail-count-${
                                                    childCate.id
                                                }`}
                                            >
                                                （{childCate.product_count}）
                                            </span>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </>
                    ) : null}
                </ul>
            </div>
        </>
    );
}
