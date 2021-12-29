import React from 'react';
import { TERMINATE } from '@skp/utils/changeType';
import { useTranslation } from 'react-i18next';

const OnlyViewOfferTerminate = props => {
    const { t } = useTranslation(['profile']);
    const { changeType } = props;

    if (changeType === TERMINATE) {
        return (
            <button
                className="member-pay--link keep-bg-on-disabled"
                disabled={true}
            >
                {t('profile::Terminate Cancel')}
            </button>
        );
    }

    return (
        <button
            className="member-pay--link keep-bg-on-disabled"
            disabled={true}
        >
            {t('profile::Terminate')}
        </button>
    );
};

export default OnlyViewOfferTerminate;
