import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Error500({ message }) {
    const { t } = useTranslation(['common']);

    return (
        <ErrorView>
            <h1 style={{ minHeight: '300px' }}>
                {message || t('common::Something went wrong!')}
            </h1>
        </ErrorView>
    );
}
