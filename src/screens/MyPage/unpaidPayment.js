import React from 'react';
import MyPageLayout from '@skp/components/MyPageLayout';
import { UnpaidPeriod } from '@skp/components/UnpaidPeriod';
import { useTranslation } from 'react-i18next';

const UnpaidPayment = () => {
    const { t } = useTranslation(['navigation']);
    return (
        <MyPageLayout pageTitle={t('navigation::Payment History')}>
            <UnpaidPeriod />
        </MyPageLayout>
    );
};

export default UnpaidPayment;
