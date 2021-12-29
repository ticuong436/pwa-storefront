import React, { useState, useMemo } from 'react';
import { Link, resourceUrl } from '@skp/drivers';
import classNames from 'classnames';
import classes from '@skp/screens/ProductListing/styles/filterPanel.css';
import { useTranslation } from 'react-i18next';

function CategoryPart({ category, pillarCode, categoryId, t }) {
    const childIds = category.children.map(childCate => childCate.id);
    const [showCollapse, setShowCollapse] = useState(
        childIds.includes(categoryId) || categoryId == category.id
    );
    const collapseContainClass = classNames('search-product-list', {
        ['d-none']: !showCollapse
    });

    const collapseExpandClass = classNames(
        'search-product--sub cursor-pointer',
        {
            ['show']: showCollapse
        }
    );

    return (
        <li className="search-product--sub">
            <span
                className={collapseExpandClass}
                key={`category-middle-collapse-${category.id}`}
                onClick={e => {
                    e.preventDefault();
                    setShowCollapse(showCollapse => !showCollapse);
                }}
            >
                <span
                    className={
                        categoryId === category.id ? 'search--active' : ''
                    }
                    key={`category-middle-link-${category.id}`}
                >
                    {category.name}
                </span>
                <span
                    key={`category-middle-span-${category.id}`}
                    className={`position-relative cursor-pointer float-right ${
                        classes.expand
                    } ${showCollapse ? '' : classes.collapsed}`}
                />
            </span>
            <ul className={collapseContainClass}>
                <li className="search-product-item">
                    <Link
                        to={resourceUrl(
                            `${pillarCode}/category/${category.id}`
                        )}
                        className={
                            categoryId === category.id ? 'search--active' : ''
                        }
                    >
                        {t('product_listing::ALL')}
                        <span>（{category.product_count}）</span>
                    </Link>
                </li>
                {category.children.map(childCate =>
                    childCate.product_count == 0 ? null : (
                        <li
                            className="search-product-item"
                            key={`sub-category-${childCate.id}`}
                        >
                            <Link
                                to={resourceUrl(
                                    `${pillarCode}/category/${childCate.id}`
                                )}
                                className={
                                    categoryId === childCate.id
                                        ? 'search--active'
                                        : ''
                                }
                                key={`category-detail-link-${childCate.id}`}
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
                        </li>
                    )
                )}
            </ul>
        </li>
    );
}

export default function CategoryFilter({ categories, pillarCode, categoryId }) {
    const { t } = useTranslation(['product_listing']);
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

    const sortedfilterCategory = useMemo(() => {
        return Object.values(filterCategory).sort(
            (a, b) => a.position - b.position
        );
    }, [filterCategory]);

    return (
        <>
            <ul className="search-product-list">
                {sortedfilterCategory.length > 0 &&
                    sortedfilterCategory.map(category =>
                        category.product_count == 0 ? (
                            false
                        ) : (
                            <CategoryPart
                                key={`category-${category.id}`}
                                pillarCode={pillarCode}
                                category={category}
                                categoryId={categoryId}
                                t={t}
                            />
                        )
                    )}
            </ul>
        </>
    );
}
