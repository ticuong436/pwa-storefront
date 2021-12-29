import React from 'react';
import { useTranslation } from 'react-i18next';
import ProductBox from './productBox';
import useSpecificUserPurchaseProducts from './useSpecificUserPurchaseProducts';
import Pagination from '@skp/components/Pagination';
import { LIST_ITEM_PER_PAGE } from '@skp/utils/listItemPerpage';
import ItemPerPage from '@skp/components/ItemPerPage';
import MainPageTitle from '@skp/components/MainPageTitle';
import AlertMessage from '@skp/components/AlertMessage';
import LoadingIndicator from '@skp/components/LoadingIndicator';

const SpecificUserPurchaseProducts = () => {
    const { t } = useTranslation(['navigation', 'common', 'mypage']);
    const {
        products,
        loading,
        error,
        currentPage,
        totalPages,
        pageSize,
        setCurrentPage,
        totalCount,
        setPageSize
    } = useSpecificUserPurchaseProducts();

    if (loading) {
        return <LoadingIndicator />;
    }

    if (error) {
        return (
            <AlertMessage type="error">
                {t('common::Something went wrong!')}
            </AlertMessage>
        );
    }

    if (!totalCount) {
        return (
            <div className="mypage">
                <MainPageTitle title={t('navigation::User Purchase')} />
                <div className="col-md-12 px-0">
                    <AlertMessage type="warning">
                        {t('mypage::There is no product')}
                    </AlertMessage>
                </div>
            </div>
        );
    }

    return (
        <div className="mypage">
            <MainPageTitle title={t('navigation::User Purchase')} />
            <div className="row">
                {products &&
                    products.map(product => (
                        <div
                            className="result-item col-xl-4 col-lg-4 col-md-6 col-xs-6"
                            key={product.id}
                        >
                            <ProductBox product={product} />
                        </div>
                    ))}
            </div>
            <div className="pagination">
                <Pagination
                    pageControl={{
                        currentPage,
                        setPage: setCurrentPage,
                        totalPages
                    }}
                />
                <ItemPerPage
                    listItems={LIST_ITEM_PER_PAGE}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                />
            </div>
        </div>
    );
};

export default SpecificUserPurchaseProducts;
