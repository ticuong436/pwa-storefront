import React from 'react';
import { Price } from '@skp/components/Price';
import PriceDiscount from '@skp/components/PriceDiscount';
import {
    PILLAR_CODE,
    MIN_DISCOUNT_PERCENT_TO_SHOW,
    SERVICE_THE_TIME
} from '@skp/config';

export default function ProductBoxPriceArea({ product, priceSelling }) {
    const { currency, price, price_selling, discount_percent } = priceSelling;

    if (
        product.service_name.value != SERVICE_THE_TIME &&
        product.is_sky_special_price
    ) {
        return (
            <>
                <div className="result-money pr-2">SKY特別価格:</div>
                <div className="result-money">
                    <Price currencyCode={currency} value={price_selling} />
                </div>
            </>
        );
    }

    return (
        <>
            <div className="result-money">
                {price_selling > 0 ||
                product.pillar.code == PILLAR_CODE.estore ? (
                    <Price currencyCode={currency} value={price_selling} />
                ) : null}
                {price_selling == 0 ||
                product.pillar.code == PILLAR_CODE.estore ? null : (
                    <span> 〜 </span>
                )}
            </div>
            {discount_percent >= MIN_DISCOUNT_PERCENT_TO_SHOW ? (
                <PriceDiscount
                    regularPrice={price}
                    currency={currency}
                    discount={discount_percent}
                />
            ) : (
                ''
            )}
        </>
    );
}
