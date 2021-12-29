import React, { useState } from 'react';
import { Price } from '@skp/components/Price';
import PopupConfirm from '@skp/components/PopupConfirm';
import RoomDetail from './roomDetail';

function RoomItem({ room, goToBookingRoomSummary, hotelInfo }) {
    const [cancelPolicyModalIsOpen, setCancelPolicyModalIsOpen] = useState(
        false
    );
    const [showRoomDetailModal, setShowRoomDetailModal] = useState(false);
    const checkin_time =
        hotelInfo && hotelInfo.checkin_time ? hotelInfo.checkin_time : '';
    const checkout_time =
        hotelInfo && hotelInfo.checkout_time ? hotelInfo.checkout_time : '';
    const contentPopupConfirm = (
        <>
            <div className="modal-customize__des">
                <h1>キャンセルポリシー</h1>
            </div>
            <div className="modal-room-name">{room.name}</div>
            <p
                dangerouslySetInnerHTML={{
                    __html: room.cancel_policy
                }}
            />
        </>
    );

    return (
        <>
            <PopupConfirm
                isOpen={cancelPolicyModalIsOpen}
                onConfirm={() => {
                    setCancelPolicyModalIsOpen(false);
                }}
                onCancel={false}
                size="large"
                description={contentPopupConfirm}
            />
            <RoomDetail
                isOpen={showRoomDetailModal}
                onCancel={() => setShowRoomDetailModal(false)}
                room={room}
            />
            <div className="box-room">
                <div className="row">
                    <div className="col-lg-3 col-md-3 box-room__left">
                        <div className="box-room__images">
                            <img src={room.hero_image} alt="img" />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 box-room__right">
                        <h5 className="box-room__name">{room.name}</h5>
                        <div className="box-room__info">
                            <div className="row">
                                <div className="col-lg-7 col-md-7">
                                    <ul className="box-room__list">
                                        <li className="box-room__item">
                                            <span className="box-room__txt">
                                                IN : {checkin_time.begin_time}{' '}
                                                {checkin_time.end_time
                                                    ? ` 〜 ${
                                                          checkin_time.end_time
                                                      }`
                                                    : null}{' '}
                                                OUT : {checkout_time}
                                            </span>
                                        </li>
                                        {!!room.area && (
                                            <li className="box-room__item">
                                                <span className="box-room__txt">
                                                    部屋の広さ :
                                                </span>
                                                <span className="box-room__value">
                                                    {room.area} ㎡
                                                </span>
                                            </li>
                                        )}
                                        <li className="box-room__item">
                                            <span className="box-room__txt">
                                                定員 :
                                            </span>
                                            <span className="box-room__value">
                                                {room.capacity.total}名
                                            </span>
                                        </li>
                                        <li className="box-room__item">
                                            <span className="box-room__txt">
                                                部屋について :
                                            </span>
                                            <span className="box-room__value">
                                                {room.bed_group_description}
                                            </span>
                                        </li>
                                        {room.cancel_policy ? (
                                            <li className="box-room__item box-room__cus">
                                                <div
                                                    className="booking-detail__policy cursor-pointer"
                                                    onClick={() =>
                                                        setCancelPolicyModalIsOpen(
                                                            true
                                                        )
                                                    }
                                                >
                                                    <span className="box-popup">
                                                        キャンセルポリシー
                                                    </span>
                                                </div>
                                            </li>
                                        ) : (
                                            <li className="box-room__item box-room__cus">
                                                <span className="box-room__txt">
                                                    返金不可
                                                </span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div className="col-lg-5 col-md-5">
                                    <div className="row">
                                        <div className="box-badge_parent">
                                            {room.meal_type && (
                                                <div className="box-room__badge">
                                                    <span className="box-room__badge-txt">
                                                        {room.meal_type}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="box-badge">
                                                <span>ポイント10%</span>
                                            </div>
                                            <div className="box-room__price">
                                                <span className="box-room__price-name">
                                                    合計(税込)
                                                </span>
                                                <span className="box-room__price-value">
                                                    <Price
                                                        currencyCode={
                                                            room.grand_total
                                                                .currency
                                                        }
                                                        value={
                                                            room.grand_total
                                                                .value
                                                        }
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 box-room__left2">
                        <div className="plan-staying__btn">
                            <a
                                className="button"
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    setShowRoomDetailModal(true);
                                }}
                            >
                                部屋の詳細
                            </a>
                        </div>
                        <div className="plan-staying__btn">
                            <a
                                className="button button--primary"
                                onClick={() => {
                                    goToBookingRoomSummary(room);
                                }}
                            >
                                予約へ進む
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RoomItem;
