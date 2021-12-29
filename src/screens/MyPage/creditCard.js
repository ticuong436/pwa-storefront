import React from 'react';
import { ListCard } from '@skp/components/CreditCard';
import MyPageLayout from '@skp/components/MyPageLayout';
import { useTranslation } from 'react-i18next';
import { useCreditCardMessage } from './hooks/useCreditCardMessage';

const CreditCard = () => {
    const { t } = useTranslation(['navigation']);

    useCreditCardMessage();

    return (
        <MyPageLayout pageTitle={t('navigation::Manage Credit Card')}>
            <ListCard />
        </MyPageLayout>
    );
};

export default CreditCard;
