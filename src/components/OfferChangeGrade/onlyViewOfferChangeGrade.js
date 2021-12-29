import React from 'react';
import { DOWNGRADE } from '@skp/utils/changeType';
import { useTranslation } from 'react-i18next';

const OnlyViewOfferChangeGrade = props => {
    const { userGroup, changeType } = props;
    const { t } = useTranslation(['profile']);

    const getTextBtn = (userGroup, changeType) => {
        if (changeType === DOWNGRADE) {
            return t('profile::Downgrade Cancel');
        }
        if (userGroup === 'GOLD') {
            return t('profile::Upgrade');
        }

        return t('profile::Downgrade');
    };

    const textBtn = getTextBtn(userGroup, changeType);

    return (
        <button
            className="member-pay--link keep-bg-on-disabled"
            disabled={true}
        >
            {textBtn}
        </button>
    );
};

export default OnlyViewOfferChangeGrade;
