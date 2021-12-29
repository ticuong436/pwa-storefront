import React from 'react';
import { Price } from '@skp/components/Price';
import { useCoupon } from './useCoupon';
import { useSkyPoint } from './useSkyPoint';
import { useTranslation } from 'react-i18next';
import icon from 'design/dest/images/ic-check.png';

const DEFAULT_REDEEM_METHOD = 1;

export default function DetailPrice({
    cartId,
    appliedCoupons,
    onCouponChanged,
    priceData,
    skyPoints,
    setShowModal,
    onSkyPointsRedeemed,
    numberProduct,
    goToCheckoutStep3,
    earnedSkypoints,
    giftFee,
    canGoToNextStep
}) {
    const talonProps = useCoupon(cartId, onCouponChanged, appliedCoupons);
    const {
        applyCoupon,
        couponCode,
        removeCoupon,
        setCouponCode,
        error,
        isShowInputCoupon,
        setShowInputCoupon,
        isApplying
    } = talonProps;

    const initialRedeemedSkypoints = priceData.redeemed_skypoints
        ? priceData.redeemed_skypoints.value
        : 0;

    const { redeemSkyPoints } = useSkyPoint({
        cartId,
        onSkyPointsRedeemed,
        initialRedeemedSkypoints
    });

    const onInputCouponCode = e => {
        if (e.which === 13) {
            applyCoupon(e.target.value);
        }
    };

    const { t } = useTranslation(['checkout', 'common']);

    return (
        <div className="step2-block">
            <div className="total-cart">
                <h4 className="total-cart__item">
                    <span>{t('checkout::Order Detail')}</span>
                    <span>
                        {numberProduct} {t('checkout::Item')}
                    </span>
                </h4>
                <div className="">
                    {!priceData.discounts ? (
                        <div className="total-cart__middle">
                            {!error && !isShowInputCoupon && !isApplying && (
                                <p className="total-cart__item">
                                    <span>{t('checkout::Coupon code')}</span>
                                    <a
                                        className="txt-underline"
                                        onClick={e => {
                                            e.preventDefault();
                                            setShowInputCoupon(true);
                                        }}
                                        href="#"
                                    >
                                        {t('common::Click here')}
                                    </a>
                                </p>
                            )}
                            {(isShowInputCoupon || isApplying) && (
                                <p className="total-cart__item">
                                    <input
                                        type="text"
                                        className="modal-customize-box--input box-border w-60p"
                                        value={couponCode}
                                        onKeyPress={e => onInputCouponCode(e)}
                                        onChange={e => {
                                            setCouponCode(e.target.value);
                                        }}
                                    />
                                    <a
                                        className="txt-underline"
                                        onClick={e => {
                                            e.preventDefault();
                                            applyCoupon(couponCode);
                                        }}
                                        href="#"
                                    >
                                        {t('common::Apply')}
                                    </a>
                                </p>
                            )}

                            {error && !isShowInputCoupon && (
                                <p className="total-cart__item">
                                    <label className="color-red">
                                        {t('checkout::Incorrect Coupon code')}
                                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                                    </label>
                                    <a
                                        className="txt-underline"
                                        onClick={e => {
                                            e.preventDefault();
                                            setShowInputCoupon(true);
                                        }}
                                        href="#"
                                    >
                                        {t('checkout::Enter Again')}
                                    </a>
                                </p>
                            )}
                        </div>
                    ) : (
                        <hr className="total-cart__border" />
                    )}
                    <p className="total-cart__item">
                        <span>{t('checkout::Subtotal')}</span>
                        <span>
                            {priceData.subtotal ? (
                                <Price
                                    value={priceData.subtotal.value}
                                    currencyCode={priceData.subtotal.currency}
                                />
                            ) : null}
                        </span>
                    </p>
                    <p className="total-cart__item">
                        <span>{t('checkout::Shipping')}</span>
                        <span>
                            {priceData.shipping &&
                            priceData.shipping[0] &&
                            priceData.shipping[0].selected_shipping_method ? (
                                <Price
                                    value={
                                        priceData.shipping[0]
                                            .selected_shipping_method.amount
                                            .value +
                                        priceData.additional_shipping_fee.value
                                    }
                                    currencyCode={
                                        priceData.shipping[0]
                                            .selected_shipping_method.amount
                                            .currency
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
                                    currencyCode={priceData.total.currency}
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
                {priceData.discounts && priceData.discounts[0] ? (
                    <div className="total-cart__top">
                        <p className="total-cart__item">
                            <span>{t('checkout::Coupon code discount')}</span>
                            <span>
                                {'– '}
                                <Price
                                    value={priceData.discounts[0].amount.value}
                                    currencyCode={
                                        priceData.discounts[0].amount.currency
                                    }
                                />
                            </span>
                        </p>
                        <div className="total-cart__item color-sub">
                            <div className="total-cart__sub">
                                <span>
                                    {t('checkout::SKYOFF')}{' '}
                                    {priceData.discounts[0].amount.value}
                                </span>
                                &nbsp;&nbsp;
                                <div
                                    className="location-boxes"
                                    onClick={() => removeCoupon()}
                                >
                                    <img
                                        src={icon}
                                        className="cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    ''
                )}
                {priceData.redeemed_skypoints &&
                priceData.redeemed_skypoints.value ? (
                    <div className="total-cart__middle">
                        <p className="total-cart__item">
                            <span>{t('checkout::SKY POINTS Redeemed')}</span>
                            <span>
                                {'– '}
                                <Price
                                    value={priceData.redeemed_skypoints.value}
                                    currencyCode={
                                        priceData.redeemed_skypoints.currency
                                    }
                                />
                            </span>
                        </p>
                        <div className="total-cart__item color-sub">
                            <div className="total-cart__sub">
                                <span>
                                    {priceData.redeemed_skypoints.value}
                                </span>
                                &nbsp;&nbsp;
                                <div
                                    className="location-boxes"
                                    onClick={e => {
                                        redeemSkyPoints(
                                            0,
                                            DEFAULT_REDEEM_METHOD
                                        );
                                        e.preventDefault();
                                    }}
                                >
                                    <img
                                        src={icon}
                                        className="cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="total-cart__middle">
                        <p className="total-cart__item">
                            <span>{t('checkout::REDEEMABLE SKY POINTS')}</span>
                            <a
                                className="txt-underline"
                                onClick={e => {
                                    e.preventDefault();
                                    setShowModal(true);
                                }}
                                href="#"
                            >
                                {t('checkout::Redeem Method')}
                            </a>
                        </p>
                        <div className="total-cart__item">
                            <label htmlFor="for">
                                {skyPoints}
                                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                            </label>
                        </div>
                    </div>
                )}
            </div>
            <div className="total-cart__last">
                <p className="total-cart__price txt-semibold">
                    <span>{t('checkout::Total')}</span>
                    <span>
                        {priceData.total ? (
                            <Price
                                value={
                                    priceData.total.value +
                                    priceData.additional_shipping_fee.value
                                }
                                currencyCode={priceData.total.currency}
                            />
                        ) : null}
                    </span>
                </p>
                <p className="total-cart__price txt-semibold color-gold">
                    <span>{t('checkout::SKY POINTS EARNED')}</span>
                    <span>{earnedSkypoints && earnedSkypoints.value}</span>
                </p>
                <div className="total-cart__btn">
                    <button
                        className={`button button--primary button--full ${
                            !canGoToNextStep ? 'button--none' : ''
                        }`}
                        disabled={!canGoToNextStep}
                        onClick={goToCheckoutStep3}
                    >
                        <span>{t('checkout::PROCEED TO CONFIRM')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
