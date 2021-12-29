import React from 'react';
import { Price } from '@skp/components/Price';
import {
    Redirect,
    resourceUrl,
    useLocation,
    useParams,
    Link
} from '@skp/drivers';
import ProductDetail from '@skp/screens/Checkout/Step3/productDetail';
import { useStep3 } from './useStep3';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import CreditCardIcon from '@skp/components/CreditCardIcon';
import { useTranslation } from 'react-i18next';
import { Title } from '@magento/venia-ui/lib/components/Head';
import AlertMessage from '@skp/components/AlertMessage';
import { getPriceSelling } from '@skp/utils/product';
import { getErrorMessage } from '@skp/utils/graphqlError';
import MainPageTitle from '@skp/components/MainPageTitle';

const Step3Page = () => {
    const { product_id: productId } = useParams();

    const location = useLocation();
    const {
        handleCheckoutLottery,
        submitting,
        submitError,
        giftFee,
        selectedOptions,
        selectedCard,
        selectedAddress,
        product,
        state
    } = useStep3(productId);

    const { t } = useTranslation(['checkout', 'common']);

    if (!state) {
        return (
            <Redirect
                to={resourceUrl(
                    `/product/${productId}/lottery-checkout/first-step`
                )}
            />
        );
    }

    if (state.product.is_applied_lottery_product) {
        return (
            <ErrorView>
                <h1>{t('checkout::The product has been applied')}</h1>
            </ErrorView>
        );
    }

    const { price_selling: productPrice, currency } = getPriceSelling(product);

    return (
        <>
            <Title>{t('checkout::Checkout')}</Title>
            <div className="checkout-wrap">
                <div className="">
                    <div className="checkout-edit-box">
                        <div>
                            <MainPageTitle title={t('checkout::Checkout')}>
                                <Link
                                    to={{
                                        pathname: resourceUrl(
                                            `/product/${productId}/lottery-checkout/second-step`
                                        ),
                                        state: {
                                            ...location.state,
                                            selectedCard
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
                                        title={t(
                                            'checkout::Confirm Your Order'
                                        )}
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
                                                    {`${
                                                        selectedAddress.lastname
                                                    } ${
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
                                        <div className="address-container col-xl-6 col-lg-6 col-md-12 col-xs-12">
                                            <div className="address-ship">
                                                <div className="address--pay">
                                                    {t('checkout::Payment')}
                                                </div>
                                                <div className="address--name">
                                                    <CreditCardIcon
                                                        brand={
                                                            selectedCard.brand
                                                        }
                                                        className=""
                                                    />
                                                    **** **** ****{' '}
                                                    {selectedCard.last4}
                                                </div>
                                                <div className="address--text">
                                                    {selectedCard.exp_month}/
                                                    {selectedCard.exp_year}
                                                </div>
                                                <div className="address--text">
                                                    {selectedCard.name}
                                                </div>
                                                <div className="address--text">
                                                    {selectedCard.postal_code}
                                                </div>
                                                <div className="address--text">
                                                    {selectedCard.state}
                                                </div>
                                                <div className="address--text">
                                                    {
                                                        selectedCard.address_street1
                                                    }{' '}
                                                    日本
                                                </div>
                                                <div className="address--text">
                                                    {
                                                        selectedCard.address_street2
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="checkout-step__address">
                                        <MainPageTitle
                                            title={t('checkout::Order Summary')}
                                        />
                                    </div>

                                    <div className="box-cart lottery-product">
                                        <ProductDetail
                                            item={product}
                                            optionSelected={selectedOptions}
                                            allOptions={product.order_options}
                                            isLottery={true}
                                            price={productPrice}
                                            currency={currency}
                                        />
                                    </div>
                                </div>
                            </div>
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
                                        <p className="total-cart__item">
                                            <span>{t('checkout::Tax')}</span>
                                            <span>
                                                {t('checkout::Not apply')}
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
                                        <span>{product.sky_point}</span>
                                    </p>
                                    <div className="total-cart__btn">
                                        {submitting && <LoadingIndicator />}
                                        {submitError && (
                                            <AlertMessage type="error">
                                                {getErrorMessage(submitError)}
                                            </AlertMessage>
                                        )}
                                        <a
                                            href="#"
                                            className="button button--primary button--full"
                                            onClick={e => {
                                                e.preventDefault();

                                                if (!submitting) {
                                                    handleCheckoutLottery(
                                                        product.id,
                                                        selectedAddress,
                                                        selectedCard,
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
        </>
    );
};

export default Step3Page;
