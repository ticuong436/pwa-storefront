import React from 'react';
import { useLocation } from 'react-router-dom';
import MyPageLayout from '@skp/components/MyPageLayout';
import CardForm from '@skp/components/CreditCard/cardForm';
import { useHistory, Redirect, resourceUrl } from '@skp/drivers';
import { useTranslation } from 'react-i18next';
import { useNotificationContext } from '@skp/layouts/context/notification';

export default function EditCreditCard() {
    const { t } = useTranslation(['navigation', 'card']);
    const location = useLocation();
    const history = useHistory();
    const card = location.state ? location.state.currentCard : '';
    const [, { setInfo }] = useNotificationContext();

    if (!card) {
        return <Redirect to={resourceUrl('/customer/stripe/cards')} />;
    }

    return (
        <MyPageLayout pageTitle={t('navigation::Manage Credit Card')}>
            <CardForm
                onCardAdded={() => {
                    history.goBack();
                    setTimeout(
                        () => setInfo(t('card::Update card sucessfully.')),
                        500
                    );
                }}
                card={card}
                onCancel={() => history.goBack()}
                defaultChangeable={true}
            />
        </MyPageLayout>
    );
}
