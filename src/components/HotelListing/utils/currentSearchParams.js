import Moment from 'moment';

/**
 * @typedef {Object} HotelSearchParams
 * @property {string} keyword
 * @property {Date} checkInDate
 * @property {Date} checkOutDate
 * @property {array} roomsInput
 */

export const saveCurrentSearch = (
    keyword,
    checkInDate,
    checkOutDate,
    roomsInput
) => {
    window.localStorage.setItem(
        'hotels-search-params',
        JSON.stringify({
            keyword,
            checkInDate,
            checkOutDate,
            roomsInput
        })
    );
};

/**
 * @return {HotelSearchParams}
 */
export const getCurrentSearch = () => {
    try {
        const data = JSON.parse(
            window.localStorage.getItem('hotels-search-params')
        );
        if (data) {
            if (data.checkInDate) {
                const checkInDate = Moment(data.checkInDate);
                data.checkInDate = checkInDate.toDate();
                data.checkInDateFormated = checkInDate.format('YYYY-MM-DD');
            }
            if (data.checkOutDate) {
                const checkOutDate = Moment(data.checkOutDate);
                data.checkOutDate = checkOutDate.toDate();
                data.checkOutDateFormated = checkOutDate.format('YYYY-MM-DD');
            }
        }
        return data || {};
    } catch (error) {
        window.localStorage.removeItem('hotels-search-params');
        return {};
    }
};

export const removeCurrentSearch = () => {
    window.localStorage.removeItem('hotels-search-params');
};
