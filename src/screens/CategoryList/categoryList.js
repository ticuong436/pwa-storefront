import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link, resourceUrl } from '@skp/drivers';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import classNames from 'classnames';
import { ChevronDown } from 'react-feather';
import GET_CATEGORIES_QUERY from './getCategories.graphql';
import { getErrorMessage } from '@skp/utils/graphqlError';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import PageTitleForPillar from '@skp/components/PageTitleForPillar';
import TopBanner from '@skp/screens/ProductListing/components/topBanner';

const sortPosition = (a, b) => {
    if (a.position < b.position) {
        return -1;
    }
    if (a.position > b.position) {
        return 1;
    }
    return 0;
};

function CategoryPart({ id, name, pillarCode, productCount, children }) {
    const [showCollapse, setShowCollapse] = useState(false);
    const collapseContainClass = classNames('category-list__sub collapse', {
        ['show']: showCollapse
    });
    const collapseExpandClass = classNames(
        'category-list__link cursor-pointer',
        {
            ['collapsed']: !showCollapse
        }
    );

    return (
        <li className="category-list__item">
            <span
                className={collapseExpandClass}
                onClick={e => {
                    e.preventDefault();
                    setShowCollapse(showCollapse => !showCollapse);
                }}
            >
                <Link
                    className="category-list__name"
                    to={resourceUrl(`${pillarCode}/category/${id}`)}
                >
                    {name}
                    <span className="category-list__number">
                        ({productCount})
                    </span>
                </Link>
                <span className="category-list__icon">
                    <ChevronDown />
                </span>
            </span>
            <ul className={collapseContainClass}>{children}</ul>
        </li>
    );
}

const CategoryList = ({ pillarCode }) => {
    // Fetch the data using apollo react hooks
    const { data, error, loading } = useQuery(GET_CATEGORIES_QUERY, {
        variables: { pillarCode },
        fetchPolicy: 'no-cache'
    });

    // Loading and error states can detected using values returned from
    // the useQuery hook
    if (loading) {
        // Default content rendered while the query is running
        return <LoadingIndicator />;
    }

    if (error) {
        return <ErrorView>{getErrorMessage(error)}</ErrorView>;
    }

    const { category: topCategory } = data.pillarInfo;

    const listCategories = topCategory.children
        .sort(sortPosition)
        .filter(category => category.products.total_count > 0)
        .map(category => {
            const {
                id,
                name,
                products: { total_count: productCount }
            } = category;

            const subCategoryHTML = category.children
                .sort(sortPosition)
                .map(subCategory => {
                    const {
                        id: subCategoryId,
                        name: subCategoryName,
                        products: { total_count: subProductCount }
                    } = subCategory;
                    return subProductCount == 0 ? null : (
                        <li
                            className="category-list__item"
                            key={`sub-category-${subCategoryId}`}
                        >
                            <Link
                                to={resourceUrl(
                                    `${pillarCode}/category/${subCategoryId}`
                                )}
                                className="category-list__link"
                            >
                                <span className="category-list__name">
                                    {subCategoryName}
                                    <span className="category-list__number">
                                        ({subProductCount})
                                    </span>
                                </span>
                            </Link>
                        </li>
                    );
                });

            return (
                <CategoryPart
                    key={`category-${id}`}
                    id={id}
                    pillarCode={pillarCode}
                    name={name}
                    productCount={productCount}
                >
                    {subCategoryHTML}
                </CategoryPart>
            );
        });

    return (
        <>
            <PageTitleForPillar
                pillarCode={pillarCode}
                subTitle="Category List"
            />
            <TopBanner bannerUrl={data.pillarInfo.image} />
            <div className="container">
                <div className="main-content">
                    <div className="shopping-info row">
                        <div className="shopping-des col-md-12">
                            <h2 className="shopping--title">カテゴリ一覧</h2>
                            <ul className="category-list__menu" id="accordion">
                                {listCategories}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoryList;
