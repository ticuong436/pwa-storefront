import React, { useEffect } from 'react';
import { Price } from '@skp/components/Price';
import { Link, Redirect, resourceUrl } from '@skp/drivers';
import { useCheckout } from '@skp/screens/Checkout/useCheckout';
import { useStep3 } from './useStep3';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import ProductDetail from './productDetail';
import { generateItemKey } from '@skp/screens/Checkout/formHelper';
import CreditCardIcon from '@skp/components/CreditCardIcon';
import { useTranslation } from 'react-i18next';
import AlertMessage from '@skp/components/AlertMessage';
import { getErrorMessage } from '@skp/utils/graphqlError';
import { usePriceSummary } from '@skp/screens/Checkout/usePriceSummary';
import { trackPurchase } from '@skp/libs/tracking';
import MainPageTitle from '@skp/components/MainPageTitle';

const Step3Page = () => {
    const talonProps = useCheckout();
    const {
        cartId,
        cartShippingAddresses,
        isLoading,
        appliedCoupons,
        items,
        isListContainInvalidProduct
    } = talonProps;

    const orderProps = useStep3(cartId);
    const {
        placeOrder,
        orderPlaced,
        isPlacingOrder,
        placeOrderData,
        placeOrderError,
        state,
        orderOptionSelected,
        giftFee
    } = orderProps;

    const orderData = placeOrderData.placeOrder
        ? placeOrderData.placeOrder.order
        : {};

    const { t } = useTranslation(['checkout', 'common']);

    const { flatData: priceData, earned_skypoints } = usePriceSummary();
    useEffect(() => {
        if (!orderPlaced || !orderData || !priceData) {
            return;
        }

        trackPurchase(
            orderData.order_number,
            items.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price: item.prices.price.value
            })),
            priceData.subtotal.value,
            priceData.total.value,
            priceData.shipping &&
                priceData.shipping[0] &&
                priceData.shipping[0].selected_shipping_method
                ? priceData.shipping[0].selected_shipping_method.amount.value
                : null,
            appliedCoupons && appliedCoupons.length
                ? appliedCoupons[0].code
                : null
        );
    }, [appliedCoupons, items, orderData, orderPlaced, priceData]);

    if (!state || !state.order_option) {
        return <Redirect to={resourceUrl('/checkout/first-step')} />;
    }

    if (isLoading) {
        return <LoadingIndicator>{`Fetching Cart...`}</LoadingIndicator>;
    }

    if (orderPlaced) {
        return (
            <Redirect
                to={{
                    pathname: resourceUrl('/checkout/confirmation'),
                    state: { orderNumber: orderData.order_number }
                }}
            />
        );
    }

    const card = state.card || {};

    return (
        <div className="checkout-wrap">
            <div className="">
                <div className="checkout-edit-box">
                    <div>
                        <MainPageTitle title={t('checkout::Checkout')}>
                            <Link
                                to={{
                                    pathname: resourceUrl(
                                        '/checkout/second-step'
                                    ),
                                    state: {
                                        ...state.order_option,
                                        selectedCard: state.card
                                    }
                                }}
                                className="main-content__link"
                            >
                                {t('checkout::Back to Payment')}
                            </Link>
                        </MainPageTitle>
                    </div>
                </div>
                <div className="order-shipping">
                    <p className="order--step">
                        {t('checkout::Step {{step}}', { step: 3 })}
                    </p>
                    <h2 className="order--title">
                        {t('checkout::Review Your Order')}
                    </h2>
                    <div className="reg-list order-box">
                        <div className="reg-hexagon order-item reg-hexagon-active">
                            <span>1</span>
                        </div>
                        <div className="reg-hexagon order-item reg-hexagon-active">
                            <span>2</span>
                        </div>
                        <div className="reg-hexagon order-item reg-hexagon-active">
                            <span className="reg-text">3</span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-9 col-md-12 checkout-left">
                        <div className="">
                            <div className="">
                                <MainPageTitle
                                    title={t('checkout::Confirm Your Order')}
                                />
                                <div className="row">
                                    <div className="address-container col-xl-6 col-lg-6 col-md-12 col-xs-12 step3-sp-addship">
                                        <div className="address-ship">
                                            <div className="address--pay">
                                                {t(
                                                    'checkout::SHIPPING ADDRESS'
                                                )}
                                            </div>
                                            <div className="address--name">
                                                {`${
                                                    cartShippingAddresses[0]
                                                        .lastname
                                                } ${
                                                    cartShippingAddresses[0]
                                                        .firstname
                                                }`}
                                            </div>
                                            <div className="address--text">
                                                {cartShippingAddresses[0].region
                                                    ? cartShippingAddresses[0]
                                                          .region.label ||
                                                      cartShippingAddresses[0]
                                                          .region.region
                                                    : null}{' '}
                                                {
                                                    cartShippingAddresses[0]
                                                        .postcode
                                                }{' '}
                                                {cartShippingAddresses[0]
                                                    .country
                                                    ? cartShippingAddresses[0]
                                                          .country.code
                                                    : null}
                                            </div>
                                            {cartShippingAddresses[0].street.map(
                                                (street, index) => (
                                                    <div
                                                        key={index}
                                                        className="address--text"
                                                    >
                                                        {street},{' '}
                                                        {index === 1
                                                            ? cartShippingAddresses[0]
                                                                  .city
                                                            : null}
                                                    </div>
                                                )
                                            )}
                                            <div className="address--text">
                                                {
                                                    cartShippingAddresses[0]
                                                        .telephone
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    {priceData.total &&
                                        priceData.total.value !== 0 && (
                                            <div className="address-container col-xl-6 col-lg-6 col-md-12 col-xs-12">
                                                <div className="address-ship">
                                                    <div className="address--pay">
                                                        {t('checkout::Payment')}
                                                    </div>
                                                    <div className="address--name">
                                                        <CreditCardIcon
                                                            brand={card.brand}
                                                            className=""
                                                        />
                                                        **** **** ****{' '}
                                                        {card.last4}
                                                    </div>
                                                    <div className="address--text">
                                                        {card.exp_month}/
                                                        {card.exp_year}
                                                    </div>
                                                    <div className="address--text">
                                                        {card.name}
                                                    </div>
                                                    <div className="address--text">
                                                        {card.postal_code}
                                                    </div>
                                                    <div className="address--text">
                                                        {card.state}
                                                    </div>
                                                    <div className="address--text">
                                                        {card.address_street1}{' '}
                                                        {card.country_name}
                                                    </div>
                                                    <div className="address--text">
                                                        {card.address_street2}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                </div>

                                <div className="checkout-step__address">
                                    <MainPageTitle
                                        title={`${t(
                                            'checkout::Cart Summary'
                                        )} ( ${items.length} )`}
                                    />
                                </div>
                                <div className="box-cart">
                                    {items.map(item => (
                                        <ProductDetail
                                            item={item}
                                            key={item.id}
                                            optionSelected={
                                                (orderOptionSelected &&
                                                orderOptionSelected.orderOptions
                                                    ? orderOptionSelected
                                                          .orderOptions[
                                                          generateItemKey(
                                                              item.id
                                                          )
                                                      ]
                                                    : []) || {}
                                            }
                                            allOptions={
                                                item.product.order_options
                                            }
                                            currency={
                                                item.prices.price.currency
                                            }
                                            price={item.prices.price.value}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-12 col-xs-12">
                        <div className="step2-block">
                            <div className="total-cart">
                                <h4 className="total-cart__item">
                                    <span>{t('checkout::Order Detail')}</span>
                                    <span>
                                        {items.length} {t('checkout::Item')}
                                    </span>
                                </h4>
                                <hr className="total-cart__border" />
                                <p className="total-cart__item">
                                    <span>{t('checkout::Subtotal')}</span>
                                    <span>
                                        {priceData.subtotal ? (
                                            <Price
                                                value={priceData.subtotal.value}
                                                currencyCode={
                                                    priceData.subtotal.currency
                                                }
                                            />
                                        ) : null}
                                    </span>
                                </p>
                                <p className="total-cart__item">
                                    <span>{t('checkout::Shipping')}</span>
                                    <span>
                                        {priceData.shipping &&
                                        priceData.shipping[0] &&
                                        priceData.shipping[0]
                                            .selected_shipping_method ? (
                                            <Price
                                                value={
                                                    priceData.shipping[0]
                                                        .selected_shipping_method
                                                        .amount.value +
                                                    priceData
                                                        .additional_shipping_fee
                                                        .value
                                                }
                                                currencyCode={
                                                    priceData.shipping[0]
                                                        .selected_shipping_method
                                                        .amount.currency
                                                }
                                            />
                                        ) : (
                                            0
                                        )}
                                    </span>
                                </p>
                                <p className="total-cart__item">
                                    <span>{t('checkout::Gift fee')}</span>
                                    <span>
                                        {giftFee ? (
                                            <Price
                                                value={giftFee.value}
                                                currencyCode={giftFee.currency}
                                            />
                                        ) : priceData.total ? (
                                            <Price
                                                value={0}
                                                currencyCode={
                                                    priceData.total.currency
                                                }
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </span>
                                </p>
                                <p className="total-cart__item">
                                    <span>{t('checkout::Tax')}</span>
                                    <span>{t('checkout::Not apply')}</span>
                                </p>
                            </div>
                            <div className="total-cart__middle">
                                <p className="total-cart__item">
                                    <span>
                                        {t('checkout::Coupon code discount')}
                                    </span>
                                    <span>
                                        {priceData.discounts &&
                                        priceData.discounts[0] ? (
                                            <>
                                                {'– '}
                                                <Price
                                                    value={
                                                        priceData.discounts[0]
                                                            .amount.value
                                                    }
                                                    currencyCode={
                                                        priceData.discounts[0]
                                                            .amount.currency
                                                    }
                                                />
                                            </>
                                        ) : (
                                            0
                                        )}
                                    </span>
                                </p>
                                {appliedCoupons && appliedCoupons.length ? (
                                    <div className="total-cart__item">
                                        <span>{appliedCoupons[0].code}</span>
                                    </div>
                                ) : null}
                                <p className="total-cart__item">
                                    <span>
                                        {t('checkout::SKY POINTS Redeemed')}
                                    </span>
                                    <span>
                                        {priceData.redeemed_skypoints &&
                                        priceData.redeemed_skypoints.value ? (
                                            <>
                                                {'– '}
                                                <Price
                                                    value={
                                                        priceData
                                                            .redeemed_skypoints
                                                            .value
                                                    }
                                                    currencyCode={
                                                        priceData
                                                            .redeemed_skypoints
                                                            .currency
                                                    }
                                                />
                                            </>
                                        ) : (
                                            0
                                        )}
                                    </span>
                                </p>
                                {priceData.redeemed_skypoints &&
                                priceData.redeemed_skypoints.value ? (
                                    <div className="total-cart__item">
                                        <span>
                                            {priceData.redeemed_skypoints.value}
                                        </span>
                                    </div>
                                ) : null}
                            </div>
                            <div className="total-cart__last">
                                <p className="total-cart__price txt-semibold">
                                    <span>{t('checkout::Total')}</span>
                                    <span>
                                        {priceData.total ? (
                                            <Price
                                                value={
                                                    priceData.total.value +
                                                    priceData
                                                        .additional_shipping_fee
                                                        .value
                                                }
                                                currencyCode={
                                                    priceData.total.currency
                                                }
                                            />
                                        ) : null}
                                    </span>
                                </p>
                                <p className="total-cart__price txt-semibold color-gold">
                                    <span>
                                        {t('checkout::SKY POINTS EARNED')}
                                    </span>
                                    <span>
                                        {earned_skypoints &&
                                            earned_skypoints.value}
                                    </span>
                                </p>
                                {isPlacingOrder && <LoadingIndicator />}
                                {placeOrderError && (
                                    <AlertMessage type="error">
                                        {getErrorMessage(placeOrderError)}
                                    </AlertMessage>
                                )}
                                <div className="total-cart__btn">
                                    <button
                                        className={`button button--primary button--full ${
                                            isListContainInvalidProduct
                                                ? 'button--none'
                                                : ''
                                        }`}
                                        disabled={
                                            isPlacingOrder ||
                                            isListContainInvalidProduct
                                        }
                                        onClick={placeOrder}
                                    >
                                        {t('checkout::SUBMIT')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step3Page;
