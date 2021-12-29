import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Error404() {
    const { t } = useTranslation(['common']);

    return (
        <ErrorView>
            <h1 style={{ minHeight: '300px' }}>
                {t('common::Page not found')}
            </h1>
        </ErrorView>
    );
}
