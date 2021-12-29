import React from 'react';
import { number, string } from 'prop-types';
import { Price } from '@skp/components/Price';

export default function PriceDiscount({ regularPrice, currency, discount }) {
    return (
        <div className="result-sale">
            <span className="result-sale--old">
                <Price currencyCode={currency} value={regularPrice} />
            </span>
            <span className="result-sale--down">SAVE: {discount}%</span>
        </div>
    );
}

PriceDiscount.propTypes = {
    regularPrice: number.isRequired,
    currency: string.isRequired,
    /**
     * Price off percentage
     */
    discount: number.isRequired
};
