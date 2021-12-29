import React from 'react';
import LoadingIndicator from '@skp/components/LoadingIndicator/index';
import Pagination from '@skp/components/Pagination';
import { useRestockRequest } from './useRestockRequest';
import ItemPerPage from '@skp/components/ItemPerPage';
import MainPageTitle from '@skp/components/MainPageTitle';
import { LIST_ITEM_PER_PAGE } from '@skp/utils/listItemPerpage';
import { useTranslation } from 'react-i18next';
import ProductBox from './productBox';
import AlertMessage from '@skp/components/AlertMessage';
import PopupConfirm from '@skp/components/PopupConfirm';

const RestockRequest = () => {
    const talonProps = useRestockRequest();
    const { t } = useTranslation(['mypage']);

    const {
        loading,
        pageControl,
        restockRequest,
        totalCount,
        handleDeleteRequest,
        isDeletingRequest,
        pageSize,
        setPageSize,
        closeConfirmation,
        isOpenConfirm,
        openConfirmation
    } = talonProps;

    if (loading) {
        return <LoadingIndicator />;
    }

    const { items = [] } = restockRequest || {};

    const titlePopupConfirm = (
        <p className="modal-customize__des">
            Are you sure you want to delete the restock request?
        </p>
    );

    return (
        <>
            <div className="mypage">
                <PopupConfirm
                    title={titlePopupConfirm}
                    onCancel={() => {
                        closeConfirmation();
                    }}
                    onConfirm={() => {
                        handleDeleteRequest();
                    }}
                    isLoading={isDeletingRequest}
                    isOpen={isOpenConfirm}
                />
                <MainPageTitle title={t('mypage::Restock Request List')} />
                <div className="result-full restock-container shopping-home">
                    <div className="result row">
                        {!totalCount ? (
                            <div className="col-md-12 px-0">
                                <AlertMessage type="warning">
                                    {t('mypage::There is no product')}
                                </AlertMessage>
                            </div>
                        ) : (
                            items.map(product => (
                                <div
                                    className="result-item col-xl-4 col-lg-4 col-md-6 col-xs-6"
                                    key={product.id}
                                >
                                    <ProductBox
                                        product={product}
                                        handleDeleteRequest={() =>
                                            openConfirmation(product)
                                        }
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {totalCount > 0 && (
                    <div className="pagination">
                        <Pagination pageControl={pageControl} />
                        <ItemPerPage
                            listItems={LIST_ITEM_PER_PAGE}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default RestockRequest;
