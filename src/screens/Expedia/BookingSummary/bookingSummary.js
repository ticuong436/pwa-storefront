import React, { useState, useRef } from 'react';
import { resourceUrl } from '@skp/drivers';
import Breadcrumbs from '@skp/components/Breadcrumbs';
import { Form, Checkbox } from 'informed';
import useBookingSummary from './useBookingSummary';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import BillingAddressInput from '@skp/screens/Expedia/billingAddressInput';
import DetailHotel from './detailHotel';
import { PILLAR_CODE } from '@skp/config';
import PopupConfirm from '@skp/components/PopupConfirm';
import BookingInfoCustomer from './bookingInfoCustomer';
import { Price } from '@skp/components/Price';
import TargetBlankLink from '@skp/components/TargetBlankLink';

const BookingSummary = () => {
    const [cancelPolicyModalIsOpen, setCancelPolicyModalIsOpen] = useState(
        false
    );

    const apiRef = useRef();

    const scrollRef = useRef();

    const {
        genders,
        loadingCustomer,
        handleSubmit,
        customer,
        isAgree,
        setIsAgree,
        countries,
        regions,
        contactCountryCodes,
        onCountryChanged,
        room,
        roomsInput,
        hotelInfo,
        checkInDate,
        checkOutDate,
        hotelId,
        submitting
    } = useBookingSummary();

    const handleClickSubmit = () => {
        apiRef.current.submitForm();

        const formState = apiRef.current.getState();

        if (Object.keys(formState.errors).length > 0) {
            window.scrollTo(0, scrollRef.current.offsetTop);
        }
    };

    if (loadingCustomer) {
        return <LoadingIndicator />;
    }

    if (submitting) {
        return <LoadingIndicator isDisplay={true} />;
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
            url: resourceUrl(`hotel/${hotelId}/room-listing`),
            title: hotelInfo && hotelInfo.name ? hotelInfo.name : ''
        },
        {
            title: '予約詳細'
        }
    ];

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

            <Breadcrumbs items={items} />
            <Form onSubmit={handleSubmit} apiRef={apiRef}>
                <div className="exguest">
                    <h3 className="exguest--name">予約内容</h3>
                    <div className="row">
                        <div className="exguest-left">
                            <h3 className="exguest-form--title" ref={scrollRef}>
                                ゲストの詳細
                            </h3>
                            <div className="exguest-form">
                                {roomsInput &&
                                    roomsInput.map((roomInput, index) => (
                                        <BookingInfoCustomer
                                            roomInput={roomInput}
                                            genders={genders}
                                            room={room}
                                            customer={customer}
                                            key={index}
                                            index={index}
                                        />
                                    ))}
                            </div>
                        </div>
                        <DetailHotel
                            hotel={hotelInfo}
                            checkInDate={checkInDate}
                            checkOutDate={checkOutDate}
                            price={room.grand_total}
                            setCancelPolicyModalIsOpen={
                                setCancelPolicyModalIsOpen
                            }
                            roomsInput={roomsInput}
                            room={room}
                        />
                    </div>
                    <BillingAddressInput
                        customer={customer}
                        countries={countries}
                        contactCountryCodes={contactCountryCodes}
                        onCountryChanged={onCountryChanged}
                        regions={regions}
                    />
                    <div className="exguest-room">
                        <h3 className="exguest-room--name">
                            予約に関する重要な情報
                        </h3>
                        {room.cancel_policy ? (
                            <>
                                <p className="exguest-room--title">
                                    キャンセル・ポリシー
                                </p>
                                <div
                                    className="exguest-room-block"
                                    dangerouslySetInnerHTML={{
                                        __html: room.cancel_policy
                                    }}
                                />
                            </>
                        ) : (
                            <p className="exguest-room--title">返金不可</p>
                        )}
                        <p className="exguest-room--title">
                            チェックインとチェックアウトポリシー
                        </p>
                        {hotelInfo.instructions && (
                            <>
                                <span>チェックイン方法:</span>
                                <div
                                    className="exguest-room-block"
                                    dangerouslySetInnerHTML={{
                                        __html: hotelInfo.instructions
                                    }}
                                />
                            </>
                        )}
                        {hotelInfo.special_instructions && (
                            <>
                                <span>特別チェックイン方法:</span>
                                <div
                                    className="exguest-room-block"
                                    dangerouslySetInnerHTML={{
                                        __html: hotelInfo.special_instructions
                                    }}
                                />
                            </>
                        )}

                        <div className="exguest-room-block">
                            <p className="exguest-room--title">支払方法</p>
                            <p className="exguest-room--text">
                                予約を確保するために、予約の合計金額
                                <label>
                                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                                    （
                                    <Price
                                        currencyCode={room.grand_total.currency}
                                        value={room.grand_total.value}
                                    />
                                    ）
                                </label>
                                をクレジットカードに請求します。予約が確認できない場合は、全額返金されます。
                            </p>
                        </div>

                        <div className="exguest--agreement">
                            <div className="exguest--agreement-checkbox">
                                <Checkbox
                                    id="booking-agree"
                                    field="booking-agree"
                                    onChange={() => {
                                        setIsAgree(isAgree => !isAgree);
                                    }}
                                />
                            </div>
                            <div className="exguest--agreement-text">
                                <label htmlFor="booking-agree">
                                    私は、この予約に関する
                                    <TargetBlankLink href="https://res.cloudinary.com/sky-premium-jpmktg/image/upload/v1562289863/PDF/Rules_and_restrictions_Term_of_use.pdf#page=3">
                                        規則と制限
                                    </TargetBlankLink>
                                    、
                                    <TargetBlankLink href="https://res.cloudinary.com/sky-premium-jpmktg/image/upload/v1562289863/PDF/Rules_and_restrictions_Term_of_use.pdf">
                                        {' '}
                                        利用規約
                                    </TargetBlankLink>
                                    、
                                    <TargetBlankLink href="https://res.cloudinary.com/sky-premium-jpmktg/image/upload/v1562289846/PDF/Privacy_Policy.pdf">
                                        {' '}
                                        プライバシーポリシー
                                    </TargetBlankLink>
                                    と
                                    <TargetBlankLink href="https://www.anzen.mofa.go.jp/">
                                        {' '}
                                        旅行のアドバイス
                                    </TargetBlankLink>
                                    、および選択した施設と部屋のキャンセルポリシーを読み、
                                    同意したことを認めます。
                                </label>
                            </div>
                        </div>

                        <div className="exguest-submit">

                            <span className="exguest-submit--count">
                                Total: $
                                {Number(room.grand_total.value).toFixed(2)}
                            </span>

                            {/* <span className="exguest-submit--count">
                                Total: $
                                {Intl.NumberFormat().format(
                                    room.grand_total.value
                                )}
                            </span> */}

                            <button
                                className="exguest-submit--next"
                                disabled={!isAgree}
                                onClick={handleClickSubmit}
                                type="button"
                            >
                                次へ
                            </button>
                        </div>
                    </div>
                </div>
            </Form>
        </>
    );
};

export default BookingSummary;
