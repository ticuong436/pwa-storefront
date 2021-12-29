import React, { useState } from 'react';
import { useBookingDetail } from './useBookingDetail';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useParams, resourceUrl } from '@skp/drivers';
import CancellationPolicyPopup from './cancellationPolicyPopup';
import { DAY_OF_WEEK_LONG } from '@skp/config';
import { getErrorMessage } from '@skp/utils/graphqlError';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import CancelBookingPopup from './cancelBookingPopup';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '@skp/components/Breadcrumbs';
import RoomBookingInfo from '@skp/design/RoomBookingInfo';
import { useReceiptPdf } from '@skp/hooks/useReceiptPdf';
import hotelImg from "design/dest/images/Room-Size.png";
export default function BookingHotelDetail() {
    const BOOKING_STATUS_CANCEL = 'Cancelled';
    const { id } = useParams();
    const { t } = useTranslation(['mypage', 'hotel', 'navigation', 'booking']);

    const {
        handleCancelRequest,
        isCancelingRequest,
        bookingDetail,
        error,
        loading,
        isShowPopupConfirm,
        setShowPopupConfirm
    } = useBookingDetail(id);

    const { downloading: downloadingPdf, downloadPdf } = useReceiptPdf();

    const items = [
        {
            url: resourceUrl('/customer/booking/history'),
            title: t('navigation::My Bookings')
        },
        {
            title: `Booking ID:${bookingDetail.booking_id}`

            // title: `Booking ID:0001`
        }
    ];

    const isCancelled = bookingDetail.booking_status == BOOKING_STATUS_CANCEL;

    const [isOpenCancelPolicy, setIsOpenCancelPolicy] = useState(false);

    const now = new Date();
    const checkOutDate = new Date(bookingDetail.check_out);
    checkOutDate.setDate(checkOutDate.getDate() + 1);

    if (error && !loading) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
        return <ErrorView>{getErrorMessage(error)}</ErrorView>;
    }

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <>
            <Breadcrumbs items={items} />
            {!isCancelled && (
                <div>
                    <CancelBookingPopup
                        isOpen={isShowPopupConfirm}
                        onCancel={() => setShowPopupConfirm(false)}
                        onConfirm={() =>
                            handleCancelRequest(bookingDetail.booking_id)
                        }
                        isLoading={isCancelingRequest}
                    />
                    <CancellationPolicyPopup
                        onConfirm={() => {
                            setIsOpenCancelPolicy(false);
                        }}
                        size="large"
                        bookingDetail={bookingDetail}
                        isOpen={isOpenCancelPolicy}
                    />
                </div>
            )}
            <div
                className={`booking-detail ${
                    isCancelled ? 'booking-cancel' : ''
                }`}
            >
                <div className="booking-detail__top">
                    <h3 className="booking-detail__title">
                        Booking ID: {bookingDetail.booking_id}
                    </h3>
                    <p className="booking-detail__sub txt-left">
                        {bookingDetail.booking_date}
                        {DAY_OF_WEEK_LONG[bookingDetail.booking_day_of_week]}
                        {t('booking::Reserved for')}
                    </p>
                    {bookingDetail.booking_status === 'Confirmed' &&
                    now.getTime() > checkOutDate.getTime() ? (
                        <p className="txt-right">
                            <button
                                className="print-order-detail table-customize__link"
                                disabled={downloadingPdf}
                                onClick={e => {
                                    e.preventDefault();
                                    downloadPdf(
                                        'BOOKING',
                                        bookingDetail.booking_id
                                    );
                                }}
                            >
                                {t('mypage::Issue Receipt')}
                            </button>
                        </p>
                    ) : (
                        ''
                    )}
                </div>
                <div className="booking-detail__content">
                    <div className="row">
                        <div className="col-lg-5 col-md-5">
                            <div className="booking-detail__left">
                                <div className="booking-detail__images">
                                    <img
                                        src={bookingDetail.hotel_image}
                                        alt=""
                                    />
                                </div>
                                <div className="room-type">
                                    <span className="room-type__name">
                                        {t('hotel::Room')}1
                                    </span>
                                    <span className="room-type__name">
                                        {bookingDetail.room_type}
                                    </span>
                                    <span className="room-type__name">
                                        {bookingDetail.number_of_person}{t('hotel::名様')}
                                    </span>
                                </div>
                                <div className="room-type">
                                    <span className="room-type__name">
                                        GUEST DETAILS
                                    </span>
                                </div>
                                {bookingDetail.rooms.map((room, index) => (
                                    <RoomBookingInfo
                                        key={index}
                                        index={index + 1}
                                        guestName={
                                            room.given_name +
                                            ' ' +
                                            room.family_name
                                        }
                                        specialRequest={room.special_request}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-7">
                            <div className="booking-detail__right">
                                {!isCancelled && (
                                    <div className="booking-detail__info">
                                        <div
                                            className="booking-detail__badge"
                                            onClick={setShowPopupConfirm}
                                        >
                                            <span className="booking-detail__badge-txt">
                                                {t('booking::Cancel this reservation')}
                                            </span>
                                        </div>
                                        {bookingDetail.cancel_policy ? (
                                            <div
                                                className="booking-detail__policy cursor-pointer"
                                                onClick={() =>
                                                    setIsOpenCancelPolicy(true)
                                                }
                                            >
                                                <span className="booking-detail__policy-name">
                                                    {t('booking::Cancellation policy')}
                                                </span>
                                                <span className="booking-detail__policy-icon">
                                                    <i className="icon-mark">
                                                        !
                                                    </i>
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="booking-detail__policy">
                                                <span className="booking-detail__policy-name text-danger">
                                                    {t('booking::Non refundable')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <ul className="booking-basic">
                                    <li className="booking-basic__left_item">
                                        <span className="booking-basic__name">
                                        {t('booking::Hotel Name')} 
                                        </span>
                                        <p className="booking-basic__value">
                                            {bookingDetail.hotel_name}
                                        </p>
                                        <p className="booking-basic__des">
                                            {bookingDetail.hotel_address}
                                        </p>
                                    </li>
                                    <li className="booking-basic__right_item">
                                        <span className="booking-basic__name">
                                        {t('booking::Reserve')} 
                                        </span>
                                        <p className="booking-basic__value">
                                            {bookingDetail.number_of_room}
                                            {t('booking::Room')}
                                            {bookingDetail.number_of_night}Night
                                        </p>
                                    </li>
                                    <li className="booking-basic__left_item">
                                        <span className="booking-basic__name">
                                        {t('booking::Check in Check out')} 
                                        </span>
                                        <p className="booking-basic__value">
                                            {bookingDetail.check_in} -{' '}
                                            {bookingDetail.check_out}
                                        </p>
                                    </li>
                                    <li className="booking-basic__right_item">
                                        <span className="booking-basic__name">
                                        {t('booking::Your Name')}
                                        </span>
                                        <p className="booking-basic__value">
                                            {bookingDetail.customer_name}
                                        </p>
                                    </li>
                                    <li className="booking-basic__left_item">
                                        <span className="booking-basic__name">
                                        {t('booking::Booking Status')}  
                                        </span>
                                        <p className="booking-basic__value">
                                            {t(
                                                'hotel::' +
                                                    bookingDetail.booking_status
                                            )}
                                        </p>
                                    </li>
                                    <li className="booking-basic__right_item">
                                        <span className="booking-basic__name" />
                                        <p className="booking-basic__value" />
                                    </li>
                                    <li className="booking-basic__left_item">
                                        <span className="booking-basic__name">
                                        {t('booking::Room Type')} 
                                        </span>
                                        <p className="booking-basic__value">
                                            {bookingDetail.room_type}
                                        </p>
                                    </li>
            {/* <li className="booking-basic__right_item">
                                        <span className="booking-basic__name">
                                            Meal plan
                                        </span>
                                        <p className="booking-basic__value">
                                            TBD
                                        </p>
                                    </li>
                                    <li className="booking-basic__left_item">
                                        <span className="booking-basic__name">
                                            Your Name
                                        </span>
                                        <p className="booking-basic__value">
                                            TBD
                                        </p>
                                    </li>
                                    <li className="booking-basic__right_item">
                                        <span className="booking-basic__name">
                                            通知
                                        </span>
                                        <p className="booking-basic__value">
                                            TBD
                                        </p>
                                    </li> */}
            <li className="booking-basic__item booking-basic__left_item">
                                        <span className="booking-basic__name">
                                        {t('booking::Total')}
                                        </span>
                                        <p className="booking-basic__value">
                                            ¥{bookingDetail.total_cost}
                                        </p>
                                    </li>
                                    {!!bookingDetail.mandatory_tax && (
                                        <li className="booking-basic__item booking-basic__left_item">
                                            <span className="booking-basic__name">
                                            {t('booking::料金に含まれません')}   
                                                <br />
                                                {t('booking::City tax and local tax')} 
                                            </span>
                                            <p className="booking-basic__value">
                                                ¥{bookingDetail.mandatory_tax}
                                            </p>
                                        </li>
                                    )}
                                    <li className="booking-basic__left_item">
                                        <span className="booking-basic__name" />
                                        <p className="booking-basic__value" />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {!isCancelled && (
                    <div className="booking-detail__btn">
                        <a className="button button--primary" href="#">
                            
                            {t('booking::Download confirmation of reservation Click here')}
                        </a>
                        <a className="button button--primary" href="#">
                            
                            {t('booking::Download Hotel Voucher Click here')}
                        </a>
                    </div>
                )}
                {isCancelled && (
                    <div className="booking-detail__btn">
                        <a className="button button--primary" href="#">
                            {t('booking::Download canceled reservations here')}
                        </a>
                    </div>
                )}
            </div>
        </>
    );
}
