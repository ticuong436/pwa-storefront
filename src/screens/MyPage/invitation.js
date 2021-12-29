import React from 'react';
import { Invitation } from '@skp/components/Invitation';
import MyPageLayout from '@skp/components/MyPageLayout';
import { useTranslation } from 'react-i18next';

const InvitationPage = () => {
    const { t } = useTranslation(['navigation']);
    return (
        <MyPageLayout pageTitle={t('navigation::Invitation')}>
            <Invitation />
        </MyPageLayout>
    );
};

export default InvitationPage;
