import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Copyright() {
    const { t } = useTranslation(['common']);

    return (
        <span>
            {t(
                'common::© {{year}} SKY PREMIUM INTERNATIONAL PTE LTD. ALL RIGHTS RESERVED. (v1.0.0.202011310800)',
                {
                    year: new Date().getFullYear()
                }
            )}
        </span>
    );
}
