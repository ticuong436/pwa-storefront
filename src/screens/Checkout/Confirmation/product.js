import React from 'react';
import { Link, resourceUrl } from '@skp/drivers';
import { Price } from '@skp/components/Price';
import { useTranslation } from 'react-i18next';
import extractConfigurableCartItem from '@skp/utils/extractConfigurableCartItem';

const Product = props => {
    const {
        item,
        currency,
        price,
        isLottery = false,
        isPointMall = false
    } = props;
    const product = isLottery ? item : item.product;
    const productLink = resourceUrl(`/product/${product.id}`);
    const { variant } = extractConfigurableCartItem(item);
    const { t } = useTranslation(['checkout', 'common']);

    return (
        <>
            <div className="box-cart__item row">
                <div className="col-lg-3 col-md-12 hide-xs">
                    <div className="box-cart__images">
                        <Link to={productLink}>
                            <img
                                src={
                                    isLottery
                                        ? product.small_image.url
                                        : product.thumbnail.url
                                }
                                alt=""
                            />
                        </Link>
                    </div>
                </div>
                <div className="col-lg-9 col-md-12 row">
                    <div className="col-lg-6 col-md-12 box-cart__left">
                        <div className="box-cart__images hide-pc">
                            <Link to={productLink}>
                                <img
                                    src={
                                        isLottery
                                            ? product.small_image.url
                                            : product.thumbnail.url
                                    }
                                    alt=""
                                />
                            </Link>
                        </div>
                        <div className="box-cart__titles">
                            <h5 className="box-cart__name">
                                <Link to={productLink}>
                                    {variant ? variant.name : product.name}
                                </Link>
                            </h5>
                            <div className="box-cart__detail">
                                {product.service_name.label && (
                                    <>
                                        <span>
                                            {product.service_name.label}
                                        </span>
                                        <span className="box-cart__dots">
                                            •
                                        </span>
                                    </>
                                )}
                                <span>
                                    <Price
                                        value={price}
                                        currencyCode={currency}
                                    />
                                </span>
                                <span className="box-cart__dots">•</span>
                                <span>
                                    SKY POINT{' '}
                                    {variant
                                        ? variant.sky_point
                                        : product.sky_point}
                                </span>
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
                                    X {item.qty}
                                </span>
                                <div className="quantity-cart__detail">
                                    <span className="quantity-cart__price">
                                        <Price
                                            currencyCode={currency}
                                            value={price * item.qty}
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
                                    value={price * item.qty}
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
                </div>
            </div>
        </>
    );
};

export default Product;
