import React from 'react';
import MyPageLayout from '@skp/components/MyPageLayout';
import RestockRequest from '@skp/components/RestockRequest';
import { useTranslation } from 'react-i18next';

const RestockRequestPage = () => {
    const { t } = useTranslation(['navigation']);
    return (
        <MyPageLayout pageTitle={t('navigation::Restock Request List')}>
            <RestockRequest />
        </MyPageLayout>
    );
};

export default RestockRequestPage;
