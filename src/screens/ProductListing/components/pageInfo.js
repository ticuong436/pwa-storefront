import React from 'react';
import { SERVICE_CODE, SITE_LINKS } from '@skp/config';
import { useTranslation } from 'react-i18next';
import TargetBlankLink from '@skp/components/TargetBlankLink';

export default function PageInfo({
    title,
    description,
    serviceCode,
    serviceInstruction = {}
}) {
    const { t } = useTranslation(['product_listing']);

    return (
        <div className="shopping-info">
            <div className="row">
                <div className="shopping-des col-md-12">
                    <div className="listing-restaurant">
                        <h2 className="shopping--title">{title}</h2>
                    </div>
                    {description && (
                        <p className="shopping--text">{description}</p>
                    )}

                    {serviceInstruction.url && (
                        <p className="shopping--instruction color-gold">
                            <TargetBlankLink
                                className="shopping--instruction-link"
                                href={serviceInstruction.url}
                                onMouseDown={e => {
                                    e.preventDefault();
                                }}
                            >
                                {t('product_listing::Instruction')}
                            </TargetBlankLink>
                        </p>
                    )}

                    {serviceCode == SERVICE_CODE.the_community && (
                        <div
                            className="listing-restaurant--sub"
                            style={{ float: 'right' }}
                        >
                            {t('product_listing::About community')}
                            <TargetBlankLink
                                href={SITE_LINKS['the-community']}
                                rel="noopener noreferrer"
                                className="color-gold"
                            >
                                {t('product_listing::Here')}
                            </TargetBlankLink>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
