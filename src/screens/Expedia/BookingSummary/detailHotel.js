import React from 'react';
import alertCircle from 'design/dest/images/alert-circle.svg';
import { Price } from '@skp/components/Price';
import Moment from 'moment';

export default function DetailHotel({
    hotel,
    checkInDate,
    checkOutDate,
    price,
    setCancelPolicyModalIsOpen,
    roomsInput,
    room
}) {
    const address = hotel && hotel.address ? hotel.address : '';

    let adults = 0;
    let childrens = 0;
    const countRoom = roomsInput.length;

    for (let i = 0; i < roomsInput.length; i++) {
        adults += roomsInput[i].adults;
        childrens += roomsInput[i].children_and_ages.length;
    }

    return (
        <div className="exguest-right">
            <div className="exguest-detail-block">
                {/*
                    <div className="exguest-detail exguest-form--title">
                        <span>ホテルの詳細</span>
                    </div>
                */}
                <div className="exguest-detail-top">
                    <div className="exguest-detail-box">
                        <div className="row exguest-detail-box-top">
                            <div className="col-md-4 exguest-detail-box-top-left">
                                <div className=" exguest-detail-img">
                                    <img src={hotel.thumbnail} alt="img" />
                                </div>
                            </div>
                            <div className="col-md-8 exguest-detail-box-top-right">
                                <div className="exguest-detail--item">
                                    <div className="exguest-detail--item_title">
                                        ホテル名
                                    </div>
                                    <div className="exguest-detail--item_value_title">
                                        {hotel.name}
                                    </div>
                                    <div className="exguest-detail--item_value_title">
                                        {address.line_1} {address.line_2}
                                        {', '} {address.city}{' '}
                                        {address.country_code}
                                    </div>
                                </div>
                                <div className="exguest-detail--item">
                                    <div className="exguest-detail--item_title">
                                        部屋タイプ
                                    </div>
                                    <div className="exguest-detail--item_value_title">
                                        {room.bed_group_description} (
                                        {countRoom} 部屋)
                                    </div>
                                </div>

                                <div className="exguest-detail--item">
                                    <div className="exguest-detail--item_title">
                                        宿泊日
                                    </div>
                                    <div className="exguest-detail--item_value_title">
                                        {Moment(checkInDate).format(
                                            'YYYY/MM/DD'
                                        )}
                                        &nbsp;-&nbsp;
                                        {Moment(checkOutDate).format(
                                            'YYYY/MM/DD'
                                        )}
                                    </div>
                                </div>

                                <div className="exguest-detail--item">
                                    <div className="exguest-detail--item_title">
                                        部屋数・宿泊数
                                    </div>
                                    <div className="exguest-detail--item_value_title">
                                        {room.bed_group_description}（
                                        {countRoom} 部屋) &nbsp; {adults} 大人
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row exguest-detail-box-bottom">
                            <div className="col-md-4 exguest-detail-box-bottom-left">
                                <div className="exguest-detail--item">
                                    <div className="exguest-detail--item_title">
                                        オプション
                                    </div>
                                    <ul className="exguest-detail--item_value_list">
                                        {room.amenities &&
                                            room.amenities
                                                .slice(0, 3)
                                                .map((amenitie, index) => (
                                                    <li key={index}>
                                                        - {amenitie.name}
                                                    </li>
                                                ))}
                                        <li className="exguest-policy">
                                            {room.cancel_policy ? (
                                                <>
                                                    - キャンセルポリシー
                                                    <img
                                                        src={alertCircle}
                                                        alt="img"
                                                        onClick={() =>
                                                            setCancelPolicyModalIsOpen(
                                                                true
                                                            )
                                                        }
                                                    />
                                                </>
                                            ) : (
                                                '- 返金不可'
                                            )}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-8 exguest-detail-box-bottom-right">
                                <div className="exguest-detail--item_price_title">
                                    <div>料金の内訳</div>
                                    <div>1泊あたりの平均料金</div>
                                </div>
                                <div className="exguest-detail--item_price_value_detail">
                                    <div>
                                        {countRoom}部屋{adults + childrens}名様
                                    </div>
                                    <div>
                                        <span>
                                            <Price
                                                currencyCode={
                                                    room.base_rate.currency
                                                }
                                                value={room.base_rate.value}
                                            />
                                        </span>
                                    </div>
                                </div>
                                <div className="exguest-detail--item_price_value_detail">
                                    <div>税およびサービス料</div>
                                    <div>
                                        <span>
                                            <Price
                                                currencyCode={
                                                    room.tax_and_service_fee
                                                        .currency
                                                }
                                                value={
                                                    room.tax_and_service_fee
                                                        .value
                                                }
                                            />
                                        </span>
                                    </div>
                                </div>
                                <div className="exguest-detail--item_price_value_detail">
                                    <div>料金小計</div>
                                    <div>
                                        <span>
                                            <Price
                                                currencyCode={
                                                    room.tax_and_service_fee
                                                        .currency
                                                }
                                                value={
                                                    room.tax_and_service_fee
                                                        .value +
                                                    room.base_rate.value
                                                }
                                            />
                                        </span>
                                    </div>
                                </div>
                                <div className="exguest-detail--item_price_value_detailPrice txt-semibold">
                                    <div>料金合計</div>
                                    <div>
                                        <Price
                                            currencyCode={price.currency}
                                            value={price.value}
                                        />
                                    </div>
                                </div>
                                <div className="exguest-detail--item_price_value_detailPrice txt-semibold color-gold">
                                    <div>獲得 SKY POINTS</div>
                                    <div>
                                        <span>{room.sky_point}</span>
                                    </div>
                                </div>
                                {!!room.mandatory_tax.value && (
                                    <div className="exguest-detail--item_price_value_detail">
                                        <div>
                                            料金に含まれません
                                            <br />
                                            市税・地方税
                                        </div>
                                        <div>
                                            <Price
                                                currencyCode={price.currency}
                                                value={room.mandatory_tax.value}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
