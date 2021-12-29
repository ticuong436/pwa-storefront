import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBookingDetail } from '@skp/components/BookingHotelDetail/useBookingDetail';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useParams, Link, resourceUrl } from '@skp/drivers';
import CancellationPolicyPopup from '@skp/components/BookingHotelDetail/cancellationPolicyPopup';
import { DAY_OF_WEEK_LONG, PILLAR_CODE, SITE_LINKS } from '@skp/config';
import { getErrorMessage } from '@skp/utils/graphqlError';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import Breadcrumbs from '@skp/components/Breadcrumbs';
import RoomBookingInfo from '@skp/design/RoomBookingInfo';
import TargetBlankLink from '@skp/components/TargetBlankLink';

export default function BookingConfirmation() {
    const { t } = useTranslation(['hotel']);
    const { id } = useParams();
    const talonProps = useBookingDetail(id);
    const { bookingDetail, error, loading } = talonProps;
    const [isOpenCancelPolicy, setIsOpenCancelPolicy] = useState(false);

    if (error && !loading) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
        return <ErrorView>{getErrorMessage(error)}</ErrorView>;
    }

    if (loading) {
        return <LoadingIndicator />;
    }

    const items = [
        {
            url: resourceUrl(PILLAR_CODE.travel),
            title: 'Travel'
        },
        {
            url: resourceUrl(`${PILLAR_CODE.travel}/service/hotels`),
            title: 'HOTELS'
        },
        {
            title: 'Booking Confirmed'
        }
    ];

    return (
        <>
            <Breadcrumbs items={items} />
            <CancellationPolicyPopup
                onConfirm={() => {
                    setIsOpenCancelPolicy(false);
                }}
                bookingDetail={bookingDetail}
                isOpen={isOpenCancelPolicy}
            />
            <div className="booking-detail booking-detail--full">
                <div className="booking-detail__top">
                    <h3 className="booking-detail__title">
                        Booking ID: {bookingDetail.booking_id}
                    </h3>
                    <p className="booking-detail__sub">
                        {bookingDetail.booking_date}(
                        {DAY_OF_WEEK_LONG[bookingDetail.booking_day_of_week]})
                        に予約されました
                    </p>
                    <p className="booking-detail__noti">
                        ご予約ありがとうございます。予約が確定しました。
                        <br />
                        登録されているメールアドレスに確認メールが送信されました。
                    </p>
                </div>
                <div className="booking-detail__content">
                    <div className="row">
                        <div className="col-lg-5 col-md-5">
                            <div className="booking-detail__left">
                                <div className="booking-detail__images">
                                    <img
                                        src={bookingDetail.hotel_image}
                                        alt="img"
                                    />
                                </div>
                                <div className="room-type">
                                    <span className="room-type__name">
                                        部屋1
                                    </span>
                                    <span className="room-type__name">
                                        {bookingDetail.room_type}
                                    </span>
                                    <span className="room-type__name">
                                        {bookingDetail.number_of_person}名様
                                    </span>
                                </div>
                                <div
                                    className="room-type"
                                    style={{
                                        marginTop: '10px',
                                        marginBottom: '10px',
                                        color: '#baa9ad'
                                    }}
                                >
                                    <span className="room-type__name">
                                        GUEST DETAILS
                                    </span>
                                </div>

                                {bookingDetail.rooms.map((room, index) => (
                                    <RoomBookingInfo
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
                                <div className="booking-detail__info">
                                    {bookingDetail.cancel_policy ? (
                                        <div
                                            className="booking-detail__policy"
                                            onClick={() =>
                                                setIsOpenCancelPolicy(true)
                                            }
                                        >
                                            <span className="booking-detail__policy-name">
                                                キャンセルポリシー
                                            </span>
                                            <span className="booking-detail__policy-icon">
                                                <i className="icon-mark">!</i>
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="booking-detail__policy">
                                            <span className="booking-detail__policy-name text-danger">
                                                返金不可
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <ul className="booking-basic">
                                    <li className="booking-basic__item booking-basic__left_item">
                                        <span className="booking-basic__name">
                                            ホテル名
                                        </span>
                                        <p className="booking-basic__value">
                                            {bookingDetail.hotel_name}
                                        </p>
                                        <p className="booking-basic__des">
                                            {bookingDetail.hotel_address}
                                        </p>
                                    </li>
                                    <li className="booking-basic__item booking-basic__right_item">
                                        <span className="booking-basic__name">
                                            予約
                                        </span>
                                        <p className="booking-basic__value">
                                            {bookingDetail.number_of_room}
                                            部屋、
                                            {bookingDetail.number_of_night}泊
                                        </p>
                                    </li>
                                    <li className="booking-basic__item booking-basic__left_item">
                                        <span className="booking-basic__name">
                                            チェックインチェックアウト
                                        </span>
                                        <p className="booking-basic__value">
                                            {bookingDetail.check_in} -{' '}
                                            {bookingDetail.check_out}
                                        </p>
                                    </li>
                                    <li className="booking-basic__item booking-basic__right_item">
                                        <span className="booking-basic__name">
                                            お客様のお名前
                                        </span>
                                        <p className="booking-basic__value">
                                            {bookingDetail.customer_name}
                                        </p>
                                    </li>
                                    <li className="booking-basic__item booking-basic__left_item">
                                        <span className="booking-basic__name">
                                            予約状況
                                        </span>
                                        <p className="booking-basic__value">
                                            {t(
                                                'hotel::' +
                                                    bookingDetail.booking_status
                                            )}
                                        </p>
                                    </li>
                                    <li className="booking-basic__item booking-basic__right_item">
                                        <span className="booking-basic__name" />
                                        <p className="booking-basic__value" />
                                    </li>
                                    <li className="booking-basic__item booking-basic__left_item">
                                        <span className="booking-basic__name">
                                            お部屋タイプ
                                        </span>
                                        <p className="booking-basic__value">
                                            {bookingDetail.room_type}
                                        </p>
                                    </li>
                                    {/* <li className="booking-basic__item booking-basic__right_item">
                                        <span className="booking-basic__name">
                                            食事プラン
                                        </span>
                                        <p className="booking-basic__value">
                                            TBD
                                        </p>
                                    </li>
                                    <li className="booking-basic__item booking-basic__left_item">
                                        <span className="booking-basic__name">
                                            お客様のお名前
                                        </span>
                                        <p className="booking-basic__value">
                                            TBD
                                        </p>
                                    </li>
                                    <li className="booking-basic__item booking-basic__right_item">
                                        <span className="booking-basic__name">
                                            通知
                                        </span>
                                        <p className="booking-basic__value">
                                            TBD
                                        </p>
                                    </li> */}
                                    <li className="booking-basic__item booking-basic__left_item">
                                        <span className="booking-basic__name">
                                            総計
                                        </span>
                                        <p className="booking-basic__value">
                                            ¥{bookingDetail.total_cost}
                                        </p>
                                    </li>
                                    {!!bookingDetail.mandatory_tax && (
                                        <li className="booking-basic__item booking-basic__left_item">
                                            <span className="booking-basic__name">
                                                現地払い地方税
                                            </span>
                                            <p className="booking-basic__value">
                                                ¥{bookingDetail.mandatory_tax}
                                            </p>
                                        </li>
                                    )}
                                    <li className="booking-basic__item booking-basic__right_item">
                                        <span className="booking-basic__name" />
                                        <p className="booking-basic__value" />
                                    </li>
                                </ul>
                            </div>
                            <p className="booking-detail__note">
                                ご予約に関するお問い合わせは
                                <TargetBlankLink
                                    href={SITE_LINKS['support']}
                                    rel="noopener noreferrer"
                                    className="member-des--link"
                                >
                                    こちら
                                </TargetBlankLink>
                                、またはメール（traveljp@skypremium.com）にてお問い合わせください。
                                <br />
                                SKY
                                PREMIUMサポートデスク対応時間：シンガポールの祝日を除く平日午前10時から午後7時（日本時間）
                            </p>
                        </div>
                    </div>
                </div>
                <div className="booking-detail__btn">
                    <Link
                        className="button button--primary"
                        to={resourceUrl(`/mypage/booking-history/view/${id}`)}
                    >
                        予約を管理する
                    </Link>
                    <Link
                        className="button button--primary"
                        to={resourceUrl('/')}
                    >
                        ホームページ
                    </Link>
                </div>
            </div>
        </>
    );
}
