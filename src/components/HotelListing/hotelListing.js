import React from 'react';
import { useTranslation } from 'react-i18next';
import HotelItem from './hotelItem';
import SearchInputForm from './searchInputForm';
import { useHotelListing } from './useHotelListing';
import LoadingIndicator from '@skp/components/LoadingIndicator';

function HotelListing({ pageSize: defaultPageSize, searchFilterParams }) {
    const {
        hotels,
        suggestedKeywords,
        onInputKeyword,
        isSearching,
        handleSubmitSearch,
        formApiRef,
        roomsInput,
        setRoomsInput,
        onClickSuggestedKeyword,
        onClickSortOption,
        handleLoadMore,
        hasMore,
        setHotels,
        setCurrentCloudSearchPage,
        searchApiCalled
    } = useHotelListing({
        defaultPageSize,
        searchFilterParams
    });

    const { t } = useTranslation(['hotel']);

    return (
        <>
            <SearchInputForm
                roomsInput={roomsInput}
                setRoomsInput={setRoomsInput}
                formApiRef={formApiRef}
                onInputKeyword={onInputKeyword}
                isSearching={isSearching}
                handleSubmitSearch={values => {
                    setCurrentCloudSearchPage(1);
                    setHotels([]);
                    handleSubmitSearch(values);
                }}
                onClickSuggestedKeyword={onClickSuggestedKeyword}
                rememberParams={true}
                totalCount={hotels.length}
                showSort={true}
                suggestedKeywords={suggestedKeywords}
                onClickSortOption={onClickSortOption}
            />
            {isSearching && <LoadingIndicator isDisplay={true} />}
            <div className="ota">
                <div className="result-full mlisting">
                    <div className="row">
                        <div className="mlisting-list">
                            {hotels.length > 0
                                ? hotels.map(hotel => (
                                      <HotelItem key={hotel.id} hotel={hotel} />
                                  ))
                                : searchApiCalled &&
                                  !isSearching &&
                                  t('hotel::No available hotels found.')}
                        </div>
                    </div>
                    {hasMore && (
                        <div className="row justify-content-center">
                            <button
                                className="button-action"
                                onClick={() => {
                                    handleLoadMore();
                                }}
                            >
                                {t('hotel::Load More')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default HotelListing;

HotelListing.defaultProps = {
    pageSize: 50
};
