import React from 'react';
import MyPageLayout from '@skp/components/MyPageLayout';
import { ListBillingAddress } from '@skp/components/BillingAddress';
import { useTranslation } from 'react-i18next';

const ShippingAddress = () => {
    const { t } = useTranslation(['navigation']);
    return (
        <MyPageLayout pageTitle={t('navigation::Manage Billing Address')}>
            <ListBillingAddress />
        </MyPageLayout>
    );
};

export default ShippingAddress;
