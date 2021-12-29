import React, { useMemo } from 'react';
import { Title } from '@magento/venia-ui/lib/components/Head';
import { useTranslation } from 'react-i18next';
import { PILLAR_CODE } from '@skp/config';
import { usePageViewTracking } from '@skp/libs/tracking';

export default function PageTitleForPillar({
    pillarCode,
    subTitle,
    translateSubtitle = true
}) {
    const { t } = useTranslation(['page_title']);

    const title = useMemo(() => {
        switch (pillarCode) {
            case PILLAR_CODE.shopping:
                return t('page_title::Shopping');
            case PILLAR_CODE.winedine:
                return t('page_title::Wine & dine');
            case PILLAR_CODE.travel:
                return t('page_title::Travel');
            case PILLAR_CODE.wellness:
                return t('page_title::Wellness');
            case PILLAR_CODE.pointmall:
                return t('page_title::Pointmall');
            case PILLAR_CODE.estore:
                return t('page_title::Estore');

            default:
                return null;
        }
    }, [pillarCode, t]);

    const pageTitle = `${title} - ${
        translateSubtitle ? t('page_title::' + subTitle) : subTitle
    } - ${
        /* Note: STORE_NAME is injected by Webpack at build time. */ STORE_NAME
    }`;

    usePageViewTracking(pageTitle);

    return <Title>{pageTitle}</Title>;
}
