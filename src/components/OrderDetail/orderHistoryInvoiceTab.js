import React from 'react';
import { Price } from '@skp/components/Price';
import { useTranslation } from 'react-i18next';

export const OrderHistoryInvoiceTab = props => {
    const { orderDetail } = props;
    const { t } = useTranslation(['mypage']);

    return (
        <>
            <div className="tab-pane fade invoice show active">
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
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetail.invoices.map(element =>
                                element.items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="table-customize__info">
                                                <p className="table-customize__trunc">
                                                    {item.product_name}
                                                    <br />(
                                                    {orderDetail.items &&
                                                    orderDetail.items[index] &&
                                                    orderDetail.items[index]
                                                        .product &&
                                                    orderDetail.items[index]
                                                        .product.sky_point
                                                        ? `${
                                                              orderDetail.items[
                                                                  index
                                                              ].product
                                                                  .sky_point
                                                          } SKY POINTS`
                                                        : '0 SKY POINT'}
                                                    )
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
                                                        item.product_sale_price
                                                            .currency
                                                    }
                                                    value={
                                                        item.product_sale_price
                                                            .value
                                                    }
                                                />
                                            </span>
                                        </td>
                                        <td>
                                            <span className="table-customize__txt">
                                                {item.quantity_invoiced}
                                            </span>
                                        </td>
                                        <td className="txt-bold txt-right">
                                            <span className="table-customize__txt">
                                                <Price
                                                    currencyCode={
                                                        item.product_sale_price
                                                            .currency
                                                    }
                                                    value={
                                                        item.product_sale_price
                                                            .value *
                                                        item.quantity_invoiced
                                                    }
                                                />
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
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
                            {t('mypage::GIFT Fee')}
                        </span>
                        <span className="order-total__txt">
                            {t('mypage::Coupon Code DISCOUNT')}
                        </span>
                        <span className="order-total__txt">
                            {t('mypage::Use SKY POINTS')}
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
                                currencyCode={orderDetail.currency}
                                value={orderDetail.sub_total}
                            />
                        </span>
                        <span className="order-total__txt">
                            <Price
                                currencyCode={orderDetail.currency}
                                value={orderDetail.shipping_amount}
                            />
                        </span>
                        <span className="order-total__txt">
                            <Price
                                currencyCode={orderDetail.currency}
                                value={orderDetail.gift_fee}
                            />
                        </span>
                        <span className="order-total__txt">
                            <Price
                                currencyCode={orderDetail.currency}
                                value={Math.abs(orderDetail.discount)}
                            />
                        </span>
                        <span className="order-total__txt">
                            <Price
                                currencyCode={orderDetail.currency}
                                value={orderDetail.skypoint_redeemed}
                            />
                        </span>
                        <span className="order-total__txt">
                            <Price
                                currencyCode={orderDetail.currency}
                                value={orderDetail.tax_amount}
                            />
                        </span>
                        <span className="order-total__txt">
                            <Price
                                currencyCode={orderDetail.currency}
                                value={orderDetail.grand_total}
                            />
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};
