import React from 'react';
import { Price } from '@skp/components/Price';
import { useTranslation } from 'react-i18next';

export const OrderHistoryPurchaseTab = props => {
    const { orderDetail } = props;
    const { t } = useTranslation(['mypage']);

    return (
        <>
            <div className="tab-pane fade view show active">
                <div className="table-customize">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{t('mypage::Product Name')}</th>
                                <th>{t('mypage::Product SKU')}</th>
                                <th>{t('mypage::Price')}</th>
                                <th className="txt-center">
                                    {t('mypage::SKY POINTS EARNED')}
                                </th>
                                <th>{t('mypage::Qty')}</th>
                                <th className="txt-right">
                                    {t('mypage::SUB TOTAL')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetail.items.map(item => (
                                <tr key={item.product.id}>
                                    <td>
                                        <div className="table-customize__info">
                                            <p className="table-customize__trunc">
                                                {item.product.name}
                                                <br />(
                                                {item.product &&
                                                item.product.sky_point
                                                    ? `${
                                                          item.product.sky_point
                                                      } SKY POINTS`
                                                    : '0 SKY POINT'}
                                                )
                                            </p>
                                            <div className="table-customize__images">
                                                <img
                                                    src={
                                                        item.product.thumbnail
                                                            .url
                                                    }
                                                    alt="img"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="table-customize__txt">
                                            {item.product.sku}
                                        </span>
                                    </td>
                                    <td className="txt-bold">
                                        <span className="table-customize__txt">
                                            <Price
                                                currencyCode={
                                                    orderDetail.currency
                                                }
                                                value={item.product.price}
                                            />
                                        </span>
                                    </td>
                                    <td className="txt-center">
                                        <span className="table-customize__txt">
                                            {item.sky_point_to_earn
                                                ? item.sky_point_to_earn
                                                : '-'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="table-customize__txt">
                                            {t('mypage::Ordered qty')}:{' '}
                                            {item.qty_ordered}
                                            <br />
                                            {t('mypage::Shipped qty')}:{' '}
                                            {item.qty_shipped}
                                            <br />
                                            {t('mypage::Refunded qty')}:{' '}
                                            {item.qty_refunded}
                                        </span>
                                    </td>
                                    <td className="txt-bold txt-right">
                                        <span className="table-customize__txt">
                                            <Price
                                                currencyCode={
                                                    orderDetail.currency
                                                }
                                                value={
                                                    item.product.price *
                                                    item.qty_ordered
                                                }
                                            />
                                        </span>
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
