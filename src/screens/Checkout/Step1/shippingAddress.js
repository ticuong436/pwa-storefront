import React from 'react';
import { useTranslation } from 'react-i18next';

function ShippingAddress({ address, isSelected, onSelect, onClickEdit }) {
    const { t } = useTranslation(['common']);

    return (
        <div className="col-lg-4 col-md-12 shipping-address-row">
            <div
                className={
                    'location-ship' +
                    (isSelected ? ' location-ship--active' : '')
                }
            >
                <div className="location-ship__info">
                    <h5 className="location-ship__name">
                        {`${address.lastname} ${address.firstname}`}
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
                            {t('common::Edit')}
                        </a>
                    </div>
                </div>
                <div className="row location-ship__list" onClick={onSelect}>
                    <div className="col-lg-12 col-md-12">
                        <div className="location-ship__col">
                            <p className="location-ship__txt">
                                {address.region
                                    ? address.region.label ||
                                      address.region.region
                                    : null}{' '}
                                {address.postcode} {address.country_code}
                            </p>
                            {address.street.map((street, index) => (
                                <p className="location-ship__txt" key={index}>
                                    {street},{' '}
                                    {index === 1 ? address.city : null}
                                </p>
                            ))}
                            <p className="location-ship__txt">
                                Japan ( +81 ) {address.telephone}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShippingAddress;
