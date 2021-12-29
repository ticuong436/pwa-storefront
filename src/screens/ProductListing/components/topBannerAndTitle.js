import React from 'react';
import TargetBlankLink from '@skp/components/TargetBlankLink';
import { useTranslation } from 'react-i18next';

export default function TopBannerAndTitle({
    bannerUrl,
    title,
    description,
    serviceInstruction = {}
}) {
    const { t } = useTranslation(['product_listing']);

    return (
        <div className="shopping-top">
            <img src={bannerUrl} alt="" className="w-100" />
            <div className="container pillar-block">
                <p className="shopping--title">{title}</p>
                <p className="shopping--text w--400">{description}</p>
                {serviceInstruction.url && (
                    <p className="shopping--instruction color-gold">
                        <TargetBlankLink
                            className="shopping--instruction-link"
                            href={serviceInstruction.url}
                            onMouseDown={e => {
                                e.preventDefault();
                            }}
                        >
                            {t('product_listing::Click here for details')}
                        </TargetBlankLink>
                    </p>
                )}
            </div>
        </div>
    );
}
