import React from 'react';
import MyPageLayout from '@skp/components/MyPageLayout';
import { useTranslation } from 'react-i18next';
import ShoppingSubscriptionContent from '@skp/components/ShoppingSubscription';

const ShoppingSubscription = () => {
    const { t } = useTranslation(['navigation']);
    return (
        <MyPageLayout pageTitle={t('navigation::Shopping Subscription')}>
            <ShoppingSubscriptionContent />
        </MyPageLayout>
    );
};

export default ShoppingSubscription;
