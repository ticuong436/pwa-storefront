import React, { useState } from 'react';
import { Price } from '@skp/components/Price';
import { Link, resourceUrl } from '@skp/drivers';
import DeliveryDateTime from './deliveryDateTime';
import GiftWrapping from './giftWrapping';
import MessageCard from './messageCard';
import QuantityBox from './quantityBox';
import { generateFieldName } from '@skp/screens/Checkout/formHelper';
import TextAreaInput from './textAreaInput';
import {
    hasLengthAtMost,
    japanOldCharacterValidation
} from '@skp/utils/formValidators';
import { useTranslation } from 'react-i18next';
import TicketDetail from './ticketDetail';
import extractConfigurableCartItem from '@skp/utils/extractConfigurableCartItem';
import AlertMessage from '@skp/components/AlertMessage';

const ProductDetail = props => {
    const {
        item,
        isLottery = false,
        isPointMall = false,
        setIsCartUpdating,
        fetchProductListing,
        tmpSelectedOption,
        removeInitialValue,
        currency,
        price
    } = props;

    const { variant } = extractConfigurableCartItem(item);

    const product = isLottery ? item : item.product;
    const productLink = resourceUrl(`/product/${product.id}`);
    const orderOptions = product.order_options;

    const [quantity, setQuantity] = useState(item.quantity || 1);
    const keyGenerate = isLottery ? null : item.id;

    const [errorMessage, setErrorMessage] = useState('');

    const { t } = useTranslation(['checkout']);

    if (!quantity) {
        return null;
    }

    const detailContent =
        product.__typename == 'TicketProduct' ? (
            <TicketDetail item={item} quantity={quantity} product={product} />
        ) : (
            <>
                {/* <div className="form-customize">
                    <div className="check-box">
                        <Checkbox
                            id={generateFieldName(
                                'request_for_delivery_note',
                                keyGenerate
                            )}
                            field={generateFieldName(
                                'request_for_delivery_note',
                                keyGenerate
                            )}
                            className="check-box__input"
                        />
                        <label
                            className="check-box__label"
                            htmlFor={generateFieldName(
                                'request_for_delivery_note',
                                keyGenerate
                            )}
                        >
                            {t('checkout::Request for Delivery Note')}
                        </label>
                    </div>
                </div> */}
                <DeliveryDateTime
                    skyShippingDateEnabled={
                        orderOptions.sky_shipping_date_enabled
                    }
                    skyShippingTimeEnabled={
                        orderOptions.sky_shipping_time_enabled
                    }
                    shippingDates={orderOptions.shipping_dates}
                    shippingTimes={orderOptions.shipping_time}
                    id={keyGenerate}
                    tmpSelectedOption={
                        tmpSelectedOption
                            ? tmpSelectedOption.delivery_date_time
                            : false
                    }
                    removeInitialValue={removeInitialValue}
                />
                <GiftWrapping
                    wrappingStyles={orderOptions.gift_wrapping_style}
                    wrappingTypeEnable={orderOptions.sky_gift_ornament_enabled}
                    wrappingTypes={orderOptions.japanese_gift_ornament}
                    id={keyGenerate}
                    tmpSelectedOption={
                        tmpSelectedOption
                            ? tmpSelectedOption.gift_wrapping
                            : false
                    }
                    removeInitialValue={removeInitialValue}
                />
                <MessageCard
                    skyGiftMessageEnabled={
                        orderOptions.sky_gift_message_enabled
                    }
                    id={keyGenerate}
                    tmpSelectedOption={
                        tmpSelectedOption
                            ? tmpSelectedOption.message_card
                            : false
                    }
                    removeInitialValue={removeInitialValue}
                />

                {orderOptions.sky_customer_note_flag && (
                    <TextAreaInput
                        allowEmptyString
                        classes={{
                            input:
                                'form-control form-scale form-textarea-height'
                        }}
                        id={generateFieldName('customer_note', keyGenerate)}
                        placeholder={t('checkout::Customer Note')}
                        field={generateFieldName('customer_note', keyGenerate)}
                        maxLength={50}
                        validate={value =>
                            hasLengthAtMost(t, value, 50) ||
                            japanOldCharacterValidation(t, value)
                        }
                        t={t}
                    />
                )}
            </>
        );

    return (
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
                            <Link to={productLink} className="box-cart__link">
                                {variant ? variant.name : product.name}
                            </Link>
                        </h5>
                        <div className="box-cart__detail">
                            {product.service_name.label && (
                                <>
                                    <span className="box-cart__txt">
                                        {product.service_name.label}
                                    </span>
                                    <span className="box-cart__dots">•</span>
                                </>
                            )}
                            <span className="box-cart__txt">
                                <Price currencyCode={currency} value={price} />
                            </span>
                            {!isPointMall && (
                                <>
                                    <span className="box-cart__dots">•</span>
                                    <span className="box-cart__txt">
                                        {t('checkout::SKY POINT')}{' '}
                                        {variant
                                            ? variant.sky_point
                                            : product.sky_point}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {isLottery ? (
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
                ) : (
                    <QuantityBox
                        item={item}
                        setIsCartUpdating={setIsCartUpdating}
                        fetchProductListing={fetchProductListing}
                        quantity={quantity}
                        variant={variant}
                        setQuantity={setQuantity}
                        setErrorMessage={setErrorMessage}
                    />
                )}
                <div className="col-lg-12 col-md-12 box-cart__form">
                    {detailContent}
                </div>
            </div>
            {product.saleable_status && !product.saleable_status.is_saleable && (
                <div className="col-lg-12 col-md-12 mt-3">
                    <AlertMessage type="error">
                        {product.saleable_status.description}
                    </AlertMessage>
                </div>
            )}
            {errorMessage && (
                <div className="col-lg-12 col-md-12 mt-3">
                    <AlertMessage type="error">{errorMessage}</AlertMessage>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
