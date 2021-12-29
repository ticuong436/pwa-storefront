import React from 'react';
import AddressForm from '@skp/components/ShippingAddress/addressForm';
import Dialog from '@skp/components/Dialog';
import { useTranslation } from 'react-i18next';
import { useNotificationContext } from '@skp/layouts/context/notification';

export default function ShippingAddressForm({
    actionPage,
    setActionPage,
    actionType,
    refreshAddresses,
    allowChangeDefaultShipping,
    formPopup
}) {
    const { t } = useTranslation(['checkout', 'shipping_address']);
    const [, { setInfo }] = useNotificationContext();

    let shippingAddressTitle = null;
    let shippingAddressForm = null;

    if (actionPage.type === actionType.ACTION_ADD) {
        shippingAddressTitle = t(
            'checkout::Add new shipping address Modal title'
        );
        shippingAddressForm = (
            <AddressForm
                onAddressAdded={() => {
                    setActionPage({ type: null });
                    refreshAddresses();
                    setInfo(
                        t(
                            'shipping_address::Create Shipping Address sucessfully.'
                        )
                    );
                }}
                formPopup={formPopup}
                onCancel={() => {
                    setActionPage({ type: null });
                }}
                allowChangeDefaultShipping={allowChangeDefaultShipping}
            />
        );
    }

    if (actionPage.type === actionType.ACTION_EDIT) {
        shippingAddressTitle = t(
            'checkout::Update shipping address Modal title'
        );
        shippingAddressForm = (
            <AddressForm
                onAddressAdded={() => {
                    setActionPage({ type: null });
                    refreshAddresses();
                    setInfo(
                        t(
                            'shipping_address::Update Shipping Address sucessfully.'
                        )
                    );
                }}
                formPopup={formPopup}
                address={actionPage.currentAddress}
                onCancel={() => {
                    setActionPage({ type: null });
                }}
                allowChangeDefaultShipping={allowChangeDefaultShipping}
            />
        );
    }

    return (
        <Dialog
            onClose={() => {
                setActionPage({ type: null });
            }}
            isOpen={!!(actionPage && actionPage.type)}
            title={shippingAddressTitle}
        >
            {shippingAddressForm}
        </Dialog>
    );
}
