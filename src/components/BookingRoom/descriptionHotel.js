import React from 'react';

function DescriptionHotel({ hotelInfo }) {
    const descriptions =
        hotelInfo && hotelInfo.descriptions ? hotelInfo.descriptions : [];
    const descriptionsHotel = Object.keys(descriptions).map(function(
        key,
        index
    ) {
        if (key != '__typename') {
            let title = '';
            switch (key) {
                case 'location':
                    title = 'Locations';
                    break;
                case 'attractions':
                    title = 'Attractions';
                    break;
                case 'dining':
                    title = 'Dining';
                    break;
                case 'amenities':
                    title = 'Amenities';
                    break;
                case 'business_amenities':
                    title = 'Business Amenities';
                    break;
                case 'rooms':
                    title = 'Rooms';
                    break;
                case 'renovations':
                    title = 'Renovations';
                    break;
                case 'national_ratings':
                    title = 'Rational Ratings';
                    break;
                case 'headline':
                    title = 'Headline';
                    break;
                default:
                    break;
            }

            return (
                descriptions[key] && (
                    <div key={index} className="room-basic">
                        <div className="room-basic__row">
                            <h3 className="room-basic__title">{title}</h3>
                            <div className="room-basic__content">
                                <div className="room-basic__item">
                                    <div className="room-basic__info">
                                        <p
                                            className="room-basic__des"
                                            dangerouslySetInnerHTML={{
                                                __html: descriptions[key]
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            );
        }
    });

    return <>{descriptionsHotel}</>;
}

export default DescriptionHotel;
