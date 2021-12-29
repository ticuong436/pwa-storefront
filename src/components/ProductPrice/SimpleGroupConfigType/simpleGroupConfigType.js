import React from 'react';
import TheTimeServiceName from './theTimeServiceName';
import OtherServiceName from './otherServiceName';

const SimpleGroupConfigType = props => {
    const { product } = props;

    if (product.is_the_time) {
        return <TheTimeServiceName product={product} />;
    } else {
        return <OtherServiceName product={product} />;
    }
};

export default SimpleGroupConfigType;
