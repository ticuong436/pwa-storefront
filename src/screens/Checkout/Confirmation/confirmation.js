import React from 'react';
import { Redirect, resourceUrl } from '@skp/drivers';
import { Price } from '@skp/components/Price';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import Product from './product';
import { useConfirmation } from './useConfirmation';
import CreditCardIcon from '@skp/components/CreditCardIcon';
import { useTranslation } from 'react-i18next';
import MainPageTitle from '@skp/components/MainPageTitle';

const Confirmation = () => {
    const { orderNumber, loading, data } = useConfirmation();
    const { t } = useTranslation(['checkout']);

    if (!orderNumber) {
        return <Redirect to={resourceUrl('/')} />;
    }

    if (loading) {
        return <LoadingIndicator />;
    }

    const { getCustomerOrder: orderData } = data;

    return (
        <div className="checkout-wrap">
            <div className="confir-checkout">
                <MainPageTitle title="注文済み" />

                <div className="confirmation-wrap">
                    <div className="order-shipping">
                        <p className="order--step">
                            {t('checkout::ORDER PLACED')}:{' '}
                            {orderData.created_at}
                        </p>
                        <h2 className="order--title confir-order--title">
                            {t('checkout::Order ID')}: {orderData.order_number}
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
                                    {orderData.shipping_address.lastname +
                                        ' ' +
                                        orderData.shipping_address.firstname}
                                </div>
                                {orderData.shipping_address.street.map(
                                    (street, index) => (
                                        <div
                                            key={index}
                                            className="address--text"
                                        >
                                            {street},{' '}
                                            {index === 1
                                                ? orderData.shipping_address
                                                      .city
                                                : null}
                                        </div>
                                    )
                                )}
                                <div className="address--text">
                                    {orderData.shipping_address.country.label}
                                </div>
                                <div className="address--text">
                                    {orderData.region ? orderData.region.label ||
                                                      orderData.region.region
                                                    : null}{' '}
                                    {orderData.shipping_address
                                            .postcode}{' '}
                                    {orderData.shipping_address.country.code}
                                </div>
                                <div className="address--text">
                                    {orderData.shipping_address.telephone}
                                </div>
                            </div>
                        </div>
                        <div className="address-container col-xl-6 col-lg-6 col-md-6 col-xs-12">
                            <div className="address-ship">
                                {orderData.grand_total !== 0 && (
                                    <>
                                        <div className="address--pay">
                                            {t('checkout::Payment')}
                                        </div>
                                        <div className="address--name confir-payment">
                                            <CreditCardIcon
                                                brand={orderData.payment.brand}
                                                className=""
                                            />
                                            **** **** ****{' '}
                                            {orderData.payment.card_last4}
                                        </div>
                                    </>
                                )}
                                <div className="confir-btn">
                                    <a className="confir-btn--link">
                                        {t(orderData.status)}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="checkout-step__address">
                        <MainPageTitle
                            title={`${t('checkout::Order Summary')} (${
                                orderData.items.length
                            })`}
                        />
                    </div>
                    <div className="box-cart">
                        {orderData.items.map(item => (
                            <Product
                                key={item.product.id}
                                item={item}
                                currency={orderData.currency}
                                price={item.product.price}
                            />
                        ))}
                    </div>

                    <div className="">
                        <div className="step2-pc">
                            <div className="total-cart">
                                <p className="total-cart__item">
                                    <span>小計</span>
                                    <span>
                                        {orderData.sub_total ? (
                                            <Price
                                                value={orderData.sub_total}
                                                currencyCode={
                                                    orderData.currency
                                                }
                                            />
                                        ) : (
                                            0
                                        )}
                                    </span>
                                </p>
                                <p className="total-cart__item">
                                    <span>送料</span>
                                    <span>
                                        {orderData.shipping_amount ? (
                                            <Price
                                                value={
                                                    orderData.shipping_amount
                                                }
                                                currencyCode={
                                                    orderData.currency
                                                }
                                            />
                                        ) : (
                                            0
                                        )}
                                    </span>
                                </p>
                                <p className="total-cart__item">
                                    <span>ギフト料</span>
                                    <span>
                                        {orderData.gift_fee ? (
                                            <Price
                                                value={orderData.gift_fee}
                                                currencyCode={
                                                    orderData.currency
                                                }
                                            />
                                        ) : (
                                            <Price
                                                value={0}
                                                currencyCode={
                                                    orderData.currency
                                                }
                                            />
                                        )}
                                    </span>
                                </p>
                                <p className="total-cart__item">
                                    <span>消費税</span>
                                    <span>対象外</span>
                                </p>
                            </div>
                            <div className="total-cart__middle">
                                <div className="total-cart__item">
                                    <p>
                                        <span>クーポンコード DISCOUNT</span>
                                    </p>
                                    <p>
                                        {orderData.discount ? (
                                            <>
                                                {'– '}
                                                <Price
                                                    value={
                                                        -1 * orderData.discount
                                                    }
                                                    currencyCode={
                                                        orderData.currency
                                                    }
                                                />
                                            </>
                                        ) : (
                                            0
                                        )}
                                    </p>
                                </div>
                                <div className="total-cart__item">
                                    <p>
                                        <span>
                                            {t('checkout::SKY POINTS Redeemed')}
                                        </span>
                                    </p>
                                    <p>
                                        <span>
                                            {orderData.skypoint_redeemed ? (
                                                <>
                                                    {'– '}
                                                    <Price
                                                        value={
                                                            orderData.skypoint_redeemed
                                                        }
                                                        currencyCode={
                                                            orderData.currency
                                                        }
                                                    />
                                                </>
                                            ) : (
                                                0
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="total-cart__last">
                                <p className="total-cart__price txt-semibold">
                                    <span>合計</span>
                                    <span>
                                        <Price
                                            value={
                                                orderData.grand_total != null
                                                    ? orderData.grand_total
                                                    : 0
                                            }
                                            currencyCode={orderData.currency}
                                        />
                                    </span>
                                </p>
                                <p className="total-cart__price txt-semibold color-gold">
                                    <span>
                                        {t('checkout::SKY POINTS EARNED')}
                                    </span>
                                    <span>
                                        {orderData.skypoint_to_earn
                                            ? orderData.skypoint_to_earn
                                            : 0}
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
