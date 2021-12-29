import React from 'react';
import MyPageLayout from '@skp/components/MyPageLayout';
import ServiceDetail from '@skp/components/ServiceDetail';
import { useTranslation } from 'react-i18next';

const OrderHistoryDetail = () => {
    const { t } = useTranslation(['navigation']);
    return (
        <MyPageLayout pageTitle={t('navigation::My Services')}>
            <ServiceDetail />
        </MyPageLayout>
    );
};

export default OrderHistoryDetail;
