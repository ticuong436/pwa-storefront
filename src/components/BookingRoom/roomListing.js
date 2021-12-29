import React from 'react';
import RoomItem from './roomItem';
import { useHotelInfo } from './useHotelInfo';
import SearchInputForm from '@skp/components/HotelListing/searchInputForm';
import { useParams, Redirect, resourceUrl } from '@skp/drivers';
import HotelDetail from './hotelDetail';
import DescriptionHotel from './descriptionHotel';
import { getCurrentSearch } from '@skp/components/HotelListing/utils/currentSearchParams';
import { PILLAR_CODE } from '@skp/config';
import Breadcrumbs from '@skp/components/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import LoadingIndicator from '@skp/components/LoadingIndicator';

function RoomListing() {
    const { hotel_id: hotelId } = useParams();
    const { t } = useTranslation(['hotel']);

    const savedHotelParams = getCurrentSearch();
    const initValueParams = {
        roomsInput: savedHotelParams.roomsInput,
        checkInDate: savedHotelParams.checkInDateFormated,
        checkOutDate: savedHotelParams.checkOutDateFormated
    };

    const {
        isValidParam,
        hotelInfo,
        roomsList,
        isSearching,
        handleSubmitSearch,
        formApiRef,
        roomsInput,
        setRoomsInput,
        checkInDate,
        checkOutDate,
        goToBookingRoomSummary
    } = useHotelInfo(hotelId, initValueParams);

    if (!isValidParam) {
        return (
            <Redirect
                to={resourceUrl(`${PILLAR_CODE.travel}/service/hotels`)}
            />
        );
    }

    const items = [
        {
            url: resourceUrl(PILLAR_CODE.travel),
            title: 'Travel'
        },
        {
            url: resourceUrl(`${PILLAR_CODE.travel}/service/hotels`),
            title: 'HOTELS'
        },
        {
            title: hotelInfo.name ? hotelInfo.name : ''
        }
    ];

    return (
        <>
            <Breadcrumbs items={items} />
            <HotelDetail hotelInfo={hotelInfo} />
            <div className="room-listing">
                <div className="room-listing__selectTitle">部屋を選択</div>
                <SearchInputForm
                    setRoomsInput={setRoomsInput}
                    formApiRef={formApiRef}
                    isSearching={isSearching}
                    handleSubmitSearch={handleSubmitSearch}
                    roomsInput={roomsInput}
                    checkInDate={checkInDate}
                    checkOutDate={checkOutDate}
                    rememberParams={false}
                    showSort={false}
                    hidenInputText={true}
                />
                {isSearching && <LoadingIndicator isDisplay={true} />}
                <div className="row room-listing__content">
                    <div className="col-lg-12 col-md-9 room-listing__left">
                        {roomsList
                            ? roomsList.map(room => (
                                  <RoomItem
                                      key={room.id}
                                      room={room}
                                      goToBookingRoomSummary={
                                          goToBookingRoomSummary
                                      }
                                      hotelInfo={hotelInfo}
                                  />
                              ))
                            : !isSearching &&
                              t('hotel::No available rooms found.')}
                    </div>
                </div>
                <DescriptionHotel hotelInfo={hotelInfo} />
            </div>
        </>
    );
}

export default RoomListing;
