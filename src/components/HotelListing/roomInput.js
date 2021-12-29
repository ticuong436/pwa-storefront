import React, { useEffect, useState, useMemo } from 'react';
import trash2Icon from 'design/dest/images/trash-2.svg';
import SelectInput from '@skp/components/SelectInput';

const MAX_ADULTS = 2;
const MAX_CHILDREN = 2;
const MAX_CHILD_AGE = 17;

function RoomInput({ room, roomIndex, onUpdate, canDelete, onClickDelete }) {
    const adultsInput = useMemo(() => {
        const adultsInput = [];
        for (let index = 1; index <= MAX_ADULTS; index++) {
            adultsInput.push(
                <option value={index} key={index}>
                    {index}
                </option>
            );
        }

        return adultsInput;
    }, []);

    const childrenInput = useMemo(() => {
        const childrenInput = [];
        for (let index = 0; index <= MAX_CHILDREN; index++) {
            childrenInput.push(
                <option value={index} key={index}>
                    {index}
                </option>
            );
        }

        return childrenInput;
    }, []);

    const childAgeInput = useMemo(() => {
        const childAgeInput = [];
        for (let index = 0; index <= MAX_CHILD_AGE; index++) {
            childAgeInput.push(
                <option value={index} key={index}>
                    {index}
                </option>
            );
        }

        return childAgeInput;
    }, []);

    const [children, setChildren] = useState(room.children_and_ages.length);
    const [child1Age, setChild1Age] = useState(room.children_and_ages[0] || 0);
    const [child2Age, setChild2Age] = useState(room.children_and_ages[1] || 0);

    useEffect(() => {
        if (children === 0) {
            onUpdate({ ...room, ...{ children_and_ages: [] } });
        } else if (children === 1) {
            onUpdate({ ...room, ...{ children_and_ages: [child1Age] } });
        } else if (children === 2) {
            onUpdate({
                ...room,
                ...{ children_and_ages: [child1Age, child2Age] }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [child1Age, child2Age, children]);

    return (
        <div className="booking-room">
            <div className="booking-room--title">
                <span>部屋{roomIndex}</span>
            </div>
            <div className="booking-choose">
                <div className="booking-choose-name">大人</div>
                <div className="booking-box" style={{ height: 'auto' }}>
                    <SelectInput
                        classes={{ input: 'form-control' }}
                        initialValue={room.adults}
                        onChange={e => {
                            onUpdate({
                                ...room,
                                ...{ adults: parseInt(e.target.value) }
                            });
                        }}
                    >
                        {adultsInput}
                    </SelectInput>
                </div>
            </div>
            <div className="booking-choose">
                <div className="booking-choose-name">子供</div>
                <div className="booking-box" style={{ height: 'auto' }}>
                    <SelectInput
                        classes={{ input: 'form-control' }}
                        initialValue={room.children_and_ages.length}
                        onChange={e => {
                            setChildren(parseInt(e.target.value));
                        }}
                    >
                        {childrenInput}
                    </SelectInput>
                </div>
            </div>
            <div className="booking-choose">
                <div className="booking-choose-name">子供1の年齢</div>
                <div className="booking-box" style={{ height: 'auto' }}>
                    <SelectInput
                        classes={{ input: 'form-control' }}
                        initialValue={child1Age}
                        onChange={e => {
                            setChild1Age(parseInt(e.target.value));
                        }}
                        disabled={children < 1}
                    >
                        {childAgeInput}
                    </SelectInput>
                </div>
            </div>
            <div className="booking-choose">
                <div className="booking-choose-name">子供2の年齢</div>
                <div className="booking-box" style={{ height: 'auto' }}>
                    <SelectInput
                        classes={{ input: 'form-control' }}
                        initialValue={child2Age}
                        onChange={e => {
                            setChild2Age(parseInt(e.target.value));
                        }}
                        disabled={children < 2}
                    >
                        {childAgeInput}
                    </SelectInput>
                </div>
            </div>
            {canDelete && (
                <div
                    className="booking-delete cursor-pointer"
                    onClick={onClickDelete}
                >
                    <img src={trash2Icon} />
                </div>
            )}
        </div>
    );
}

export default RoomInput;
