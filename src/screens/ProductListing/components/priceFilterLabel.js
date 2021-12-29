import React from 'react';
import { Price } from '@skp/components/Price';

export default function PriceFilterLabel({ value }) {
    if (!value) {
        return null;
    }

	// skyPremium SG : changing currency to SGD
    return <Price currencyCode="SGD" value={value} />;
}
