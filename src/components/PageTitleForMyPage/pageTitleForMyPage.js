import React from 'react';
import { Title } from '@magento/venia-ui/lib/components/Head';
import { useTranslation } from 'react-i18next';
import { usePageViewTracking } from '@skp/libs/tracking';

export default function PageTitleForMyPage({ title }) {
    const { t } = useTranslation(['page_title']);

    const pageTitle = `${t('page_title::My Page')} - ${title} - ${
        /* Note: STORE_NAME is injected by Webpack at build time. */ STORE_NAME
    }`;

    usePageViewTracking(pageTitle);

    return <Title>{pageTitle}</Title>;
}
