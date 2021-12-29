import React from 'react';
import MyPageLayout from '@skp/components/MyPageLayout';
import { RegisterPlatinumPartner } from '@skp/components/RegisterPlatinumPartner';
import { useTranslation } from 'react-i18next';

const RegisterPlatinumPartnerPage = () => {
    const { t } = useTranslation(['navigation']);
    return (
        <MyPageLayout pageTitle={t('navigation::Register Platinum Partner')}>
            <RegisterPlatinumPartner />
        </MyPageLayout>
    );
};

export default RegisterPlatinumPartnerPage;
