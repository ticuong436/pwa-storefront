import React from 'react';
import MyPageLayout from '@skp/components/MyPageLayout';
import ServiceList from '@skp/components/ServiceList';
import { useTranslation } from 'react-i18next';

const ServiceHistory = () => {
    const { t } = useTranslation(['navigation']);
    return (
        <MyPageLayout pageTitle={t('navigation::My Services')}>
            <ServiceList />
        </MyPageLayout>
    );
};

export default ServiceHistory;
