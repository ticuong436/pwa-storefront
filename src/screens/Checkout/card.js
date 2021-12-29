import React from 'react';
import CreditCardIcon from '@skp/components/CreditCardIcon';

function Card({
    card,
    isSelected,
    onSelect,
    showEdit,
    onClickEdit,
    allowDelete,
    onClickDelete
}) {
    return (
        <div
            className="col-lg-4 col-md-12 shipping-address-row"
            onClick={onSelect}
        >
            <div
                className={
                    'location-ship ' +
                    (isSelected ? 'location-ship--active' : '')
                }
            >
                <div className="location-ship__info">
                    {' '}
                    <CreditCardIcon
                        brand={card.brand}
                        className="location-ship__images"
                    />
                    <div className="location-ship__action">
                        {showEdit && (
                            <a
                                href="#"
                                className="location-ship__link"
                                onClick={onClickEdit}
                            >
                                編集する
                            </a>
                        )}
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
                <p className="location-ship__number">
                    **** **** **** {card.last4}
                </p>
                <div className="row location-ship__list">
                    <div className="col-lg-12 col-md-12">
                        <div className="col-lg-12 col-md-12">
                            <p className="location-ship__txt">
                                {card.exp_month}/{card.exp_year}
                            </p>
                            <p className="location-ship__txt">{card.name}</p>
                            <p className="location-ship__txt">
                                {card.postal_code}
                            </p>
                            <p className="location-ship__txt">{card.state}</p>
                            <p className="location-ship__txt">{card.city}</p>
                            <p className="location-ship__txt">
                                {card.address_street1 +
                                    ' ' +
                                    (card.address_street2
                                        ? card.address_street2
                                        : '')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;
