import React from 'react';
import { useConfirmation } from './useConfirmation';
import { Redirect, resourceUrl } from '@skp/drivers';
import ProductDetail from '@skp/screens/Checkout/Confirmation/product';
import { useTranslation } from 'react-i18next';
import { getPriceSelling } from '@skp/utils/product';
import MainPageTitle from '@skp/components/MainPageTitle';

const Confirmation = () => {
    const {
        selectedOptions,
        selectedAddress,
        product,
        orderData,
        giftFee
    } = useConfirmation();

    const { t } = useTranslation(['checkout']);

    if (!orderData) {
        return <Redirect to={resourceUrl('/')} />;
    }

    const { price_selling: productPrice, currency } = getPriceSelling(product);

    return (
        <div className="checkout-wrap">
            <div className="confir-checkout">
                <MainPageTitle title={t('checkout::Ordered')} />

                <div className="confirmation-wrap">
                    <div className="order-shipping">
                        <p className="order--step">
                            {t('checkout::ORDER PLACED')}:{' '}
                            {orderData.created_at}
                        </p>
                        <h2 className="order--title confir-order--title">
                            {t('checkout::Order ID')} : {orderData.order_number}
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
                        <div className="col-xl-6 col-lg-6 col-md-6 col-xs-12">
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
                        <div className="col-xl-6 col-lg-6 col-md-6 col-xs-12">
                            <div className="address-ship">
                                <div className="confir-btn">
                                    <a className="confir-btn--link">
                                        {t('checkout::' + orderData.status)}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="checkout-step__address">
                        <MainPageTitle
                            title={`${t('checkout::Order Summary')} (1)`}
                        />
                    </div>
                    <div className="box-cart">
                        <ProductDetail
                            item={product}
                            optionSelected={selectedOptions}
                            allOptions={product.order_options}
                            isLottery={true}
                            isPointMall={true}
                            price={productPrice}
                            currency={currency}
                        />
                    </div>

                    <div className="">
                        <div className="step2-pc">
                            <div className="total-cart">
                                <p className="total-cart__item">
                                    <span>{t('checkout::Subtotal')}</span>
                                    <span>
                                        {t('checkout::{{point}} point(s)', {
                                            point: productPrice
                                        })}
                                    </span>
                                </p>
                                <p className="total-cart__item">
                                    <span>{t('checkout::Shipping')}</span>
                                    <span>
                                        {t('checkout::Shipping included')}
                                    </span>
                                </p>
                                <p className="total-cart__item">
                                    <span>{t('checkout::Gift fee')}</span>
                                    <span>
                                        {giftFee
                                            ? t(
                                                  'checkout::{{point}} point(s)',
                                                  {
                                                      point: giftFee.value
                                                  }
                                              )
                                            : '¥0'}
                                    </span>
                                </p>
                                <p className="total-cart__item">
                                    <span>{t('checkout::Tax')}</span>
                                    <span>{t('checkout::Not apply')}</span>
                                </p>
                            </div>

                            <div className="total-cart">
                                <p className="total-cart__price txt-semibold">
                                    <span>{t('checkout::Total')}</span>
                                    <span>
                                        {t('checkout::{{point}} point(s)', {
                                            point:
                                                productPrice +
                                                (giftFee ? giftFee.value : 0)
                                        })}
                                    </span>
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
