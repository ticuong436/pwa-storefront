import React from 'react';
import { Redirect, resourceUrl, useParams, Link } from '@skp/drivers';
import ProductDetail from '@skp/screens/Checkout/Step3/productDetail';
import { useStep2 } from './useStep2';
import { useTranslation } from 'react-i18next';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import AlertMessage from '@skp/components/AlertMessage';
import { getPriceSelling } from '@skp/utils/product';
import MainPageTitle from '@skp/components/MainPageTitle';

const Step2Page = () => {
    const { product_id: productId } = useParams();

    const {
        handleCheckoutPointMall,
        selectedOptions,
        selectedAddress,
        product,
        giftFee,
        state,
        orderLoading,
        orderError
    } = useStep2(productId);

    const { t } = useTranslation(['checkout', 'common']);

    if (!state) {
        return (
            <Redirect
                to={resourceUrl(
                    `/product/${productId}/point-mall-checkout/first-step`
                )}
            />
        );
    }

    const { price_selling: productPrice, currency } = getPriceSelling(product);

    return (
        <div className="checkout-wrap">
            <div className="">
                <div className="checkout-edit-box">
                    <div>
                        <MainPageTitle title={t('checkout::Checkout')}>
                            <Link
                                to={{
                                    pathname: resourceUrl(
                                        `/product/${productId}/point-mall-checkout/first-step`
                                    ),
                                    state: {
                                        ...state
                                    }
                                }}
                                className="main-content__link"
                            >
                                {t('checkout::Back to Order Detail & Shipping')}
                            </Link>
                        </MainPageTitle>
                    </div>
                </div>
                <div className="order-shipping">
                    <p className="order--step">
                        {t('checkout::Step {{step}}', { step: 2 })}
                    </p>
                    <h2 className="order--title">
                        {t('checkout::Review Your Order')}
                    </h2>
                    <div className="reg-list order-box">
                        <div className="reg-hexagon order-item reg-hexagon-active">
                            <span>1</span>
                        </div>
                        <div className="reg-hexagon order-item reg-hexagon-active">
                            <span className="reg-text">2</span>
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
                                    <div className="address-container col-xl-6 col-lg-6 col-md-12 col-xs-12">
                                        <div className="address-ship">
                                            <div className="address--pay">
                                                {t(
                                                    'checkout::SHIPPING ADDRESS'
                                                )}
                                            </div>
                                            <div className="address--name">
                                                {`${selectedAddress.lastname} ${
                                                    selectedAddress.firstname
                                                }`}
                                            </div>
                                            <div className="address--text">
                                                {selectedAddress.region
                                                    ? selectedAddress.region
                                                          .label ||
                                                      selectedAddress.region
                                                          .region
                                                    : null}{' '}
                                                {selectedAddress.postcode}{' '}
                                                {selectedAddress.country_code ||
                                                    null}
                                            </div>
                                            {selectedAddress.street.map(
                                                (street, index) => (
                                                    <div
                                                        key={index}
                                                        className="address--text"
                                                    >
                                                        {street},{' '}
                                                        {index === 1
                                                            ? selectedAddress.city
                                                            : null}
                                                    </div>
                                                )
                                            )}
                                            <div className="address--text">
                                                {selectedAddress.telephone}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="checkout-step__address">
                                    <MainPageTitle
                                        title={t('checkout::Order Summary')}
                                    />
                                    <div className="box-cart point-mall-product">
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
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-12 col-xs-12">
                        <div className="step2-block">
                            <div className="total-cart">
                                <h4 className="total-cart__item">
                                    <span>{t('checkout::Order Detail')}</span>
                                    <span>1 {t('checkout::Item')}</span>
                                </h4>
                                <hr className="total-cart__border" />
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
                                        {t('checkout::{{point}} point(s)', {
                                            point: giftFee ? giftFee.value : 0
                                        })}
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

                                <div className="total-cart__btn">
                                    {orderLoading && <LoadingIndicator />}
                                    {orderError && (
                                        <AlertMessage type="error">
                                            {orderError.message}
                                        </AlertMessage>
                                    )}
                                    <a
                                        href="#"
                                        className="button button--primary button--full"
                                        onClick={e => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (!orderLoading) {
                                                handleCheckoutPointMall(
                                                    product.id,
                                                    selectedAddress,
                                                    selectedOptions
                                                );
                                            }
                                        }}
                                    >
                                        {t('checkout::SUBMIT')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step2Page;
