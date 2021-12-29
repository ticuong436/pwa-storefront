import React from 'react';
import { useTranslation } from 'react-i18next';

function BannerSlide({ banner, classes }) {
    const { t } = useTranslation(['common']);
    return (
        <>
            <div className={classes.title}>
                <a
                    className={classes.titleAnchor}
                    href={banner.link}
                    title={banner.title}
                >
                    <span className={classes.titleWhenActive}>
                        {t('common::Learn more')}
                    </span>
                    <span className={classes.titleWhenInactive}>
                        {banner.title}
                    </span>
                </a>
            </div>
            <div className={classes.content}>
                <div className={classes.floatingLabel}>
                    <div className={classes.header}>{banner.header}</div>
                    <div className={classes.desc}>{banner.description}</div>
                    <div className={classes.smallTitle}>{banner.title}</div>
                    <div className={classes.vline} />
                </div>
            </div>
        </>
    );
}

export default BannerSlide;
