import React from 'react';
import { Price } from '@skp/components/Price';
import { useTranslation } from 'react-i18next';

export const OrderHistoryRefundTab = props => {
    const { orderDetail } = props;
    const { t } = useTranslation(['mypage']);

    return (
        <>
            <div className="tab-pane fade invoice show active">
                {orderDetail.credit_memos.map(credit_memo => (
                    <div className="credit-memo" key={credit_memo.id}>
                        <div className="table-customize">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>{t('mypage::Product Name')}</th>
                                        <th>{t('mypage::Product SKU')}</th>
                                        <th>{t('mypage::Price')}</th>
                                        <th>{t('mypage::Qty')}</th>
                                        <th className="txt-right">
                                            {t('mypage::SUB TOTAL')}
                                        </th>
                                        <th>{t('mypage::Discount Amount')}</th>
                                        <th>{t('mypage::Row Total')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {credit_memo.items &&
                                        credit_memo.items.length &&
                                        credit_memo.items.map(item => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="table-customize__info">
                                                        <p className="table-customize__trunc">
                                                            {item.product_name}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="table-customize__txt">
                                                        {item.product_sku}
                                                    </span>
                                                </td>
                                                <td className="txt-bold">
                                                    <span className="table-customize__txt">
                                                        <Price
                                                            currencyCode={
                                                                item
                                                                    .product_sale_price
                                                                    .currency
                                                            }
                                                            value={
                                                                item
                                                                    .product_sale_price
                                                                    .value
                                                            }
                                                        />
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="table-customize__txt">
                                                        {item.quantity_refunded}
                                                    </span>
                                                </td>
                                                <td className="txt-bold">
                                                    <span className="table-customize__txt">
                                                        <Price
                                                            currencyCode={
                                                                orderDetail.currency
                                                            }
                                                            value={
                                                                item
                                                                    .product_sale_price
                                                                    .value *
                                                                item.quantity_refunded
                                                            }
                                                        />
                                                    </span>
                                                </td>
                                                <td className="table-customize__txt">
                                                    <Price
                                                        currencyCode={
                                                            orderDetail.currency
                                                        }
                                                        value={
                                                            item.discounts
                                                                .length
                                                                ? item
                                                                      .discounts[0]
                                                                      .amount
                                                                      .value
                                                                : 0
                                                        }
                                                    />
                                                </td>
                                                <td className="table-customize__txt">
                                                    <Price
                                                        currencyCode={
                                                            orderDetail.currency
                                                        }
                                                        value={
                                                            item
                                                                .product_sale_price
                                                                .value *
                                                                item.quantity_refunded -
                                                            (item.discounts
                                                                .length
                                                                ? item
                                                                      .discounts[0]
                                                                      .amount
                                                                      .value
                                                                : 0)
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="order-total">
                            <div className="order-total__info">
                                <span className="order-total__txt">
                                    {t('mypage::SUB TOTAL')}
                                </span>
                                <span className="order-total__txt">
                                    {t('mypage::Shipping')}
                                </span>
                                <span className="order-total__txt">
                                    {t('mypage::Coupon Code DISCOUNT')}
                                </span>
                                <span className="order-total__txt">
                                    {t('mypage::Adjustment Fee')}
                                </span>
                                <span className="order-total__txt">
                                    {t('mypage::Sale Tax')}
                                </span>
                                <span className="order-total__txt">
                                    {t('mypage::Total')}
                                </span>
                            </div>
                            <div className="order-total__price">
                                <span className="order-total__txt">
                                    <Price
                                        currencyCode={
                                            credit_memo.total.subtotal.currency
                                        }
                                        value={credit_memo.total.subtotal.value}
                                    />
                                </span>
                                <span className="order-total__txt">
                                    <Price
                                        currencyCode={
                                            credit_memo.total.total_shipping
                                                .currency
                                        }
                                        value={
                                            credit_memo.total.total_shipping
                                                .value
                                        }
                                    />
                                </span>
                                <span className="order-total__txt">
                                    <Price
                                        currencyCode={orderDetail.currency}
                                        value={Math.abs(
                                            credit_memo.total.discounts[0]
                                                .amount.value
                                        )}
                                    />
                                </span>
                                <span className="order-total__txt">
                                    <Price
                                        currencyCode={
                                            credit_memo.total.adjustment
                                                .currency
                                        }
                                        value={
                                            credit_memo.total.adjustment.value
                                        }
                                    />
                                </span>
                                <span className="order-total__txt">
                                    <Price
                                        currencyCode={
                                            credit_memo.total.total_tax.currency
                                        }
                                        value={
                                            credit_memo.total.total_tax.value
                                        }
                                    />
                                </span>
                                <span className="order-total__txt">
                                    <Price
                                        currencyCode={
                                            credit_memo.total.grand_total
                                                .currency
                                        }
                                        value={
                                            credit_memo.total.grand_total.value
                                        }
                                    />
                                </span>
                            </div>
                        </div>
                        <br />
                    </div>
                ))}
            </div>
        </>
    );
};
