import React from 'react';
import PriceSummary from './priceSummary';
import ProductListing from './productListing';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useShoppingCart } from './useShoppingCart';
import MainPageTitle from '@skp/components/MainPageTitle';
import PopupConfirm from '@skp/components/PopupConfirm';
import AlertMessage from '@skp/components/AlertMessage';
import { useTranslation } from 'react-i18next';
import OfferUpgrade from '@skp/components/OfferUpgrade';
import { GET_FULL_CART_DETAILS } from './graphql/getFullCartDetail.gql';
import ProductRelation from '@skp/components/ProductRelation';

const ShoppingCart = () => {
    const talonProps = useShoppingCart({
        queries: {
            getCartDetails: GET_FULL_CART_DETAILS
        }
    });

    const { t } = useTranslation(['checkout', 'common']);

    const {
        hasItems,
        setIsCartUpdating,
        shouldShowLoadingIndicator,
        handleRemoveCart,
        cartId,
        isDeletingCart,
        isShowPopupConfirm,
        setShowPopupConfirm,
        setForceRender,
        items,
        earnedSkypoints,
        isListContainInvalidProduct,
        prices,
        cart,
        setTriggerRecollectTotals,
        crosssellProducts,
        error,
        refetch
    } = talonProps;

    if (shouldShowLoadingIndicator) {
        return <LoadingIndicator />;
    }

    if (error) {
        return (
            <AlertMessage type="error">
                {t('common::Something went wrong!')}
            </AlertMessage>
        );
    }

    if (!hasItems) {
        return (
            <AlertMessage type="warning">
                {t('checkout::There are no items in your cart.')}
            </AlertMessage>
        );
    }

    const titlePopupConfirm = (
        <p className="modal-customize__des">カートから削除しますか？</p>
    );

    return (
        <div className="shopping-cart__container">
            <PopupConfirm
                isOpen={isShowPopupConfirm}
                title={titlePopupConfirm}
                onCancel={() => setShowPopupConfirm(false)}
                onConfirm={() => handleRemoveCart(cartId)}
                isLoading={isDeletingCart}
            />
            <MainPageTitle title="カート内の編集">
                <button
                    className="shopping-cart__action"
                    onClick={() => {
                        setShowPopupConfirm(true);
                    }}
                >
                    カートを空にする
                </button>
            </MainPageTitle>
            <div className="row">
                <div className="col-lg-9 col-md-12 checkout-left">
                    <div className="box-cart" style={{ marginBottom: '30px' }}>
                        <ProductListing
                            setIsCartUpdating={setIsCartUpdating}
                            setForceRender={setForceRender}
                            items={items}
                        />
                    </div>
                </div>
                <div className="col-lg-3 col-md-12">
                    <PriceSummary
                        itemsCount={items.length}
                        earnedSkypoints={earnedSkypoints}
                        isListContainInvalidProduct={
                            isListContainInvalidProduct
                        }
                        prices={prices}
                    />
                </div>
            </div>
            <OfferUpgrade
                setTriggerRecollectTotals={setTriggerRecollectTotals}
                cart={cart}
            />
            {crosssellProducts.length > 0 && (
                <div className="container">
                    <div className="recommend-full">
                        <h1 className="recommend-title">Recommendations</h1>
                        <ProductRelation
                            productListName="Cross-Sell Products"
                            relationProducts={crosssellProducts}
                            displayType="shopping"
                            refetchCart={refetch}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShoppingCart;
