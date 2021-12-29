import React from 'react';
import MyPageLayout from '@skp/components/MyPageLayout';
import OrderList from '@skp/components/OrderList';
import { useTranslation } from 'react-i18next';

const OrderHistory = () => {
    const { t } = useTranslation(['navigation']);
    return (
        <MyPageLayout pageTitle={t('navigation::My Orders')}>
            <OrderList />
        </MyPageLayout>
    );
};

export default OrderHistory;
