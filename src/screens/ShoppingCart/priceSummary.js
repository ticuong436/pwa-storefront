import React from 'react';
import { Price } from '@skp/components/Price';
import { Link, resourceUrl } from '@skp/drivers';
import { useTranslation } from 'react-i18next';

const PriceSummary = props => {
    const {
        itemsCount,
        prices,
        earnedSkypoints,
        isListContainInvalidProduct
    } = props;

    const { t } = useTranslation(['checkout', 'apply']);

    const { subtotal } = prices;

    return (
        <>
            <div className="total-cart">
                <div className="total-cart__top">
                    <p className="total-cart__item">
                        <span className="total-cart__name">注文内容</span>
                        <span className="total-cart__value">
                            {itemsCount} 件
                        </span>
                    </p>
                </div>
                <div className="total-cart__middle">
                    <p className="total-cart__item">
                        <span className="total-cart__name">小計</span>
                        <span className="total-cart__value">
                            <Price
                                value={subtotal.value}
                                currencyCode={subtotal.currency}
                            />
                        </span>
                    </p>
                    <p className="total-cart__item">
                        <span className="total-cart__name">送料</span>
                        <span className="total-cart__value">未定</span>
                    </p>
                    <p className="total-cart__item">
                        <span className="total-cart__name">
                            {t('checkout::Gift fee')}
                        </span>
                        <span className="total-cart__value">未定</span>
                    </p>

                    <p className="total-cart__item">
                        <span className="total-cart__name">消費税</span>
                        <span className="total-cart__value">対象外</span>
                    </p>
                </div>
                <div className="total-cart__last">
                    <p className="total-cart__price txt-semibold">
                        <span className="total-cart__name">Total (INCL. PREVAILING GST)</span>
                        <span className="total-cart__value">
                            <Price
                                value={subtotal.value}
                                currencyCode={subtotal.currency}
                            />
                        </span>
                    </p>
                    <p className="total-cart__price txt-semibold color-gold">
                        <span className="total-cart__name">
                            {t('checkout::SKY POINTS EARNED')}
                        </span>
                        <span className="total-cart__value">
                            {earnedSkypoints && earnedSkypoints.value}
                        </span>
                    </p>
                    <div className="total-cart__btn">
                        <Link
                            className={`button button--primary button--full ${
                                isListContainInvalidProduct
                                    ? 'button--none no-cursor'
                                    : ''
                            }`}
                            to={
                                isListContainInvalidProduct
                                    ? '#'
                                    : resourceUrl('/checkout/first-step')
                            }
                        >
                            {t('checkout::Proceed to Checkout')}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PriceSummary;
