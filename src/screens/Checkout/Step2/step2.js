import React, { useEffect } from 'react';
import { Link, Redirect, resourceUrl } from '@skp/drivers';
import ListCard from '@skp/screens/Checkout/listCard';
import { useCheckout } from '@skp/screens/Checkout/useCheckout';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useStep2 } from './useStep2';
import DetailPrice from './detailPrice';
import Modal from '@skp/components/Modal';
import SkyPoints from './skyPoints';
import { useTranslation } from 'react-i18next';
import AlertMessage from '@skp/components/AlertMessage';
import { usePriceSummary } from '@skp/screens/Checkout/usePriceSummary';
import { trackCheckoutProduct } from '@skp/libs/tracking';
import MainPageTitle from '@skp/components/MainPageTitle';

const Step2Page = () => {
    const talonProps = useCheckout();
    const {
        isCartLoading,
        isCartEmpty,
        cartId,
        appliedCoupons,
        items,
        isListContainInvalidProduct
    } = talonProps;

    const {
        flatData: priceData,
        earned_skypoints,
        refetchPrice
    } = usePriceSummary();

    const props = useStep2({ cartId, priceData });
    const {
        selectCard,
        cardState,
        goToCheckoutStep3,
        skyPoints,
        isLoadingPoints,
        isShowModal,
        setShowModal,
        hideModal,
        location,
        giftFee
    } = props;

    useEffect(() => {
        if (items.length) {
            trackCheckoutProduct(items, 2);
        }
    }, [items]);

    const { selectedCard } = cardState;

    const requiredSelectCard = priceData.total && priceData.total.value > 0;

    const { t } = useTranslation(['checkout', 'common']);

    if (!location.state) {
        return <Redirect to={resourceUrl('/checkout/first-step')} />;
    }

    if (isCartLoading || isLoadingPoints) {
        return <LoadingIndicator />;
    }

    if (isCartEmpty) {
        return (
            <AlertMessage type="warning">
                {t('checkout::There are no items in your cart.')}
            </AlertMessage>
        );
    }

    return (
        <>
            <Modal
                id="modal-step2"
                isOpen={isShowModal}
                title={'Redeem SKY POINTS'}
            >
                {isShowModal && (
                    <SkyPoints
                        onClose={hideModal}
                        cartId={cartId}
                        onSkyPointsRedeemed={() => {
                            refetchPrice();
                        }}
                        skyPoints={skyPoints}
                        redeemedSkypoints={
                            priceData.redeemed_skypoints &&
                            priceData.redeemed_skypoints > 0
                                ? priceData.redeemed_skypoints.value
                                : ''
                        }
                    />
                )}
            </Modal>
            <div className="checkout-wrap">
                <div className="">
                    <div className="checkout-edit-box">
                        <div>
                            <MainPageTitle title={t('checkout::Checkout')}>
                                <Link
                                    className="main-content__link"
                                    to={{
                                        pathname: resourceUrl(
                                            '/checkout/first-step'
                                        ),
                                        state: {
                                            ...location.state,
                                            selectedCard
                                        }
                                    }}
                                >
                                    {t(
                                        'checkout::Back to Order Detail & Shipping'
                                    )}
                                </Link>
                            </MainPageTitle>
                        </div>
                    </div>
                    <div className="order-shipping">
                        <p className="order--step">
                            {t('checkout::Step {{step}}', { step: 2 })}
                        </p>
                        <h2 className="order--title">
                            {t('checkout::Payment')}
                        </h2>
                        <div className="reg-list order-box">
                            <div className="reg-hexagon order-item reg-hexagon-active">
                                <span>1</span>
                            </div>
                            <div className="reg-hexagon order-item reg-hexagon-active">
                                <span className="reg-text">2</span>
                            </div>
                            <div className="reg-hexagon order-item">
                                <span>3</span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-9 col-md-12 checkout-left">
                            {priceData.total && priceData.total.value > 0 && (
                                <ListCard
                                    onFetchedCards={cards => {
                                        if (cards.length) {
                                            const cardSelectDefault =
                                                location.state &&
                                                location.state.selectedCard
                                                    ? location.state
                                                          .selectedCard
                                                    : cards.find(
                                                          card =>
                                                              card.is_default
                                                      );
                                            selectCard(cardSelectDefault);
                                        }
                                    }}
                                    selectedCardId={
                                        selectedCard ? selectedCard.id : null
                                    }
                                    onClick={selectCard}
                                    allowDelete={false}
                                />
                            )}
                            {priceData.total && priceData.total.value == 0 && (
                                <div className="select-address">
                                    <div className="">
                                        <MainPageTitle
                                            className=""
                                            title={t(
                                                'checkout::Select Your Credit Card'
                                            )}
                                        />
                                    </div>
                                    <div className="select-location">
                                        {t(
                                            'checkout::Since the payment amount is 0, you do not need to select a payment method.'
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-12 col-xs-12">
                            <DetailPrice
                                cartId={cartId}
                                earnedSkypoints={earned_skypoints}
                                refetchSkyPointToEarn={refetchPrice}
                                appliedCoupons={appliedCoupons}
                                onCouponChanged={() => {
                                    refetchPrice();
                                }}
                                priceData={priceData}
                                skyPoints={skyPoints}
                                setShowModal={setShowModal}
                                onSkyPointsRedeemed={() => {
                                    refetchPrice();
                                }}
                                goToCheckoutStep3={goToCheckoutStep3}
                                numberProduct={items.length}
                                giftFee={giftFee}
                                canGoToNextStep={
                                    (!requiredSelectCard ||
                                        (requiredSelectCard && selectedCard)) &&
                                    !isListContainInvalidProduct
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Step2Page;
