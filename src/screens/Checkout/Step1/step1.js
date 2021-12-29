import React from 'react';
import ProductListing from './productListing';
import SelectShippingAddress from './selectShippingAddress';
import { useStep1 } from './useStep1';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { Price } from '@skp/components/Price';
import ShippingAddressForm from './shippingAddressForm';
import { useListAddress } from './useListAddress';
import { Form } from 'informed';
import { resourceUrl } from '@skp/drivers';
import { useGiftFee } from '@skp/screens/Checkout/useGiftFee';
import MainPageTitle from '@skp/components/MainPageTitle';
import { useTranslation } from 'react-i18next';
import AlertMessage from '@skp/components/AlertMessage';
import { GET_FULL_CART_DETAILS } from './getFullCartDetail.gql';

const Step1 = () => {
    const talonProps = useStep1({
        queries: {
            getCartDetails: GET_FULL_CART_DETAILS
        }
    });

    const {
        itemQuantity,
        setIsCartUpdating,
        shouldShowLoadingIndicator,
        shippingAddressActionPage,
        setShippingAddressActionPage,
        actionType,
        handleSubmit,
        state,
        removeInitialValue,
        validateTicketOrderInfo,
        apiRef,
        flatData: priceData,
        refetchPrice,
        earnedSkypoints,
        items,
        setForceRender,
        isListContainInvalidProduct
    } = talonProps;

    const { t } = useTranslation(['checkout']);

    const {
        addresses,
        isLoadingAddresses,
        selectAddress,
        selectedAddress,
        isSelectingAddress,
        refreshAddresses
    } = useListAddress({ state, setForceRender });

    const { giftFee, calculateGiftFee } = useGiftFee({ refetchPrice });

    if (shouldShowLoadingIndicator) {
        return <LoadingIndicator />;
    }

    if (!itemQuantity) {
        return (
            <AlertMessage type="warning">
                {t('checkout::There are no items in your cart.')}
            </AlertMessage>
        );
    }

    return (
        <>
            <ShippingAddressForm
                actionPage={shippingAddressActionPage}
                setActionPage={setShippingAddressActionPage}
                actionType={actionType}
                refreshAddresses={refreshAddresses}
                allowChangeDefaultShipping={true}
                formPopup={true}
            />
            <Form
                apiRef={apiRef}
                onSubmit={values => handleSubmit(values, selectedAddress)}
                onChange={form => calculateGiftFee(form.values.orderOptions)}
                initialValues={state ? state : {}}
            >
                <div className="">
                    <MainPageTitle
                        title={t('checkout::Checkout')}
                        link={{
                            url: resourceUrl('/cart'),
                            title: t('checkout::Edit Cart')
                        }}
                    />
                    <div className="checkout-step">
                        <div className="order-shipping">
                            <p className="order--step">
                                {t('checkout::Step {{step}}', { step: 1 })}
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
                                <div className="reg-hexagon order-item">
                                    <span>3</span>
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
                                <div className="box-cart">
                                    <ProductListing
                                        setForceRender={setForceRender}
                                        items={items}
                                        tmpSelectedOption={
                                            state ? state.orderOptionsTmp : {}
                                        }
                                        setIsCartUpdating={setIsCartUpdating}
                                        removeInitialValue={removeInitialValue}
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
                                        setIsCartUpdating={setIsCartUpdating}
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
                                                {itemQuantity}{' '}
                                                {t('checkout::Item')}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="total-cart__middle">
                                        <p className="total-cart__item">
                                            <span className="total-cart__name">
                                                {t('checkout::Subtotal')}
                                            </span>
                                            <span className="total-cart__value">
                                                {priceData.subtotal ? (
                                                    <Price
                                                        value={
                                                            priceData.subtotal
                                                                .value
                                                        }
                                                        currencyCode={
                                                            priceData.subtotal
                                                                .currency
                                                        }
                                                    />
                                                ) : null}
                                            </span>
                                        </p>
                                        <p className="total-cart__item">
                                            <span className="total-cart__name">
                                                {t('checkout::Shipping')}
                                            </span>
                                            <span className="total-cart__value">
                                                {priceData.shipping &&
                                                priceData.shipping[0] &&
                                                priceData.shipping[0]
                                                    .selected_shipping_method ? (
                                                    <Price
                                                        value={
                                                            priceData
                                                                .shipping[0]
                                                                .selected_shipping_method
                                                                .amount.value +
                                                            priceData
                                                                .additional_shipping_fee
                                                                .value
                                                        }
                                                        currencyCode={
                                                            priceData
                                                                .shipping[0]
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
                                            <span className="total-cart__name">
                                                {t('checkout::Gift fee')}
                                            </span>
                                            <span className="total-cart__value">
                                                {giftFee ? (
                                                    <Price
                                                        value={giftFee.value}
                                                        currencyCode={
                                                            giftFee.currency
                                                        }
                                                    />
                                                ) : priceData.total ? (
                                                    <Price
                                                        value={0}
                                                        currencyCode={
                                                            priceData.total
                                                                .currency
                                                        }
                                                    />
                                                ) : (
                                                    ''
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
                                                {priceData.total ? (
                                                    <Price
                                                        value={
                                                            priceData.total
                                                                .value +
                                                            priceData
                                                                .additional_shipping_fee
                                                                .value
                                                        }
                                                        currencyCode={
                                                            priceData.total
                                                                .currency
                                                        }
                                                    />
                                                ) : null}
                                            </span>
                                        </p>
                                        <p className="total-cart__price txt-semibold color-gold">
                                            <span className="total-cart__name">
                                                {t(
                                                    'checkout::SKY POINTS EARNED'
                                                )}
                                            </span>
                                            <span className="total-cart__value">
                                                {earnedSkypoints &&
                                                    earnedSkypoints.value}
                                            </span>
                                        </p>
                                        <div className="total-cart__btn">
                                            <button
                                                type="button"
                                                className={`button button--primary button--full ${
                                                    isListContainInvalidProduct
                                                        ? 'button--none'
                                                        : ''
                                                }`}
                                                disabled={
                                                    isSelectingAddress ||
                                                    isListContainInvalidProduct
                                                }
                                                onClick={() => {
                                                    if (!selectedAddress.id) {
                                                        alert(
                                                            'Please select a address!'
                                                        );
                                                    } else {
                                                        validateTicketOrderInfo();
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
