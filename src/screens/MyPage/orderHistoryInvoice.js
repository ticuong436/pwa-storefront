import React from 'react';
import MyPageLayout from '@skp/components/MyPageLayout';
import OrderDetail from '@skp/components/OrderDetail';
import { useTranslation } from 'react-i18next';

const OrderHistoryInvoice = () => {
    const { t } = useTranslation(['navigation']);
    return (
        <MyPageLayout pageTitle={t('navigation::My Orders')}>
            <OrderDetail />
        </MyPageLayout>
    );
};

export default OrderHistoryInvoice;
