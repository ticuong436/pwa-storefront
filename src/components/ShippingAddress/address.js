import React from 'react';
import icon from 'design/dest/images/ic-check.png';

function Address({
    address,
    isSelected,
    onSelect,
    onClickEdit,
    onClickDelete,
    allowDelete
}) {
    return (
        <div
            className={
                'location-ship' + (isSelected ? ' location-ship--active' : '')
            }
        >
            <div className="location-ship__info">
                <h5 className="location-ship__name">
                    {address.lastname + ' ' + address.firstname}
                </h5>
                <div className="location-ship__action">
                    <a
                        className="location-ship__link"
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            onClickEdit();
                        }}
                    >
                        Edit
                    </a>
                    {allowDelete && (
                        <>
                            <p className="location-ship__line" />
                            <a
                                className="location-ship__link"
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onClickDelete();
                                }}
                            >
                                削除する
                            </a>
                        </>
                    )}
                </div>
            </div>
            <div className="row location-ship__list" onClick={onSelect}>
                <div className="col-lg-12 col-md-12">
                    <div className="location-ship__col">
                        <p className="location-ship__txt">
                            {/* Shipping address is only in Singapore */}
                            Singapore {address.postcode}
                        </p>
                        <p className="location-ship__txt">
                            {address.city} {address.street[0] || null}
                        </p>
                        {address.street[1] && (
                            <p className="location-ship__txt">
                                {address.street[1]}
                            </p>
                        )}
                        <p className="location-ship__txt">
                            Singapore (+65) {address.telephone}
                        </p>
                    </div>
                </div>
            </div>
            {isSelected && (
                <div className="location-boxes">
                    <img src={icon} />
                </div>
            )}
        </div>
    );
}

export default Address;
