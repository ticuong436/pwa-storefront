import React from 'react';
import HotelImageCarousel from './carousel';
import GoogleMapReact from 'google-map-react';
import HotelRatingIcon from '@skp/components/HotelRatingIcon';
import { GMAP_KEY } from '@skp/config';

const AnyReactComponent = () => (
    <div className="map-marker">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14.98"
            height="20.685"
            viewBox="0 0 14.98 20.685"
        >
            <path
                id="Path_76"
                data-name="Path 76"
                d="M7.49,0A7.5,7.5,0,0,0,0,7.49c0,5.13,6.7,12.65,6.99,12.97a.668.668,0,0,0,1,0c.29-.32,6.99-7.84,6.99-12.97A7.5,7.5,0,0,0,7.49,0Zm0,11.26a3.77,3.77,0,1,1,3.77-3.77A3.773,3.773,0,0,1,7.49,11.26Z"
                fill="#ea4335"
            />
        </svg>
    </div>
);

function HotelDetail({ hotelInfo }) {
    const address = hotelInfo && hotelInfo.address ? hotelInfo.address : '';
    const location = hotelInfo && hotelInfo.location ? hotelInfo.location : '';
    const images = hotelInfo && hotelInfo.images ? hotelInfo.images : [];
    const rating = hotelInfo && hotelInfo.rating ? hotelInfo.rating : '';
    const center = {
        lat: location && location.latitude ? parseFloat(location.latitude) : 0,
        lng: location && location.longitude ? parseFloat(location.longitude) : 0
    };
    const ZOOM = 17;

    return (
        <div className="product-detail">
            <div className="row">
                <div className="col-lg-8 col-md-8 product-detail__images">
                    <HotelImageCarousel images={images} />
                </div>
                <div className="col-lg-4 col-md-4 product-detail__info">
                    <div className="product-detail__top">
                        <span className="product-detail__cate">Travel</span>
                    </div>
                    <span className="product-detail__line" />
                    <h2 className="product-detail__title">
                        {hotelInfo && hotelInfo.name}
                    </h2>
                    <span className="product-detail__cate-sub">
                        {hotelInfo && hotelInfo.category}
                        {hotelInfo &&
                            hotelInfo.address &&
                            (hotelInfo.address.state_province_name
                                ? ' - ' + hotelInfo.address.state_province_name
                                : '') +
                                (hotelInfo.address.city
                                    ? ' , ' + hotelInfo.address.city
                                    : '')}
                        {}
                    </span>
                    <div className="mlisting-rating">
                        <HotelRatingIcon
                            itemClass="mlisting-rating-item"
                            rating={rating}
                        />
                    </div>
                    <div className="product-detail__map">
                        <div>
                            {hotelInfo && (
                                <GoogleMapReact
                                    bootstrapURLKeys={{
                                        key: GMAP_KEY
                                    }}
                                    center={center}
                                    defaultZoom={ZOOM}
                                >
                                    <AnyReactComponent
                                        lat={center.lat}
                                        lng={center.lng}
                                    >
                                        {/* No need to display hotel name */}
                                        {/* {hotelInfo.name} */}
                                    </AnyReactComponent>
                                </GoogleMapReact>
                            )}
                        </div>
                    </div>
                    <div className="product-detail__location">
                        <span className="product-detail__location-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14.98"
                                height="20.685"
                                viewBox="0 0 14.98 20.685"
                            >
                                <path
                                    id="Path_76"
                                    data-name="Path 76"
                                    d="M7.49,0A7.5,7.5,0,0,0,0,7.49c0,5.13,6.7,12.65,6.99,12.97a.668.668,0,0,0,1,0c.29-.32,6.99-7.84,6.99-12.97A7.5,7.5,0,0,0,7.49,0Zm0,11.26a3.77,3.77,0,1,1,3.77-3.77A3.773,3.773,0,0,1,7.49,11.26Z"
                                    fill="#baa9ad"
                                />
                            </svg>
                        </span>
                        <span className="product-detail__location-value">
                            {address.line_1} {address.line_2} {address.city}{' '}
                            {address.country_code}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HotelDetail;
