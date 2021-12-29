import React from 'react';
import { Price } from '@skp/components/Price';
import Pagination from '@skp/components/Pagination';
import ItemPerPage from '@skp/components/ItemPerPage';
import { Link, resourceUrl } from '@skp/drivers';
import { useListCustomerOrder } from './useListCustomerOrder';
import { LIST_ITEM_PER_PAGE } from '@skp/utils/listItemPerpage';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useTranslation } from 'react-i18next';
import AlertMessage from '@skp/components/AlertMessage';


export default function OrderList() {
    const talonProps = useListCustomerOrder();
    const { t } = useTranslation(['mypage', 'order_status']);

    const {
        pageControl,
        orderItems,
        totalCount,
        pageSize,
        currentPage,
        setPageSize,
        loading,
        error
    } = talonProps;

    if (error && currentPage === 1 && !loading) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
        return <div>Data Fetch Error</div>;
    }

    if (loading) {
        return <LoadingIndicator />;
    }

    const NoOrder = () => {
        return (
            <>
                <div className="main-content__top">
                    <h2 className="main-content__title">
                        {t('navigation::My Orders')}
                        <span>(0)</span>
                    </h2>
                </div>
                <AlertMessage type="warning">
                    {t('mypage::There is no history')}
                </AlertMessage>
            </>
        );
    };

    const HasOrder = items => {
        return (
            <>
                <div className={`main-content__top `}>
                    <h2 className="main-content__title">
                        {t('navigation::My Orders')}
                        <span>({totalCount})</span>
                    </h2>
                </div>
                <div className="order-list__table order-pc">
                    <div className="table-customize">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="w--10">
                                        {t('mypage::Order ID')}
                                    </th>
                                    <th>{t('mypage::ORDER DATE')}</th>
                                    <th className="th-shipping_name">
                                        {t('mypage::SHIPPED TO')}
                                    </th>
                                    <th className="txt-center">
                                        {t('mypage::SUB TOTAL')}
                                    </th>
                                    <th className="txt-center w--10">
                                        {t('mypage::SKY DOLLAR EARNED')}
                                    </th>
                                    <th className="txt-center w--120">
                                        {t('mypage::SKY DOLLAR REDEEMED')}
                                    </th>
                                    <th className="txt-center">
                                        {t('mypage::STATUS')}
                                    </th>
                                    <th className="txt-center " />
                                </tr>
                            </thead>
                            <tbody className="txt-center">
                                {items.items.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <span className="table-customize__txt">
                                                {item.number}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="table-customize__txt nowrap">
                                                {item.order_date}
                                            </span>
                                        </td>
                                        <td>
                                            <p className="table-customize__trunc">
                                                {item.shipping_address
                                                    ? item.shipping_address
                                                        .lastname +
                                                    ' ' +
                                                    item.shipping_address
                                                        .firstname
                                                    : ''}
                                            </p>
                                        </td>
                                        <td className="txt-center">
                                            <span className="table-customize__txt nowrap">
                                                <Price
                                                    currencyCode={
                                                        item.subtotal.currency
                                                    }
                                                    value={item.subtotal.value}
                                                />
                                            </span>
                                        </td>
                                        <td className="txt-center">
                                            <span className="table-customize__txt">
                                                {item.skypoint_earned !== null
                                                    ? item.skypoint_earned
                                                    : '-'}
                                            </span>
                                        </td>
                                        <td className="txt-center">
                                            <span className="table-customize__txt nowrap">
                                                {item.skypoint_redeemed}
                                            </span>
                                        </td>
                                        <td className="txt-center">
                                            <span className="table-customize__txt text-capitalize">
                                                {t(
                                                    'order_status::' +
                                                    item.status
                                                )}
                                            </span>
                                        </td>
                                        <td className="txt-center">
                                            <Link
                                                className="table-customize__link"
                                                to={resourceUrl(
                                                    'mypage/order-history/view/order_id/' +
                                                        item.number
                                                )}
                                            >
                                                {t('mypage::Detail')}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mobile-order">
                    {items.items.map(item => (
                        <div className="mobile-list" key={item.id}>
                            <div className="mobile-list-block">
                                <div className="mobile-list-title">
                                    <div className="mobile-item">
                                        <span className="mobile--title">
                                            {t('mypage::Order ID')}
                                        </span>
                                        <span className="mobile--text">
                                            {item.number}
                                        </span>
                                    </div>
                                </div>
                                <div className="mobile-list-content">
                                    <div className="mobile-item">
                                        <span className="mobile--title">
                                            {t('mypage::ORDER DATE')}
                                        </span>
                                        <span className="mobile--text">
                                            {item.order_date}
                                        </span>
                                    </div>
                                    <div className="mobile-item">
                                        <span className="mobile--title">
                                            {t('mypage::SHIPPED TO')}
                                        </span>
                                        <span className="mobile--text">
                                            {item.shipping_address
                                                ? item.shipping_address
                                                    .lastname +
                                                ' ' +
                                                item.shipping_address
                                                    .firstname
                                                : ''}
                                        </span>
                                    </div>
                                    <div className="mobile-item">
                                        <span className="mobile--title">
                                            {t('mypage::SUB TOTAL')}
                                        </span>
                                        <span className="mobile--text">
                                            <Price
                                                currencyCode={
                                                    item.subtotal.currency
                                                }
                                                value={item.subtotal.value}
                                            />
                                        </span>
                                    </div>
                                    <div className="mobile-item">
                                        <span className="mobile--title">
                                            {t('mypage::SKY POINTS EARNED')}
                                        </span>
                                        <span className="mobile--text">
                                            {item.skypoint_earned !== null
                                                ? item.skypoint_earned
                                                : '-'}
                                        </span>
                                    </div>
                                    <div className="mobile-item">
                                        <span className="mobile--title">
                                            {t('mypage::SKY POINTS USED')}
                                        </span>
                                        <span className="mobile--text">
                                            {item.skypoint_redeemed}
                                        </span>
                                    </div>
                                    <div className="mobile-item">
                                        <span className="mobile--title">
                                            {t('mypage::STATUS')}
                                        </span>
                                        <span className="mobile--text">
                                            {t('order_status::' + item.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mobile-view">
                                <Link
                                    className="table-customize__link"
                                    to={resourceUrl(
                                        'mypage/order-history/view/order_id/' +
                                            item.number
                                    )}
                                >
                                    {t('mypage::Invoice')}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pagination">
                    <Pagination pageControl={pageControl} />
                    <ItemPerPage
                        listItems={LIST_ITEM_PER_PAGE}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                    />
                </div>
            </>
        );
    };

    return (
        <div className="mypage order-list">
            {orderItems && orderItems.length ? (
                <HasOrder items={orderItems} />
            ) : (
                <NoOrder />
            )}
        </div>
    );
}
