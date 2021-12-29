import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, resourceUrl } from '@skp/drivers';
import { useLazyQuery } from '@apollo/react-hooks';
import HOTEL_INFO from './graphql/getHotelInfo.graphql';
import Moment from 'moment';

export const useHotelInfo = (hotelId, initValueParams) => {
    const formApiRef = useRef();
    const [roomsInput, setRoomsInput] = useState(initValueParams.roomsInput);
    const [checkInDate, setCheckInDate] = useState(initValueParams.checkInDate);
    const [checkOutDate, setCheckOutDate] = useState(
        initValueParams.checkOutDate
    );

    const isValidParam = checkInDate && checkOutDate && roomsInput;

    const [runQuery, { data, loading: isSearching }] = useLazyQuery(
        HOTEL_INFO,
        {
            fetchPolicy: 'network-only',
            skip: !isValidParam
        }
    );

    const hotelData = data && data.getHotelInfo ? data.getHotelInfo : null;
    const history = useHistory();

    // Keep hotel info, we only reload rooms list
    const [hoteInfo, setHotelInfo] = useState({});
    useEffect(() => {
        if (hotelData) {
            const info = { ...hotelData };
            // When rooms list change, we don't want to update hotelInfo
            // => we delete rooms from object
            delete info.rooms;
            setHotelInfo(info);
        }
    }, [hotelData]);

    const handleSubmitSearch = useCallback(
        values => {
            setCheckInDate(Moment(values.checkInDate).format('YYYY-MM-DD'));
            setCheckOutDate(Moment(values.checkOutDate).format('YYYY-MM-DD'));
            setRoomsInput(roomsInput);
            runQuery({
                variables: {
                    hotelId: hotelId,
                    checkInDate: Moment(values.checkInDate).format(
                        'YYYY-MM-DD'
                    ),
                    checkOutDate: Moment(values.checkOutDate).format(
                        'YYYY-MM-DD'
                    ),
                    rooms: roomsInput
                }
            });
        },
        [hotelId, roomsInput, runQuery]
    );

    useEffect(() => {
        runQuery({
            variables: {
                hotelId: hotelId,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                rooms: roomsInput
            }
        });
        // Only run on first time, after that need to click submit button
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [runQuery]);

    const goToBookingRoomSummary = room => {
        history.push({
            pathname: resourceUrl('/expedia/booking-summary'),
            state: {
                room: room,
                roomsInput: roomsInput,
                hotelInfo: hoteInfo,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                hotelId: hotelId
            }
        });
    };

    return {
        isValidParam,
        formApiRef,
        roomsInput,
        setRoomsInput,
        hotelInfo: hoteInfo,
        roomsList: hotelData ? hotelData.rooms : null,
        isSearching,
        handleSubmitSearch,
        checkInDate,
        checkOutDate,
        goToBookingRoomSummary
    };
};
