import React from 'react';
import { Price } from '@skp/components/Price';
import { MIN_DISCOUNT_PERCENT_TO_SHOW } from '@skp/config';

const OtherServiceName = props => {
    const { product, attributeName } = props;

    if (product.is_sky_special_price) {
        return (
            <div className="product-price">
                <div className="product-price__item">
                    <span className="product-price__name">SKY特別価格</span>
                    <div className="product-price__detail">
                        {attributeName && (
                            <span className="pr-5">{attributeName}</span>
                        )}
                        <span className="product-price__new">
                            <Price
                                currencyCode={
                                    product.price_range.minimum_price
                                        .regular_price.currency
                                }
                                value={product.special_price}
                            />
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="product-price">
            <div className="product-price__detail">
                {attributeName && <span className="pr-5">{attributeName}</span>}
                <span className="product-price__new">
                    <Price
                        currencyCode={
                            product.price_range.minimum_price.regular_price
                                .currency
                        }
                        value={
                            product.price_range.minimum_price.final_price.value
                        }
                    />
                </span>
                {product.price_range.minimum_price.discount.percent_off &&
                product.price_range.minimum_price.discount.percent_off >=
                    MIN_DISCOUNT_PERCENT_TO_SHOW ? (
                    <div className="product-price__info">
                        <span className="product-price__old">
                            <Price
                                currencyCode={
                                    product.price_range.minimum_price
                                        .regular_price.currency
                                }
                                value={
                                    product.price_range.minimum_price
                                        .regular_price.value
                                }
                            />
                        </span>
                        <span className="product-price__sales">
                            SAVE:{' '}
                            {Math.round(
                                product.price_range.minimum_price.discount
                                    .percent_off
                            )}
                            %
                        </span>
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
};

export default OtherServiceName;
