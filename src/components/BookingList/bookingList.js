import React from 'react';
import { useBookingHistory } from './useBookingHistory';
import { useTranslation } from 'react-i18next';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { LIST_ITEM_PER_PAGE } from '@skp/utils/listItemPerpage';
import Pagination from '@skp/components/Pagination';
import ItemPerPage from '@skp/components/ItemPerPage';
import { Link, resourceUrl } from '@skp/drivers';
import AlertMessage from '@skp/components/AlertMessage';


export default function BookingList() {
    const { t } = useTranslation(['mypage', 'booking', 'hotel']);
    const {
        loading,
        error,
        bookingItems,
        totalCount,
        pageControl,
        currentPage,
        pageSize,
        setPageSize
    } = useBookingHistory();

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
            <>
                <div className="mypage order-list">
                    <div className="main-content__top">
                        <h2 className="main-content__title">
                            {t('mypage::Booking History')}
                        </h2>
                    </div>
                    <AlertMessage type="warning">
                        {t('mypage::There is no history')}
                    </AlertMessage>
                </div> 
            </>
        );
    }

    return (
        <div className="mypage order-list">
            <div className="booking-list">
                
                <div className={`main-content__top`}>
                    <h2 className="main-content__title">
                        {t('mypage::Booking History')}
                    </h2>
                    
                </div>
                <div className="order-list__table order-pc">
                    <div className="table-customize">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="th-booking_id">
                                        {t('booking::Booking ID')}
                                    </th>
                                    <th className="th-booking_name">
                                        {t('booking::Hotel Name')}
                                    </th>
                                    <th className="txt-center">
                                        {t('booking::Check in Date')}
                                    </th>
                                    <th className="txt-center">
                                        {t('booking::Check out Date')}
                                    </th>
                                    <th className="txt-center">
                                        {t('booking::Booking Status')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="txt-center">
                                {bookingItems &&
                                    bookingItems.map(item => (
                                        <tr key={item.booking_id}>
                                            <td>
                                                <span className="table-customize__txt">
                                                    <Link
                                                        className="table-customize__link"
                                                        to={resourceUrl(
                                                            'mypage/booking-history/view/' +
                                                                item.booking_id
                                                        )}
                                                    >
                                                        {item.booking_id}
                                                    </Link>
                                                </span>
                                            </td>
                                            <td>
                                                <span className="table-customize__txt">
                                                    {item.hotel_name}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="table-customize__txt nowrap">
                                                    {item.check_in}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="table-customize__txt nowrap">
                                                    {item.check_out}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="table-customize__txt">
                                                    {t(
                                                        'hotel::' +
                                                            item.booking_status
                                                    )}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    
                                    {/* hashcode */}
                                    {/* <tr >
                                            <td>
                                                <span className="table-customize__txt">
                                                    <Link
                                                        className="table-customize__link"
                                                        to={resourceUrl(
                                                            `mypage/booking-history/view/${1}` 
                                                                
                                                        )}
                                                    >
                                                        00001
                                                    </Link>
                                                </span>
                                            </td>
                                            <td>
                                                <span className="table-customize__txt">
                                                    Gold Start
                                                </span>
                                            </td>
                                            <td>
                                                <span className="table-customize__txt nowrap">
                                                   11/11/2021
                                                </span>
                                            </td>
                                            <td>
                                                <span className="table-customize__txt nowrap">
                                                    12/11/2021
                                                </span>
                                            </td>
                                            <td>
                                                <span className="table-customize__txt">
                                                    {t(
                                                        'hotel::processing'
                                                        
                                                    )}
                                                </span>
                                            </td>
                                        </tr> */}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mobile-order">
                    {bookingItems &&
                        bookingItems.map(item => (
                            <div className="mobile-list" key={item.booking_id}>
                                <div className="mobile-list-block">
                                    <div className="mobile-list-title">
                                        <div className="mobile-item">
                                            <span className="mobile--title">
                                                {t('booking::Booking ID')}
                                            </span>
                                            <span className="mobile--text">
                                                {item.booking_id}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mobile-list-content">
                                        <div className="mobile-item">
                                            <span className="mobile--title">
                                                {t('booking::Check in Date')}
                                            </span>
                                            <span className="mobile--text">
                                                {item.check_in}
                                            </span>
                                        </div>
                                        <div className="mobile-item">
                                            <span className="mobile--title">
                                                {t('booking::Hotel Name')}
                                            </span>
                                            <span className="mobile--text">
                                                {item.hotel_name}
                                            </span>
                                        </div>
                                        <div className="mobile-item">
                                            <span className="mobile--title">
                                                {t('booking::Check out Date')}
                                            </span>
                                            <span className="mobile--text">
                                                {item.check_out}
                                            </span>
                                        </div>
                                        <div className="mobile-item">
                                            <span className="mobile--title">
                                                {t('booking::Booking Status')}
                                            </span>
                                            <span className="mobile--text">
                                                {t(
                                                    'hotel::' +
                                                        item.booking_status
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mobile-view">
                                    <Link
                                        className="table-customize__link"
                                        to={resourceUrl(
                                            'mypage/booking-history/view/' +
                                                item.booking_id
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
        </div>
    );
}
