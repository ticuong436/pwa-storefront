import React from 'react';
import Moment from 'moment';
import TimeCountDown from '@skp/components/TimeCountDown';

const ProductTimeSale = props => {
    const { product } = props;

    if (product.sky_time_sales.status === 'IN_PROGRESS') {
        return (
            <TimeCountDown endTime={product.sky_time_sales.end_at}>
                {time => (
                    <div className="product-count">
                        <span>{time}</span>
                    </div>
                )}
            </TimeCountDown>
        );
    }

    if (product.sky_time_sales.status === 'NOT_STARTED_YET') {
        const startTime = Moment(product.sky_time_sales.start_at);
        return (
            <div className="count-down">
                <span>{startTime.format('MM月DD日　HH時から')}</span>
            </div>
        );
    }

    return '';
};

export default ProductTimeSale;
