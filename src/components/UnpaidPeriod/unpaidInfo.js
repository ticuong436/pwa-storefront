import React from 'react';
import MainPageTitle from '@skp/components/MainPageTitle';
import { useTranslation } from 'react-i18next';

const UnpaidInfo = ({ date, amount }) => {
    const { t } = useTranslation(['navigation']);
    return (
        <div className="mypage">
            <MainPageTitle title={t('navigation::Unpaid Period')} />
            <div className="period">
                <div className="member-pay">
                    <span>「会費のお支払」</span>
                    <span>未決済期間：{date}</span>
                    <span>請求金額：USD {amount}</span>
                </div>
            </div>
        </div>
    );
};

export default UnpaidInfo;
