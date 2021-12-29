import React from 'react';
import MyPageLayout from '@skp/components/MyPageLayout';
import CardForm from '@skp/components/CreditCard/cardForm';
import { useHistory } from '@skp/drivers';
import { useTranslation } from 'react-i18next';
import { useNotificationContext } from '@skp/layouts/context/notification';

export default function AddCreditCard() {
    const { t } = useTranslation(['navigation', 'card']);
    const history = useHistory();
    const [, { setInfo }] = useNotificationContext();

    return (
        <MyPageLayout pageTitle={t('navigation::Manage Credit Card')}>
            <CardForm
                onCardAdded={() => {
                    history.goBack();
                    setTimeout(
                        () => setInfo(t('card::Create card sucessfully.')),
                        500
                    );
                }}
                onCancel={() => history.goBack()}
                defaultChangeable={true}
            />
        </MyPageLayout>
    );
}
