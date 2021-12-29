import React from 'react';
import { Link, resourceUrl } from '@skp/drivers';
import { Price } from '@skp/components/Price';
import { useTranslation } from 'react-i18next';
import extractConfigurableCartItem from '@skp/utils/extractConfigurableCartItem';
import AlertMessage from '@skp/components/AlertMessage';
import Moment from 'moment';

const EMPTY_OPTION_VALUE = '0';

const ProductDetail = props => {
    const {
        item,
        optionSelected,
        allOptions,
        currency,
        price,
        isLottery = false,
        isPointMall = false
    } = props;

    const { variant } = extractConfigurableCartItem(item);

    const { t } = useTranslation(['checkout', 'common']);

    const getLabelOptions = (
        value,
        array,
        emptyOptionValue = EMPTY_OPTION_VALUE,
        emptyOptionText = t('checkout::Not Requested')
    ) => {
        if (!array) {
            return '';
        }

        for (var i = 0; i < array.length; i++) {
            if (array[i].value === value) {
                return array[i].label;
            }
        }

        return value == emptyOptionValue ? emptyOptionText : '';
    };

    const product = isLottery ? item : item.product;

    const productLink = resourceUrl(`/product/${product.id}`);

    const getGiftWrappingText = () => {
        if (!optionSelected.gift_wrapping) {
            return '';
        }

        if (
            optionSelected.gift_wrapping.style == EMPTY_OPTION_VALUE &&
            optionSelected.gift_wrapping.type == EMPTY_OPTION_VALUE
        ) {
            return t('checkout::Not Requested');
        }

        const giftWrappingStyle = getLabelOptions(
            optionSelected.gift_wrapping.style,
            allOptions.gift_wrapping_style
        );
        const giftWrappingType = getLabelOptions(
            optionSelected.gift_wrapping.type,
            allOptions.japanese_gift_ornament
        );
        if (optionSelected.gift_wrapping.style == EMPTY_OPTION_VALUE) {
            return giftWrappingType;
        }
        if (optionSelected.gift_wrapping.type == EMPTY_OPTION_VALUE) {
            return giftWrappingStyle;
        }

        return giftWrappingStyle + ', ' + giftWrappingType;
    };

    const getMessageCardText = () => {
        if (
            !optionSelected.message_card ||
            (!optionSelected.message_card.receiver_name &&
                !optionSelected.message_card.message)
        ) {
            return '';
        }

        const message =
            optionSelected.message_card.receiver_name +
            ', ' +
            optionSelected.message_card.message;

        return message.trim(', ');
    };

    return (
        <>
            <div className="box-cart__item row">
                <div className="col-lg-3 col-md-12 hide-xs">
                    <div className="box-cart__images">
                        <Link to={productLink}>
                            <img src={product.small_image.url} alt="" />
                        </Link>
                    </div>
                </div>
                <div className="col-lg-9 col-md-12 row">
                    <div className="col-lg-6 col-md-12 box-cart__left">
                        <div className="box-cart__images hide-pc">
                            <Link to={productLink}>
                                <img src={product.small_image.url} alt="" />
                            </Link>
                        </div>
                        <div className="box-cart__titles">
                            <h5 className="box-cart__name">
                                <Link
                                    to={productLink}
                                    className="box-cart__link"
                                >
                                    {variant ? variant.name : product.name}
                                </Link>
                            </h5>
                            <div className="box-cart__detail">
                                {product.service_name.label && (
                                    <>
                                        <span className="box-cart__txt">
                                            {product.service_name.label}
                                        </span>
                                        <span className="box-cart__dots">
                                            •
                                        </span>
                                    </>
                                )}
                                <span className="box-cart__txt">
                                    <Price
                                        currencyCode={currency}
                                        value={price}
                                    />
                                </span>
                                {!isPointMall && (
                                    <>
                                        <span className="box-cart__dots">
                                            •
                                        </span>
                                        <span className="box-cart__txt">
                                            {t('checkout::SKY DOLLARS')}{' '}
                                            {variant
                                                ? variant.sky_point
                                                : product.sky_point}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {!isLottery ? (
                        <div className="col-lg-6 col-md-12 box-cart__right">
                            <div className="quantity-cart">
                                <span className="quantity-cart__text">
                                    {t('checkout::quantity')}
                                </span>
                                <span className="quantity-cart__info-static">
                                    X {item.quantity}
                                </span>
                                <div className="quantity-cart__detail">
                                    <span className="quantity-cart__price">
                                        <Price
                                            currencyCode={currency}
                                            value={price * item.quantity}
                                        />
                                    </span>

                                    {!isPointMall && (
                                        <span className="quantity-cart__name">
                                            {t('checkout::SKY DOLLARS')}{' '}
                                            {variant
                                                ? variant.sky_point
                                                : product.sky_point}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <span className="box-cart__price">
                                <Price
                                    value={price * item.quantity}
                                    currencyCode={currency}
                                />
                            </span>
                        </div>
                    ) : (
                        <div className="col-lg-6 col-md-12 box-cart__right">
                            <div className="quantity-cart">
                                <div className="quantity-cart__detail">
                                    <span className="quantity-cart__price">
                                        <Price
                                            currencyCode={currency}
                                            value={price}
                                        />
                                    </span>
                                    {!isPointMall && (
                                        <span className="quantity-cart__name">
                                            {t('checkout::SKY DOLLARS')}{' '}
                                            {variant
                                                ? variant.sky_point
                                                : product.sky_point}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="col-lg-12 col-md-12 box-cart__form">
                        {/* <div className="box-cart__view-item">
                                            <span className="box-cart__view-item--left">
                                                {t(
                                                    'checkout::Request for Delivery Note'
                                                )}
                                            </span>
                                            <span className="box-cart__view-item--right">
                                                :{' '}
                                                {optionSelected.request_for_delivery_note
                                                    ? t('checkout::Yes')
                                                    : t('checkout::No')}
                                            </span>
                                        </div> */}
                        {optionSelected.shipping_request_date && (
                            <div className="box-cart__view-item">
                                <span className="box-cart__view-item--left">
                                    {t('checkout::Specify Delivery Date')}
                                </span>
                                <span className="box-cart__view-item--right">
                                    :{' '}
                                    {optionSelected.shipping_request_date ==
                                    EMPTY_OPTION_VALUE
                                        ? t('checkout::Not Requested')
                                        : Moment(
                                              optionSelected.shipping_request_date
                                          ).format('Y/MM/DD')}
                                </span>
                            </div>
                        )}
                        {optionSelected.shipping_request_time_range && (
                            <div className="box-cart__view-item">
                                <span className="box-cart__view-item--left">
                                    {t('checkout::Specify Delivery Time')}
                                </span>
                                <span className="box-cart__view-item--right">
                                    :{' '}
                                    {getLabelOptions(
                                        optionSelected.shipping_request_time_range,
                                        allOptions.shipping_time
                                    )}
                                </span>
                            </div>
                        )}
                        {getGiftWrappingText() && (
                            <div className="box-cart__view-item">
                                <span className="box-cart__view-item--left">
                                    {t('checkout::Gift wrapping')}
                                </span>
                                <span className="box-cart__view-item--right">
                                    : {getGiftWrappingText()}
                                </span>
                            </div>
                        )}
                        {getMessageCardText() && (
                            <div className="box-cart__view-item">
                                <span className="box-cart__view-item--left">
                                    {t('checkout::Message Card')}
                                </span>
                                <span className="box-cart__view-item--right">
                                    : {getMessageCardText()}
                                </span>
                            </div>
                        )}
                        {allOptions.sky_customer_note_flag &&
                            optionSelected.customer_note && (
                                <div className="box-cart__view-item">
                                    <span className="box-cart__view-item--left">
                                        {t('checkout::Customer Note')}
                                    </span>
                                    <span className="box-cart__view-item--right">
                                        : {optionSelected.customer_note}
                                    </span>
                                </div>
                            )}
                        {optionSelected.members &&
                            optionSelected.members.length &&
                            optionSelected.members.map((ticketInfo, index) => (
                                <div
                                    className="box-cart__view-item"
                                    key={index}
                                >
                                    <span className="box-cart__view-item--left">
                                        {t('checkout::Ticket {{number}}', {
                                            number: index + 1
                                        })}
                                    </span>
                                    <span className="box-cart__view-item--right">
                                        : {ticketInfo.uid}{' '}
                                        {ticketInfo.last_name}{' '}
                                        {ticketInfo.first_name}
                                    </span>
                                </div>
                            ))}
                        {optionSelected.emails &&
                            optionSelected.emails.length &&
                            optionSelected.emails.map((mailAddress, index) => (
                                <div
                                    className="box-cart__view-item"
                                    key={index}
                                >
                                    <span className="box-cart__view-item--left">
                                        {t('checkout::Ticket {{number}}', {
                                            number: index + 1
                                        })}
                                    </span>
                                    <span className="box-cart__view-item--right">
                                        : {mailAddress}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            {product.saleable_status && !product.saleable_status.is_saleable && (
                <div className="col-lg-12 col-md-12 mb-3">
                    <AlertMessage type="error">
                        {product.saleable_status.description}
                    </AlertMessage>
                </div>
            )}
        </>
    );
};

export default ProductDetail;
