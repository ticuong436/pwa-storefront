import React from 'react';

const NoWay = props => {
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

export default NoWay;
