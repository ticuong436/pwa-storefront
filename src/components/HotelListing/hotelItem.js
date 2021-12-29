import React from 'react';
// import clockIcon from 'design/dest/images/clock.svg';
import { resourceUrl } from '@skp/drivers';
import { useTranslation } from 'react-i18next';
import { Price } from '@skp/components/Price';
import HotelRatingIcon from '@skp/components/HotelRatingIcon';
import TargetBlankLink from '@skp/components/TargetBlankLink';

function HotelItem({ hotel }) {
    const { t } = useTranslation(['hotel']);
    const detailLink = hotel.is_available
        ? resourceUrl('/hotel/' + hotel.id + '/room-listing')
        : null;

    return (
        <div className="mlisting-item">
            <div className="mlisting-ileft">
                {detailLink ? (
                    <TargetBlankLink href={detailLink}>
                        <img src={hotel.thumbnail} />
                    </TargetBlankLink>
                ) : (
                    <img src={hotel.thumbnail} />
                )}
            </div>
            <div className="mlisting-iright">
                <div className="mlisting-iright-text">
                    <div className="mlisting-icon" />
                    <div className="mlisting-ititle">
                        <h3 className="mlisting-ititle__text">
                            {detailLink ? (
                                <TargetBlankLink href={detailLink}>
                                    {hotel.name}
                                </TargetBlankLink>
                            ) : (
                                hotel.name
                            )}
                        </h3>
                        <span className="mlisting-ititle__user">
                            {'HOTELS'}
                        </span>
                        <div className="mlisting-rating">
                            <HotelRatingIcon
                                itemClass="mlisting-rating-item"
                                rating={hotel.rating}
                            />
                        </div>
                    </div>
                    <div className="mlisting-ides">
                        {hotel.is_available ? (
                            <>
                                <div className="mlisting-ides-left">
                                    <div className="mlisting-ides-lbox">
                                        <div className="mlisting-ltype">
                                            <span>
                                                {hotel.address
                                                    .state_province_name
                                                    ? hotel.address
                                                          .state_province_name +
                                                      ' / '
                                                    : ''}
                                                {hotel.address.city}
                                                &nbsp;
                                                {hotel.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mlisting-ides-lbox hotel-des">
                                        <div className="mlisting-ltype">
                                            <span>
                                                {hotel.descriptions.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mlisting-ides-right">
                                    <div className="hotel-price">
                                        <span className="sub">税込</span>
                                    </div>
                                    <div className="hotel-price">
                                        <Price
                                            value={hotel.prices.minimum.value}
                                            currencyCode={
                                                hotel.prices.minimum.currency
                                            }
                                        />{' '}
                                        <span className="sub">〜</span>
                                    </div>
                                    <div className="hotel-pointlabel">
                                        <span>ポイント10%</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="mlisting-error">
                                <p className="mlisting-error-text">
                                    <span className="mlisting-error--title">
                                        {t('hotel::No rooms available')}
                                    </span>
                                </p>
                                <p className="mlisting-error-text">
                                    {t(
                                        'hotel::Please change the conditions and try searching again.'
                                    )}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mlisting-iright-button">
                    {hotel.is_available ? (
                        <TargetBlankLink href={detailLink}>
                            <span>{t('hotel::Detail')}</span>
                        </TargetBlankLink>
                    ) : (
                        <a className="" onClick={e => e.preventDefault()}>
                            <span>{t('hotel::NO ROOM')}</span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HotelItem;
