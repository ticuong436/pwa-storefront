import { func, string } from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

const padTime = number => {
    if (number < 10) {
        return '0' + number;
    }

    return number;
};

const formatTimeSale = secondTime => {
    const remainDayTimeSale = Math.floor(secondTime / 86400); // 24 * 60 * 60 = 86400
    const remainHourTimeSale = Math.floor(
        (secondTime - remainDayTimeSale * 86400) / 3600
    );
    const remainMinuteTimeSale = Math.floor(
        (secondTime - remainDayTimeSale * 86400 - remainHourTimeSale * 3600) /
            60
    );
    const remainSecondTimeSale = Math.floor(
        secondTime -
            remainDayTimeSale * 86400 -
            remainHourTimeSale * 3600 -
            remainMinuteTimeSale * 60
    );

    return `
        残り時間 ${padTime(remainDayTimeSale)}日 ${padTime(
        remainHourTimeSale
    )}:${padTime(remainMinuteTimeSale)}:${padTime(remainSecondTimeSale)}
    `;
};

const diffInSecondsFromNow = endTimestamp => (endTimestamp - Date.now()) / 1000;

const TimeCountDown = ({ children, endTime }) => {
    const toTimestamp = useMemo(() => new Date(endTime).getTime(), [endTime]);
    const [remainTime, setRemainTime] = useState(
        diffInSecondsFromNow(toTimestamp)
    );

    useEffect(() => {
        if (remainTime <= 0) {
            return;
        }

        /**
         * Previous, we set remain time by decrease remainSeconds by 1 every 1000ms interval,
         * but setInterval does not guarantee that it will call callback exactly every 1000ms,
         * it means decrement maybe delayed and there for count down show wrong time.
         *
         * Solution:
         * (1) Get the timestamp we want to reach
         * (2) Decrease the timestamp by current timestamp to get remain time in every 1000ms interval
         */
        const interval = setInterval(() => {
            setRemainTime(diffInSecondsFromNow(toTimestamp));
        }, 1000);

        return () => clearInterval(interval);
    }, [remainTime, toTimestamp]);

    // We use render props pattern (children as function to pass formated time to children)
    // to allow render different UI
    return children(formatTimeSale(remainTime >= 0 ? remainTime : 0));
};

TimeCountDown.propTypes = {
    /**
     * Children render props function, receive formated time as parameter
     */
    children: func.isRequired,
    /**
     * Date string
     */
    endTime: string.isRequired
};

export default TimeCountDown;
