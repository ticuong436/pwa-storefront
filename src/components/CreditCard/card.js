import React from 'react';
import CreditCardIcon from '@skp/components/CreditCardIcon';
import icon from 'design/dest/images/ic-check.png';

function Card({
    card,
    isSelected,
    showEdit,
    onSelect,
    onClickEdit,
    allowDelete,
    onClickDelete
}) {
    return (
        <div className="col-lg-6 col-md-12" onClick={onSelect}>
            <div
                className={
                    'location-ship ' +
                    (isSelected ? 'location-ship--active' : '')
                }
            >
                <div className="location-ship__info">
                    <CreditCardIcon
                        brand={card.brand}
                        className="location-ship__images"
                    />
                    <div className="location-ship__action">
                        {showEdit && (
                            <a
                                className="location-ship__link"
                                onClick={onClickEdit}
                                href="#"
                            >
                                編集する
                            </a>
                        )}

                        {allowDelete && (
                            <>
                                <p className="location-ship__line" />
                                <a
                                    className="location-ship__link"
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onClickDelete();
                                    }}
                                    href="#"
                                >
                                    削除する
                                </a>
                            </>
                        )}
                    </div>
                </div>
                <div className="row location-ship__list">
                    <div className="col-lg-4 col-md-12">
                        <div className="location-ship__col">
                            <p className="location-ship__txt">
                                XXXXXX-{card.last4}
                            </p>
                            <p className="location-ship__txt">
                                Expiration: {card.exp_month}/{card.exp_year}
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-8 col-md-12">
                        <div className="location-ship__col">
                            <p className="location-ship__txt">{card.name}</p>
                            <p className="location-ship__txt">
                                {card.postal_code}
                            </p>
                            <p className="location-ship__txt">
                                {card.state +
                                    ' ' +
                                    card.city +
                                    ' ' +
                                    card.address_street1}
                            </p>
                            <p className="location-ship__txt">
                                {card.country_name}
                            </p>
                            <p className="location-ship__txt">
                                {card.address_street2}
                            </p>
                        </div>
                    </div>
                </div>
                {isSelected ? (
                    <div className="location-boxes">
                        <img src={icon} />
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
}

export default Card;
