import React from 'react';
import { Title } from '@magento/venia-ui/lib/components/Head';
import { useTranslation } from 'react-i18next';
import { usePageViewTracking } from '@skp/libs/tracking';

export default function PageTitle({ title, transate = true }) {
    const { t } = useTranslation(['page_title']);

    const pageTitle = `${
        transate ? t('page_title::' + title) : title
    } - ${STORE_NAME}`;

    usePageViewTracking(pageTitle);

    // Note: STORE_NAME is injected by Webpack at build time.
    return <Title>{pageTitle}</Title>;
}
