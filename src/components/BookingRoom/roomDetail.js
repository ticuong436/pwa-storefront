import React from 'react';
import HotelImageCarousel from './carousel';
import { useToggleModalClass } from '@skp/hooks/useLayoutEffect';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import clockClose from 'design/dest/images/x.svg';

const RoomDetail = props => {
    const { isOpen, onCancel, room } = props;
    useToggleModalClass(isOpen);
    const rootClass = isOpen ? 'modal fade show' : 'modal fade';
    const amenities =
        room.amenities &&
        room.amenities.map((amenitie, index) => (
            <div key={index} className="mroom-amenities-item">
                <span className="mroom-capa--text">{amenitie.name}</span>
            </div>
        ));

    return (
        <Portal>
            <div
                className={rootClass}
                id="modal-room"
                aria-modal="true"
                role="dialog"
                style={isOpen ? { display: 'block' } : {}}
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    tabIndex={-1}
                    role="document"
                    aria-labelledby="modal-step2"
                    aria-hidden="true"
                >
                    <div className="modal-content mroom">
                        <div className="modal-body p-0">
                            <div className="mroom">
                                <a
                                    className="hoteladd-cancel"
                                    href="#"
                                    data-dismiss="modal"
                                    onClick={e => {
                                        e.preventDefault();
                                        onCancel();
                                    }}
                                >
                                    <img src={clockClose} alt="img" />
                                </a>
                                <div className="row">
                                    <div className="col-lg-7 col-md-6 mroom-images">
                                        <HotelImageCarousel
                                            images={room.images}
                                        />
                                    </div>
                                    <div className="col-lg-5 col-md-6 mroom-info">
                                        <div className="mroom-box">
                                            <div className="mroom--title">
                                                Room Details
                                            </div>
                                            <div className="mroom--sub">
                                                {room.name}
                                            </div>
                                            <div className="mroom-capa">
                                                <div className="mroom-capa-item">
                                                    <span className="mroom-capa--name">
                                                        定員
                                                    </span>
                                                    <span className="mroom-capa--text">
                                                        {room.capacity.total}名
                                                    </span>
                                                </div>
                                                <div className="mroom-capa-item">
                                                    <span className="mroom-capa--name">
                                                        部屋について
                                                    </span>
                                                    <span className="mroom-capa--text">
                                                        {
                                                            room.bed_group_description
                                                        }
                                                    </span>
                                                </div>
                                                {!!room.area && (
                                                    <div className="mroom-capa-item">
                                                        <span className="mroom-capa--name">
                                                            部屋の広さ
                                                        </span>
                                                        <span className="mroom-capa--text">
                                                            {room.area} m²
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mroom-amenities">
                                                <span className="mroom-capa--name">
                                                    部屋の設備
                                                </span>
                                            </div>
                                            <div className="mroom-amenities">
                                                {amenities}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && <div className="modal-backdrop fade show" />}
        </Portal>
    );
};

export default RoomDetail;
