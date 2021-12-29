import React from 'react';
import { Price } from '@skp/components/Price';
import checkInIcon from './Check-In.png';
import checkOutIcon from './Check-Out.png';
import mealIcon from './Meal.png';
import smockingIcon from './Smoking.png';
import roomSizeIcon from './Room Size.png';
import wifiIcon from './Wi-Fi.png';

const ProductPlan = props => {
    const {
        typeLabel,
        className,
        planName,
        priceInfo,
        additionalInfoLeft,
        additionalInfoRight,
        mocking,
        area,
        wifi,
        meal,
        checkinTime1,
        checkinTime2,
        checkoutTime
    } = props;

    return (
        <div className={className}>
            <div className="plan-box">
                <div className="plan-header">
                    <span className="plan-header--title">{typeLabel}</span>
                </div>
                <div className="plan-top">
                    <div className="plan-room">
                        <span className="plan-room--name">{planName}</span>
                        <span className="plan-room--des">
                            {additionalInfoLeft}
                        </span>
                    </div>
                    <div className="plan-sky">
                        <span className="plan-sky--price">
                            <Price value={priceInfo} currencyCode="SGD" />
                        </span>
                        {className === 'plan-item col-lg-6 col-md-6' && (
                            <label htmlFor="">
                                〜{' '}
                                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                            </label>
                        )}
                        {additionalInfoRight && (
                            <span className="plan-sky--point">
                                {additionalInfoRight
                                    ? additionalInfoRight.toLocaleString()
                                    : ''}
                                SKYPOINTS{' '}
                                <label htmlFor="">
                                    獲得
                                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                                </label>
                            </span>
                        )}
                    </div>
                </div>
                <div className="plan-bottom">
                    <p className="plan-bottom--title">Detail</p>
                    <div className="plan-bottom-box">
                        {mocking && (
                            <p className="plan-bottom-item">
                                <img
                                    className="plan-bottom--img"
                                    src={smockingIcon}
                                    alt="img"
                                />
                                <span className="plan-bottom--text">
                                    喫煙可
                                </span>
                            </p>
                        )}
                        {area && (
                            <p className="plan-bottom-item">
                                <img
                                    className="plan-bottom--img"
                                    src={roomSizeIcon}
                                    alt="img"
                                />
                                <span className="plan-bottom--text">
                                    {area}
                                    平米
                                </span>
                            </p>
                        )}
                        {wifi && (
                            <p className="plan-bottom-item">
                                <img
                                    className="plan-bottom--img"
                                    src={wifiIcon}
                                    alt="img"
                                />
                                <span className="plan-bottom--text">
                                    無料Wi-Fi
                                </span>
                            </p>
                        )}
                    </div>
                    <div className="plan-bottom-box">
                        {meal && (
                            <p className="plan-bottom-item">
                                <img
                                    className="plan-bottom--img"
                                    src={mealIcon}
                                    alt="img"
                                />
                                <span className="plan-bottom--text">
                                    2食付き
                                </span>
                            </p>
                        )}
                        {checkinTime1 && checkinTime2 && (
                            <p className="plan-bottom-item">
                                <img
                                    className="plan-bottom--img"
                                    src={checkOutIcon}
                                    alt="img"
                                />
                                <span className="plan-bottom--text">
                                    {checkinTime1} - {checkinTime2}
                                </span>
                            </p>
                        )}
                        {checkoutTime && (
                            <p className="plan-bottom-item">
                                <img
                                    className="plan-bottom--img"
                                    src={checkInIcon}
                                    alt="img"
                                />
                                <span className="plan-bottom--text">
                                    {checkoutTime}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPlan;
