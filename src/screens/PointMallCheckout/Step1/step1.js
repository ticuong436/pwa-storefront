import React from 'react';
import SelectShippingAddress from '@skp/screens/Checkout/Step1/selectShippingAddress';
import { useStep1 } from './useStep1';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import ShippingAddressForm from '@skp/screens/Checkout/Step1/shippingAddressForm';
import { Form } from 'informed';
import ProductDetail from '@skp/screens/Checkout/Step1/productDetail';
import { useParams, Link, resourceUrl } from '@skp/drivers';
import MainPageTitle from '@skp/components/MainPageTitle';
import { useTranslation } from 'react-i18next';
import AlertMessage from '@skp/components/AlertMessage';
import { getPriceSelling } from '@skp/utils/product';

const Step1 = () => {
    const { product_id: productId } = useParams();

    const { t } = useTranslation(['checkout', 'validation']);

    const {
        addresses,
        isLoadingAddresses,
        selectAddress,
        selectedAddress,
        isSelectingAddress,
        refreshAddresses,
        shouldShowLoadingIndicator,
        product,
        shippingAddressActionPage,
        setShippingAddressActionPage,
        actionType,
        handleSubmit,
        state,
        removeInitialValue,
        giftFee,
        calculateGiftFee
    } = useStep1({
        productId
    });

    if (shouldShowLoadingIndicator || isLoadingAddresses) {
        return <LoadingIndicator />;
    }

    if (!product) {
        return (
            <AlertMessage type="warning">
                {t("checkout::Can't find product")}
            </AlertMessage>
        );
    }

    const { price_selling: productPrice, currency } = getPriceSelling(product);

    return (
        <>
            <ShippingAddressForm
                actionPage={shippingAddressActionPage}
                setActionPage={setShippingAddressActionPage}
                actionType={actionType}
                refreshAddresses={refreshAddresses}
                allowChangeDefaultShipping={false}
                formPopup={true}
            />

            <Form
                onSubmit={handleSubmit}
                initialValues={state ? state : {}}
                onChange={form => calculateGiftFee([form.values])}
            >
                <div className="">
                    <MainPageTitle title={t('checkout::Checkout')}>
                        <Link
                            className="main-content__link"
                            to={resourceUrl(`/product/${productId}`)}
                        >
                            {t('checkout::Back to detail')}
                        </Link>
                    </MainPageTitle>
                    <div className="checkout-step">
                        <div className="order-shipping">
                            <p className="order--step">
                                {t('checkout::Step 1')}
                            </p>
                            <h2 className="order--title">
                                {t('checkout::Order Detail & Shipping')}
                            </h2>
                            <div className="reg-list order-box">
                                <div className="reg-hexagon order-item reg-hexagon-active">
                                    <span>1</span>
                                </div>
                                <div className="reg-hexagon order-item">
                                    <span className="reg-text">2</span>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-9 col-md-12 checkout-left">
                                <MainPageTitle
                                    title={t(
                                        'checkout::Edit Your Order Detail'
                                    )}
                                />
                                <div className="box-cart point-mall-product">
                                    <ProductDetail
                                        item={product}
                                        isLottery={true}
                                        isPointMall={true}
                                        tmpSelectedOption={state}
                                        removeInitialValue={removeInitialValue}
                                        price={productPrice}
                                        currency={currency}
                                    />
                                </div>
                                <div className="checkout-step__address">
                                    <MainPageTitle
                                        title={t(
                                            'checkout::Select Your Shipping Address'
                                        )}
                                    >
                                        <a
                                            className="main-content__action"
                                            href="#"
                                            data-toggle="modal"
                                            data-target="#modal-shipping-address"
                                            onClick={e => {
                                                e.preventDefault();
                                                setShippingAddressActionPage({
                                                    type: actionType.ACTION_ADD
                                                });
                                            }}
                                        >
                                            {t(
                                                'checkout::Add new shipping address'
                                            )}
                                        </a>
                                    </MainPageTitle>
                                    <SelectShippingAddress
                                        setActionPage={
                                            setShippingAddressActionPage
                                        }
                                        actionType={actionType}
                                        addresses={addresses}
                                        isLoadingAddresses={isLoadingAddresses}
                                        selectAddress={selectAddress}
                                        selectedAddress={selectedAddress}
                                        isSelectingAddress={isSelectingAddress}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-12">
                                <div className="total-cart">
                                    <div className="total-cart__top">
                                        <p className="total-cart__item">
                                            <span className="total-cart__name">
                                                {t('checkout::Order Detail')}
                                            </span>
                                            <span className="total-cart__value">
                                                1 {t('checkout::Item')}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="total-cart__middle">
                                        <p className="total-cart__item">
                                            <span className="total-cart__name">
                                                {t('checkout::Subtotal')}
                                            </span>
                                            <span className="total-cart__value">
                                                {t(
                                                    'checkout::{{point}} point(s)',
                                                    {
                                                        point: productPrice
                                                    }
                                                )}
                                            </span>
                                        </p>
                                        <p className="total-cart__item">
                                            <span className="total-cart__name">
                                                {t('checkout::Shipping')}
                                            </span>
                                            <span className="total-cart__value">
                                                {t(
                                                    'checkout::Shipping included'
                                                )}
                                            </span>
                                        </p>
                                        <p className="total-cart__item">
                                            <span className="total-cart__name">
                                                {t('checkout::Gift fee')}
                                            </span>
                                            <span className="total-cart__value">
                                                {t(
                                                    'checkout::{{point}} point(s)',
                                                    {
                                                        point: giftFee
                                                            ? giftFee.value
                                                            : 0
                                                    }
                                                )}
                                            </span>
                                        </p>
                                        <p className="total-cart__item">
                                            <span className="total-cart__name">
                                                {t('checkout::Tax')}
                                            </span>
                                            <span className="total-cart__value">
                                                {t('checkout::Not apply')}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="total-cart__last">
                                        <p className="total-cart__price txt-semibold">
                                            <span className="total-cart__name">
                                                {t('checkout::Total')}
                                            </span>
                                            <span className="total-cart__value">
                                                {t(
                                                    'checkout::{{point}} point(s)',
                                                    {
                                                        point:
                                                            productPrice +
                                                            (giftFee
                                                                ? giftFee.value
                                                                : 0)
                                                    }
                                                )}
                                            </span>
                                        </p>
                                        <div className="total-cart__btn">
                                            <button
                                                className="button button--primary button--full"
                                                type="submit"
                                                disabled={isSelectingAddress}
                                                onClick={event => {
                                                    if (!selectedAddress.id) {
                                                        alert(
                                                            'Please select a address!'
                                                        );
                                                        event.preventDefault();
                                                    }
                                                }}
                                            >
                                                {t('checkout::NEXT')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </>
    );
};

export default Step1;
