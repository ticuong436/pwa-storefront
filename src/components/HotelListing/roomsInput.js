import React, { useEffect, useState } from 'react';
import plusIcon from 'design/dest/images/plus.svg';
import RoomInput from './roomInput';

const MAX_ROOMS = 8; // Like expedia? https://www.expedia.co.jp/en/?tpid=28&eapid=0
const randomKey = () => Math.random() * 1000 + '-' + Date.now().toString();
const roomObject = { adults: 2, children_and_ages: [] };

function RoomsInput({ onCancel, onConfirm, initialRooms }) {
    const [rooms, setRooms] = useState({
        [randomKey()]: { ...roomObject }
    });

    useEffect(() => {
        if (initialRooms && initialRooms.length) {
            const roomsState = {};
            initialRooms.forEach(room => {
                roomsState[randomKey()] = { ...room };
            });
            setRooms(roomsState);
        }
    }, [initialRooms]);

    const addRoom = () => {
        const key = randomKey();
        setRooms(oldRooms => {
            return {
                ...oldRooms,
                ...{ [key]: { ...roomObject } }
            };
        });
    };

    const removeRoom = key => {
        if (Object.keys(rooms).length === 1) {
            return;
        }

        if (rooms[key]) {
            setRooms(oldRooms => {
                const rooms = { ...oldRooms };
                delete rooms[key];
                return rooms;
            });
        }
    };

    const updateRoom = (key, newRoom) => {
        if (rooms[key]) {
            setRooms(oldRooms => {
                const rooms = { ...oldRooms };
                rooms[key] = newRoom;
                return rooms;
            });
        }
    };

    return (
        <>
            <div className="booking">
                {Object.keys(rooms).map((key, index) => (
                    <RoomInput
                        key={key}
                        roomIndex={index + 1}
                        room={rooms[key]}
                        onUpdate={room => updateRoom(key, room)}
                        canDelete={index !== 0}
                        onClickDelete={() => removeRoom(key)}
                    />
                ))}
            </div>
            <div className="booking-plus">
                {Object.keys(rooms).length < MAX_ROOMS && (
                    <>
                        <a
                            className="booking-plus-link cursor-pointer"
                            onClick={addRoom}
                        >
                            <img src={plusIcon} />
                        </a>
                        <span>部屋を追加</span>
                    </>
                )}
            </div>
            <div className="booking-bottom">
                <div className="booking-bottom-box">
                    <button
                        className="booking-btn booking-bottom--cancel"
                        type="button"
                        onClick={onCancel}
                    >
                        キャンセル
                    </button>
                </div>
                <div className="booking-bottom-box">
                    <button
                        className="booking-btn booking-bottom--confirm"
                        type="button"
                        onClick={() => onConfirm(Object.values(rooms))}
                    >
                        保存
                    </button>
                </div>
            </div>
        </>
    );
}

export default RoomsInput;
