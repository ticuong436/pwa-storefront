import React from 'react';
import { useConfirmation } from './useConfirmation';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { Redirect, useParams, resourceUrl } from '@skp/drivers';
import CreditCardIcon from '@skp/components/CreditCardIcon';
import { Price } from '@skp/components/Price';
import Product from '@skp/screens/Checkout/Confirmation/product';
import { useTranslation } from 'react-i18next';
import { getPriceSelling } from '@skp/utils/product';
import MainPageTitle from '@skp/components/MainPageTitle';

const Confirmation = () => {
    const { product_id: productId } = useParams();
    const { t } = useTranslation(['checkout']);

    const {
        shouldShowLoadingIndicator,
        product,
        applyData,
        selectedAddress,
        selectedCard
    } = useConfirmation({
        productId
    });

    if (!applyData) {
        return <Redirect to={resourceUrl('/')} />;
    }

    if (shouldShowLoadingIndicator) {
        return <LoadingIndicator />;
    }

    const { price_selling: productPrice, currency } = getPriceSelling(product);

    return (
        <div className="checkout-wrap">
            <div className="confir-checkout">
                <MainPageTitle title="申込済み" />

                <div className="confirmation-wrap">
                    <div className="order-shipping">
                        <p className="order--step">
                            {t('checkout::APPLY PLACED')}:{' '}
                            {applyData.created_at}
                        </p>
                        <h2 className="order--title confir-order--title">
                            {t('checkout::Apply ID')}: {applyData.apply_number}
                        </h2>
                        <div className="order--des-wrap">
                            <p className="order--des">
                                {t(
                                    'checkout::Thank You for Shopping with Sky Premium.'
                                )}
                            </p>
                            <p className="order--des">
                                {t(
                                    'checkout::We are currently processing your order. You will receive updates via email on your order status once your item(s) have been shipped'
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="address-container col-xl-6 col-lg-6 col-md-6 col-xs-12">
                            <div className="address-ship">
                                <div className="address--pay">
                                    {t('checkout::SHIPPING ADDRESS')}
                                </div>
                                <div className="address--name">
                                    {`${selectedAddress.lastname} ${
                                        selectedAddress.firstname
                                    }`}
                                </div>
                                <div className="address--text">
                                    {selectedAddress.region
                                        ? selectedAddress.region.label ||
                                          selectedAddress.region.region
                                        : null}{' '}
                                    {selectedAddress.postcode}{' '}
                                    {selectedAddress.country_code || null}
                                </div>
                                {selectedAddress.street.map((street, index) => (
                                    <div key={index} className="address--text">
                                        {street},{' '}
                                        {index === 1
                                            ? selectedAddress.city
                                            : null}
                                    </div>
                                ))}
                                <div className="address--text">
                                    {selectedAddress.telephone}
                                </div>
                            </div>
                        </div>
                        <div className="address-container col-xl-6 col-lg-6 col-md-6 col-xs-12">
                            <div className="address-ship">
                                <div className="address--pay">
                                    {t('checkout::Payment')}
                                </div>
                                <div className="address--name confir-payment">
                                    <CreditCardIcon
                                        brand={selectedCard.brand}
                                        className=""
                                    />
                                    **** **** **** {selectedCard.last4}
                                </div>
                                <div className="confir-btn">
                                    <a className="confir-btn--link">
                                        {t('checkout::' + applyData.status)}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="checkout-step__address">
                        <MainPageTitle title={t('checkout::Apply Summary')} />
                    </div>
                    <div className="box-cart">
                        <Product
                            item={product}
                            currency={currency}
                            price={productPrice}
                            isLottery={true}
                        />
                    </div>

                    <div className="">
                        <div className="step2-pc">
                            <div className="total-cart">
                                <p className="total-cart__item">
                                    <span>小計</span>
                                    <span>
                                        <Price
                                            currencyCode={currency}
                                            value={productPrice}
                                        />
                                    </span>
                                </p>
                                <p className="total-cart__item">
                                    <span>送料</span>
                                    <span>
                                        {t('checkout::Shipping included')}
                                    </span>
                                </p>
                                <p className="total-cart__item">
                                    <span>{t('checkout::Gift fee')}</span>
                                    <span>
                                        <Price
                                            value={applyData.gift_fee || 0}
                                            currencyCode={currency}
                                        />
                                    </span>
                                </p>
                                <p className="total-cart__item">
                                    <span>消費税</span>
                                    <span>対象外</span>
                                </p>
                            </div>
                            <hr className="total-cart_border" />
                            <div className="total-cart__last">
                                <p className="total-cart__price txt-semibold">
                                    <span>合計</span>
                                    <span>
                                        <Price
                                            currencyCode={currency}
                                            value={
                                                productPrice +
                                                (applyData.gift_fee || 0)
                                            }
                                        />
                                    </span>
                                </p>
                                <p className="total-cart__price txt-semibold color-gold">
                                    <span>
                                        {t('checkout::SKY POINTS EARNED')}
                                    </span>
                                    <span>{product.sky_point}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;
