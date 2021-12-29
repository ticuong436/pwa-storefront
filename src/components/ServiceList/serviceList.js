import React from 'react';
import Pagination from '@skp/components/Pagination';
import ItemPerPage from '@skp/components/ItemPerPage';
import { Link, resourceUrl } from '@skp/drivers';
import { useCustomerService } from './useCustomerService';
import { LIST_ITEM_PER_PAGE } from '@skp/utils/listItemPerpage';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useTranslation } from 'react-i18next';
import AlertMessage from '@skp/components/AlertMessage';


export default function ServiceList() {
    const talonProps = useCustomerService();
    const { t } = useTranslation(['mypage', 'order_status']);

    const {
        pageControl,
        serviceItems,
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

    if (!totalCount) {
        return (
            <div className="mypage order-list">
                <div className="main-content__top">
                    <h2 className="main-content__title">
                        {t('mypage::My Services')}
                        <span>(0)</span>
                    </h2>
                </div>
                <AlertMessage type="warning">
                    {t('mypage::There is no history')}
                </AlertMessage>
            </div>
        );
    }

    return (
        <>
            {serviceItems && serviceItems.length && (
                <>
            <div className="mypage order-list">
                <div className={`main-content__top`}>
                    <h2 className="main-content__title">
                        {t('mypage::My Services')}
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
                                    <th>{t('mypage::APPLY DATE')}</th>
                                    <th className="th-shipping_name">
                                        {t('mypage::Product Name')}
                                    </th>
                                    <th className="txt-center">
                                        {t('mypage::Sky Dollar Redeemed')}
                                    </th>
                                    <th className="txt-center">
                                        {t('mypage::STATUS')}
                                    </th>
                                    <th className="txt-center" />
                                    <th className="txt-center" />

                                </tr>
                            </thead>
                            <tbody className="txt-center">
                                {serviceItems.map(item => (
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
                                                <td>{item.product_name}</td>
                                                <td className="txt-center">
                                                    <span className="table-customize__txt">
                                                        {item.skypoint_earned !==
                                                        null
                                                            ? item.skypoint_earned
                                                            : '-'}
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
                                                            `mypage/service-history/+
                                                            item.number
                                                            }`
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
                    {serviceItems.map(item => (
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
                                                    {t('mypage::APPLY DATE')}
                                                </span>
                                                <span className="mobile--text">
                                                    {item.order_date}
                                                </span>
                                            </div>
                                            <div className="mobile-item">
                                                <span className="mobile--title">
                                                    {t('mypage::Product Name')}
                                                </span>
                                                <span className="mobile--text">
                                                    {item.product_name}
                                                </span>
                                            </div>
                                            <div className="mobile-item">
                                                <span className="mobile--title">
                                                    {t(
                                                        'mypage::SKY POINTS EARNED'
                                                    )}
                                                </span>
                                                <span className="mobile--text">
                                                    {item.skypoint_earned !==
                                                    null
                                                        ? item.skypoint_earned
                                                        : '-'}
                                                </span>
                                            </div>
                                            <div className="mobile-item">
                                                <span className="mobile--title">
                                                    {t('mypage::STATUS')}
                                                </span>
                                                <span className="mobile--text">
                                                    {t(
                                                        'order_status::' +
                                                            item.status
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mobile-view">
                                        <Link
                                            className="table-customize__link"
                                            to={resourceUrl(
                                                `mypage/service-history/` + item.number
                
                                            )}
                                        >
                                            {t('mypage::Detail')}
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
            </div>
        </>
            )}
        </>
    );
}
