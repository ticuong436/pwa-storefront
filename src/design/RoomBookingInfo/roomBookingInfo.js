import React from 'react';

function RoomBookingInfo({ index, guestName, specialRequest }) {
    return (
        <div className="room-type">
            <span className="room-type__name">
                <strong>Room #{index}: </strong>
            </span>
            <span className="room-type__name">{guestName}</span>
            {specialRequest && (
                <span className="room-type__name">
                    Special Request: {specialRequest}
                </span>
            )}
        </div>
    );
}

export default RoomBookingInfo;
