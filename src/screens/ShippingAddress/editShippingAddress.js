import React from 'react';
import MyPageLayout from '@skp/components/MyPageLayout';
import AddressForm from '@skp/components/ShippingAddress/addressForm';
import { useHistory, useParams } from '@skp/drivers';
import { useListAddress } from '@skp/components/ShippingAddress/useListAddress';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useTranslation } from 'react-i18next';
import { useNotificationContext } from '@skp/layouts/context/notification';

export default function EditShippingAddress() {
    const { t } = useTranslation(['navigation', 'shipping_address']);
    const { addresses, isLoadingAddresses } = useListAddress();
    const history = useHistory();
    const [, { setInfo }] = useNotificationContext();
    const { shipping_address_id: shippingAddressId } = useParams();
    const address = addresses.find(address => {
        return shippingAddressId == address.id ? address.id : '';
    });

    if (isLoadingAddresses) {
        return <LoadingIndicator />;
    }

    return (
        <MyPageLayout pageTitle={t('navigation::Manage Shipping Address')}>
            <AddressForm
                onAddressAdded={() => {
                    history.goBack();
                    setTimeout(
                        () =>
                            setInfo(
                                t(
                                    'shipping_address::Update Shipping Address sucessfully.'
                                )
                            ),
                        500
                    );
                }}
                address={address}
                onCancel={() => history.goBack()}
                allowChangeDefaultShipping={true}
            />
        </MyPageLayout>
    );
}
