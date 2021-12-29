import React from 'react';
import MyPageLayout from '@skp/components/MyPageLayout';
import SpecificUserPurchaseProducts from '@skp/components/SpecificUserPurchaseProducts';
import { useTranslation } from 'react-i18next';

const SpecificUserPurchase = () => {
    const { t } = useTranslation(['navigation']);

    return (
        <MyPageLayout pageTitle={t('navigation::User Purchase')}>
            <SpecificUserPurchaseProducts />
        </MyPageLayout>
    );
};

export default SpecificUserPurchase;
