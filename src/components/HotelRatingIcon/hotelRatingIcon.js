import React from 'react';
import starIcon from 'design/dest/images/star.svg';

export default function HotelRatingIcon({ rating, itemClass }) {
    return (
        <>
            {[1, 2, 3, 4, 5].map(star => (
                <div
                    key={star}
                    className={`${itemClass} ${
                        star <= rating ? 'star-active' : ''
                    }`}
                >
                    <img src={starIcon} alt="*" />
                </div>
            ))}
        </>
    );
}
