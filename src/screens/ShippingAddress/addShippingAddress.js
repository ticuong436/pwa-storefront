import React from 'react';
import { useTranslation } from 'react-i18next';
import MyPageLayout from '@skp/components/MyPageLayout';
import AddressForm from '@skp/components/ShippingAddress/addressForm';
import { useHistory } from '@skp/drivers';
import { useNotificationContext } from '@skp/layouts/context/notification';

export default function AddShippingAddress() {
    const history = useHistory();
    const { t } = useTranslation(['navigation', 'shipping_address']);
    const [, { setInfo }] = useNotificationContext();
    return (
        <MyPageLayout pageTitle={t('navigation::Manage Shipping Address')}>
            <AddressForm
                onAddressAdded={() => {
                    history.goBack();
                    setTimeout(
                        () =>
                            setInfo(
                                t(
                                    'shipping_address::Create Shipping Address sucessfully.'
                                )
                            ),
                        500
                    );
                }}
                onCancel={() => history.goBack()}
                allowChangeDefaultShipping={true}
            />
        </MyPageLayout>
    );
}
