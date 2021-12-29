import React from 'react';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import ShippingAddress from './shippingAddress';
import { useTranslation } from 'react-i18next';
import AlertMessage from '@skp/components/AlertMessage';

export default function SelectShippingAddress({
    setActionPage,
    actionType,
    addresses,
    isLoadingAddresses,
    selectAddress,
    selectedAddress,
    isSelectingAddress
}) {
    const { t } = useTranslation(['checkout']);

    if (isLoadingAddresses || isSelectingAddress) {
        return <LoadingIndicator />;
    }

    return (
        <div className="select-location">
            <div className="row">
                {addresses.length > 0 ? (
                    addresses.map(address => (
                        <ShippingAddress
                            key={address.id}
                            address={address}
                            isSelected={address.id === selectedAddress.id}
                            onSelect={() => selectAddress(address)}
                            showEdit={true}
                            canChangeDefaultShipping={false}
                            onClickEdit={() => {
                                setActionPage({
                                    type: actionType.ACTION_EDIT,
                                    address
                                });
                            }}
                            allowDelete={false}
                        />
                    ))
                ) : (
                    <div className="col-md-12">
                        <AlertMessage type="warning">
                            {t(
                                "checkout::You haven't had any saved address yet."
                            )}
                        </AlertMessage>
                    </div>
                )}
            </div>
        </div>
    );
}
