import React, { useEffect, useState } from 'react';
import { useOrderDetail } from './useOrderDetail';
import { Price } from '@skp/components/Price';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { Link, resourceUrl, useParams, Redirect } from '@skp/drivers';
import { OrderHistoryPurchaseTab } from './orderHistoryPurchaseTab';
import { OrderHistoryInvoiceTab } from './orderHistoryInvoiceTab';
import { OrderHistoryShipmentTab } from './orderHistoryShipmentTab';
import { useTranslation } from 'react-i18next';
// import { OrderHistoryRefundTab } from './orderHistoryRefundTab';
import { is404Error } from '@skp/utils/graphqlError';
import { useReceiptPdf } from '@skp/hooks/useReceiptPdf';

export default function OrderDetail() {
    const { id } = useParams();
    const talonProps = useOrderDetail(id);
    const { orderDetail, error, loading } = talonProps;
    const { t } = useTranslation(['mypage', 'order_status']);

    const { downloading: downloadingPdf, downloadPdf } = useReceiptPdf();
    const TAB_PURCHASED = 1;
    const TAB_INVOICE = 2;
    const TAB_SHIPMENT = 3;
    const TAB_REFUND = 4;

    const [currentTab, setCurrentTab] = useState(TAB_PURCHASED);
    const pathname = location.pathname;

    useEffect(() => {
        if (pathname.indexOf('invoice') !== -1) {
            setCurrentTab(TAB_INVOICE);
        }

        if (pathname.indexOf('shipment') !== -1) {
            setCurrentTab(TAB_SHIPMENT);
        }

        if (pathname.indexOf('refund') !== -1) {
            setCurrentTab(TAB_REFUND);
        }
    }, [pathname, setCurrentTab]);

    if (is404Error(error)) {
        return <Redirect to={resourceUrl('/not-found')} />;
    }

    if (error && !loading) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
        return <div>Data Fetch Error</div>;
    }

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <div className="mypage order-list order-list--detail">
            <div className="main-content__top">
                <h2 className="main-content__title">
                    {t('mypage::Order')}
                    <span># {id}</span>
                </h2>
            </div>
            <div className="badge-customize">
                <span className="badge-customize__name text-capitalize">
                    {t('order_status::' + orderDetail.status)}
                </span>
            </div>
            <p className="order-list__des">
                {t('mypage::ORDER DATE')}: {orderDetail.created_at}
            </p>
            {orderDetail.status === 'complete' &&
            orderDetail.payment.amount_ordered > 0 ? (
                <p className="txt-right">
                    <button
                        className="print-order-detail table-customize__link"
                        disabled={downloadingPdf}
                        onClick={e => {
                            e.preventDefault();
                            downloadPdf('SHOPPING', id);
                        }}
                    >
                        {t('mypage::Issue Receipt')}
                    </button>
                </p>
            ) : (
                ''
            )}
            <div className="order-list__tab">
                <div className="tabs-list">
                    <div className="nav tabs-list__nav" role="tablist">
                        <Link
                            className={`tabs-list__link ${
                                currentTab === TAB_PURCHASED ? 'active' : ''
                            }`}
                            to={resourceUrl(
                                `mypage/order-history/view/order_id/${id}`
                            )}
                        >
                            {t('mypage::Purchase')}
                        </Link>
                        {orderDetail.invoices && !!orderDetail.invoices.length && (
                            <Link
                                className={`tabs-list__link ${
                                    currentTab === TAB_INVOICE ? 'active' : ''
                                }`}
                                to={resourceUrl(
                                    `mypage/order-history/invoice/order_id/${id}`
                                )}
                            >
                                {t('mypage::Invoice')}
                            </Link>
                        )}
                        {orderDetail.shipments &&
                            !!orderDetail.shipments.length && (
                                <Link
                                    className={`tabs-list__link ${
                                        currentTab === TAB_SHIPMENT
                                            ? 'active'
                                            : ''
                                    }`}
                                    to={resourceUrl(
                                        `mypage/order-history/shipment/order_id/${id}`
                                    )}
                                >
                                    {t('mypage::Shipment')}
                                </Link>
                            )}
                        {/* {orderDetail.credit_memos &&
                            !!orderDetail.credit_memos.length && (
                                <Link
                                    className={`tabs-list__link ${
                                        currentTab === TAB_REFUND
                                            ? 'active'
                                            : ''
                                    }`}
                                    to={resourceUrl(
                                        `mypage/order-history/refund/order_id/${id}`
                                    )}
                                >
                                    {t('mypage::Refund')}
                                </Link>
                            )} */}
                    </div>
                    <div className="tabs-list__content tab-content">
                        {currentTab === TAB_PURCHASED && (
                            <OrderHistoryPurchaseTab
                                orderDetail={orderDetail}
                            />
                        )}
                        {currentTab === TAB_INVOICE &&
                            orderDetail.invoices &&
                            !!orderDetail.invoices.length && (
                                <OrderHistoryInvoiceTab
                                    orderDetail={orderDetail}
                                />
                            )}
                        {currentTab === TAB_SHIPMENT &&
                            orderDetail.shipments &&
                            !!orderDetail.shipments.length && (
                                <OrderHistoryShipmentTab
                                    shipments={orderDetail.shipments}
                                />
                            )}
                        {/* {currentTab === TAB_REFUND &&
                            orderDetail.credit_memos &&
                            !!orderDetail.credit_memos.length && (
                                <OrderHistoryRefundTab
                                    orderDetail={orderDetail}
                                />
                            )} */}
                    </div>
                </div>
            </div>
            <div className="order-note">
                <div className="order-note__top">
                    <h3 className="order-note__title">
                        {t('mypage::Note Details')}
                    </h3>
                </div>
                <div className="row order-note__content">
                    <div className="col-lg-3 col-md-6 order-note__info">
                        <h4 className="order-note__sub">
                            {t('mypage::Shipping Address')}
                        </h4>
                        {orderDetail.shipping_address && (
                            <ul className="order-note__list">
                                <li className="order-note__item">
                                    <span className="order-note__txt">
                                        {orderDetail.shipping_address.lastname}{' '}
                                        {orderDetail.shipping_address.firstname}
                                    </span>
                                </li>
                                <li className="order-note__item">
                                    <span className="order-note__txt">
                                        {t('mypage::Singapore')}{' '}
                                        {orderDetail.shipping_address.postcode}
                                    </span>
                                </li>
                                <li className="order-note__item">
                                    <span className="order-note__txt">
                                        {orderDetail.shipping_address.region}{' '}
                                        {orderDetail.shipping_address.city}{' '}
                                        {orderDetail.shipping_address
                                            .street[0] || null}
                                    </span>
                                </li>
                                <li className="order-note__item">
                                    <span className="order-note__txt">
                                        {orderDetail.shipping_address
                                            .street[1] || null}
                                    </span>
                                </li>
                                <li className="order-note__item">
                                    <span className="order-note__txt">
                                        {orderDetail.shipping_address.telephone}
                                    </span>
                                </li>
                            </ul>
                        )}
                    </div>
                    <div className="col-lg-3 col-md-6 order-note__info">
                        <h4 className="order-note__sub">
                            {t('mypage::Delivery Method')}
                        </h4>
                        <ul className="order-note__list">
                            <li className="order-note__item">
                                <span className="order-note__txt">
                                    {orderDetail.shipping_method}
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-3 col-md-6 order-note__info">
                        <h4 className="order-note__sub">
                            {t('mypage::Billing Address')}
                        </h4>
                        <ul className="order-note__list">
                            <li className="order-note__item">
                                {orderDetail.billing_address != null && (
                                    <span className="order-note__txt">
                                        {orderDetail.billing_address.lastname}{' '}
                                        {orderDetail.billing_address.firstname}
                                    </span>
                                )}
                            </li>
                            <li className="order-note__item">
                                {orderDetail.billing_address != null && (
                                    <span className="order-note__txt">
                                        {
                                            orderDetail.billing_address.country
                                                .label
                                        }{' '}
                                        {orderDetail.billing_address.postcode}
                                    </span>
                                )}
                            </li>
                            <li className="order-note__item">
                                {orderDetail.billing_address != null && (
                                    <span className="order-note__txt">
                                        {orderDetail.billing_address.region}{' '}
                                        {orderDetail.billing_address.city}{' '}
                                        {orderDetail.billing_address
                                            .street[0] || null}
                                    </span>
                                )}
                            </li>
                            <li className="order-note__item">
                                {orderDetail.billing_address != null && (
                                    <span className="order-note__txt">
                                        {orderDetail.billing_address
                                            .street[1] || null}
                                    </span>
                                )}
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-3 col-md-6 order-note__info">
                        <h4 className="order-note__sub">
                            {t('mypage::Payment Method')}
                        </h4>
                        <ul className="order-note__list">
                            <li className="order-note__item">
                                <span className="order-note__name">
                                    {t('mypage::Payment')}:
                                </span>
                                <span className="order-note__value">
                                    {orderDetail.payment ? 'Paid' : 'Unpaid'}
                                </span>
                            </li>
                            <li className="order-note__item">
                                <span className="order-note__name">
                                    {t('mypage::Brand')}:
                                </span>
                                <span className="order-note__value text-capitalize">
                                    {orderDetail.payment.brand}
                                </span>
                            </li>
                            <li className="order-note__item">
                                <span className="order-note__name">
                                    {t('mypage::Card Number')}:
                                </span>
                                <span className="order-note__value">
                                    xxxx-{orderDetail.payment.card_last4}
                                </span>
                            </li>
                            <li className="order-note__item">
                                <span className="order-note__name">
                                    {t('mypage::Payment Amount')}:
                                </span>
                                <span className="order-note__value">
                                    <Price
                                        currencyCode={orderDetail.currency}
                                        value={
                                            orderDetail.payment.amount_ordered
                                        }
                                    />
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
