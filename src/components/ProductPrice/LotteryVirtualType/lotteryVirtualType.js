import React from 'react';
import AnyTimeWay from './anyTimeWay';
import PeriodWay from './periodWay';
import NoWay from './noWay';

const LotteryVirtualType = props => {
    const { product } = props;

    if (product.sky_apply_way === 'any_time') {
        return <AnyTimeWay product={product} />;
    }

    if (product.sky_apply_way === 'period') {
        return <PeriodWay product={product} />;
    }

    return <NoWay product={product} />;
};

export default LotteryVirtualType;
