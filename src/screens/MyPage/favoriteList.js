import React from 'react';
import MyPageLayout from '@skp/components/MyPageLayout';
import WishList from '@skp/components/WishList';
import { useTranslation } from 'react-i18next';

const FavoriteList = () => {
    const { t } = useTranslation(['navigation']);
    return (
        <MyPageLayout pageTitle={t('navigation::My Favourites')}>
            <WishList />
        </MyPageLayout>
    );
};

export default FavoriteList;
