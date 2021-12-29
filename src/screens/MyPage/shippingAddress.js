import React from 'react';
import MyPageLayout from '@skp/components/MyPageLayout';
import { ListShippingAddress } from '@skp/components/ShippingAddress';
import { useTranslation } from 'react-i18next';

const ShippingAddress = () => {
    const { t } = useTranslation(['navigation']);
    return (
        <MyPageLayout pageTitle={t('navigation::Manage Shipping Address')}>
            <ListShippingAddress />
        </MyPageLayout>
    );
};

export default ShippingAddress;
