import React from 'react';
import Profile from '@skp/components/MyProfile';
import MyPageLayout from '@skp/components/MyPageLayout';
import { useTranslation } from 'react-i18next';

const MyProfile = () => {
    const { t } = useTranslation(['navigation']);
    return (
        <MyPageLayout pageTitle={t('navigation::My Profile')}>
            <Profile />
        </MyPageLayout>
    );
};

export default MyProfile;
