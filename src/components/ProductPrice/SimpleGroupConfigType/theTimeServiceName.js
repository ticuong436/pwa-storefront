import React from 'react';
import { Price } from '@skp/components/Price';
import ProductTimeSale from '@skp/components/ProductTimeSale';
import { MIN_DISCOUNT_PERCENT_TO_SHOW } from '@skp/config';

const TheTimeServiceName = props => {
    const { product } = props;

    return (
        <>
            <ProductTimeSale product={product} />
            {product.price_tiers_the_time.map((price, index) => {
                return (
                    <div className="product-price__item" key={index}>
                        <span className="product-price__name">
                            {price.group.toUpperCase()}
                        </span>
                        <div className="product-price__detail">
                            <span className="product-price__new">
                                <Price
                                    currencyCode={price.final_price.currency}
                                    value={price.final_price.value}
                                />
                            </span>
                            {price.discount.percent_off >=
                                MIN_DISCOUNT_PERCENT_TO_SHOW && (
                                <div className="product-price__info">
                                    <span className="product-price__old">
                                        <Price
                                            currencyCode={
                                                product.price_range
                                                    .minimum_price.regular_price
                                                    .currency
                                            }
                                            value={
                                                product.price_range
                                                    .minimum_price.regular_price
                                                    .value
                                            }
                                        />
                                    </span>
                                    <span className="product-price__sales">
                                        SAVE:{' '}
                                        {Math.round(price.discount.percent_off)}
                                        %
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default TheTimeServiceName;
