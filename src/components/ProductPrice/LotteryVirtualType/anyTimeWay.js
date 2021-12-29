import React from 'react';

const AnyTimeWay = props => {
    const { product } = props;

    return (
        <p
            className="product-note"
            dangerouslySetInnerHTML={{
                __html: product.short_description
            }}
        />
    );
};

export default AnyTimeWay;
