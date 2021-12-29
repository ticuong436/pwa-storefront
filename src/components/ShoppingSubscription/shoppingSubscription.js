import React from 'react';
import { useTranslation } from 'react-i18next';
import { LIST_ITEM_PER_PAGE } from '@skp/utils/listItemPerpage';
import AlertMessage from '@skp/components/AlertMessage';
import ItemPerPage from '@skp/components/ItemPerPage';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import MainPageTitle from '@skp/components/MainPageTitle';
import Pagination from '@skp/components/Pagination';
import ProductBox from './productBox';
import { useShoppingSubscription } from './useShoppingSubscription';
import PopupConfirm from '@skp/components/PopupConfirm';

const DELETE_ACTION = 'DELETE';
const SKIP_ACTION = 'SKIP';

const ShoppingSubscription = () => {
    const talonProps = useShoppingSubscription();
    const { t } = useTranslation(['mypage', 'shopping_subscription']);

    const {
        handleCancelSubscription,
        isCancelSubscription,
        loading,
        pageControl,
        shoppingSubscription,
        totalCount,
        pageSize,
        setPageSize,
        isOpenPopup,
        setIsOpenPopup,
        subscriptionId,
        setSubscriptionId,
        popupType,
        setPopupType,
        handleSkipSubscription,
        isSkipSubscription
    } = talonProps;

    if (loading || isCancelSubscription || isSkipSubscription) {
        return <LoadingIndicator />;
    }

    const { items = [] } = shoppingSubscription || {};
    const deleteTitlePopupConfirm = (
        <p className="modal-customize__des">
            {t('mypage::Are you sure to cancel subscription?')}
        </p>
    );

    const skipTitlePopupConfirm = (
        <p className="modal-customize__des">
            {t('shopping_subscription::Are you sure to skip subscription?')}
        </p>
    );

    const getTitlePopup = () => {
        switch (popupType) {
            case DELETE_ACTION:
                return deleteTitlePopupConfirm;
            case SKIP_ACTION:
                return skipTitlePopupConfirm;

            default:
                break;
        }
    };

    return (
        <>
            <PopupConfirm
                isOpen={isOpenPopup}
                title={getTitlePopup()}
                onCancel={() => {
                    setIsOpenPopup(false);
                }}
                onConfirm={() => {
                    switch (popupType) {
                        case DELETE_ACTION:
                            handleCancelSubscription(subscriptionId);
                            setIsOpenPopup(false);
                            break;
                        case SKIP_ACTION:
                            handleSkipSubscription(subscriptionId);
                            setIsOpenPopup(false);
                            break;

                        default:
                            break;
                    }
                }}
            />
            <div className="mypage">
                <MainPageTitle title={t('mypage::Shopping Subscription')} />
                <div className="result-full shopping-home">
                    <div className="result row">
                        {!totalCount ? (
                            <div className="col-md-12 px-0">
                                <AlertMessage type="warning">
                                    {t('mypage::There is no product')}
                                </AlertMessage>
                            </div>
                        ) : (
                            items.map(item => (
                                <div
                                    className="result-item col-xl-4 col-lg-4 col-md-6 col-xs-6"
                                    key={item.id}
                                >
                                    <ProductBox
                                        product={item.product}
                                        subscription={item}
                                        parentProduct={item.parent_product}
                                        onDelete={() => {
                                            setIsOpenPopup(true);
                                            setPopupType(DELETE_ACTION);
                                            setSubscriptionId(item.id);
                                        }}
                                        onSkip={() => {
                                            setIsOpenPopup(true);
                                            setPopupType(SKIP_ACTION);
                                            setSubscriptionId(item.id);
                                        }}
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

export default ShoppingSubscription;
