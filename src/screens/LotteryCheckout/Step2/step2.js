import React from 'react';
import { Price } from '@skp/components/Price';
import { Title } from '@magento/venia-ui/lib/components/Head';
import { Redirect, resourceUrl, useParams, Link } from '@skp/drivers';
import { useStep2 } from './useStep2';
import ListCard from '@skp/screens/Checkout/listCard';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { useTranslation } from 'react-i18next';
import { getPriceSelling } from '@skp/utils/product';
import MainPageTitle from '@skp/components/MainPageTitle';

const Step2Page = () => {
    const { product_id: productId } = useParams();
    const props = useStep2(productId);
    const {
        location,
        goToCheckoutStep3,
        selectedCard,
        selectCard,
        giftFee
    } = props;
    const { t } = useTranslation(['checkout', 'common']);

    if (!location.state) {
        return (
            <Redirect
                to={resourceUrl(
                    `/product/${productId}/lottery-checkout/first-step`
                )}
            />
        );
    }

    const locationState = location.state;

    if (locationState.product.is_applied_lottery_product) {
        return (
            <ErrorView>
                <h1>{t('checkout::The product has been applied')}</h1>
            </ErrorView>
        );
    }

    const { price_selling: productPrice, currency } = getPriceSelling(
        locationState.product
    );

    return (
        <>
            <Title>{t('checkout::Checkout')}</Title>
            <div className="checkout-wrap">
                <div className="">
                    <div className="checkout-edit-box">
                        <div>
                            <MainPageTitle title={t('checkout::Checkout')}>
                                <Link
                                    className="main-content__link"
                                    to={{
                                        pathname: resourceUrl(
                                            `/product/${productId}/lottery-checkout/first-step`
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
                            <ListCard
                                onFetchedCards={cards => {
                                    if (cards.length) {
                                        const cardSelectDefault = selectedCard
                                            ? selectedCard
                                            : cards.find(
                                                  card => card.is_default
                                              );
                                        selectCard(cardSelectDefault);
                                    }
                                }}
                                selectedCardId={
                                    selectedCard ? selectedCard.id : null
                                }
                                onClick={selectCard}
                            />
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-12 col-xs-12">
                            <div className="step2-block">
                                <div className="total-cart">
                                    <h4 className="total-cart__item">
                                        <span>
                                            {t('checkout::Order Detail')}
                                        </span>
                                        <span>1 {t('checkout::Item')}</span>
                                    </h4>
                                    <div className="total-cart__middle">
                                        <p className="total-cart__item">
                                            <span>
                                                {t('checkout::Subtotal')}
                                            </span>
                                            <span>
                                                <Price
                                                    currencyCode={currency}
                                                    value={productPrice}
                                                />
                                            </span>
                                        </p>
                                        <p className="total-cart__item">
                                            <span>
                                                {t('checkout::Shipping')}
                                            </span>
                                            <span>
                                                {t(
                                                    'checkout::Shipping included'
                                                )}
                                            </span>
                                        </p>
                                        <p className="total-cart__item">
                                            <span>
                                                {t('checkout::Gift fee')}
                                            </span>
                                            <span>
                                                {giftFee ? (
                                                    <Price
                                                        value={giftFee.value}
                                                        currencyCode={
                                                            giftFee.currency
                                                        }
                                                    />
                                                ) : (
                                                    <Price
                                                        value={0}
                                                        currencyCode={currency}
                                                    />
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="total-cart__last">
                                    <p className="total-cart__price txt-semibold">
                                        <span>{t('checkout::Total')}</span>
                                        <span>
                                            <Price
                                                currencyCode={currency}
                                                value={
                                                    productPrice +
                                                    (giftFee
                                                        ? giftFee.value
                                                        : 0)
                                                }
                                            />
                                        </span>
                                    </p>
                                    <p className="total-cart__price txt-semibold color-gold">
                                        <span>
                                            {t('checkout::SKY POINTS EARNED')}
                                        </span>
                                        <span>
                                            {locationState.product.sky_point}
                                        </span>
                                    </p>
                                    <div className="total-cart__btn">
                                        <a
                                            className="button button--primary button--full"
                                            href="#"
                                            onClick={e => {
                                                e.preventDefault();
                                                if (!selectedCard.id) {
                                                    alert(
                                                        'Please select a card!'
                                                    );
                                                } else {
                                                    goToCheckoutStep3();
                                                }
                                            }}
                                        >
                                            {t('checkout::PROCEED TO CONFIRM')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Step2Page;
