import React, { useState } from 'react';
import Card from './card';
import CardForm from '@skp/components/CreditCard/cardForm';
import Popup from '@skp/components/Popup';
import { useListCard } from '@skp/components/CreditCard/useListCard';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useTranslation } from 'react-i18next';
import AlertMessage from '@skp/components/AlertMessage';
import { useNotificationContext } from '@skp/layouts/context/notification';
import PopupConfirm from '@skp/components/PopupConfirm';
import MainPageTitle from '@skp/components/MainPageTitle';

export default function ListCard({
    onClick,
    selectedCardId,
    onFetchedCards,
    allowDelete = true
}) {
    const { t } = useTranslation(['checkout', 'card']);
    const [, { setInfo, reset }] = useNotificationContext();

    const [isShowDialog, setShowDialog] = useState(false);
    const [cardForm, setCardForm] = useState('');
    const {
        cards,
        refreshCards,
        isLoadingCards,
        isOpenConfirm,
        inProgress,
        closeConfirmation,
        openConfirmation,
        handleDeleteCard
    } = useListCard({
        onFetchedCards
    });

    const handleClickOnCard = card => () => {
        onClick && onClick(card);
    };
    const toggleShowingDialog = () => {
        setShowDialog(false);
        setCardForm('');
    };

    if (isLoadingCards) {
        return <LoadingIndicator />;
    }

    const titlePopupConfirm = (
        <p className="modal-customize__des">
            クレジットカード情報を削除してよろしいですか？
        </p>
    );

    return (
        <>
            <PopupConfirm
                title={titlePopupConfirm}
                onCancel={() => {
                    closeConfirmation();
                }}
                onConfirm={() => {
                    handleDeleteCard();
                }}
                isLoading={inProgress}
                isOpen={isOpenConfirm}
            />
            <Popup isOpen={isShowDialog}>{cardForm}</Popup>
            <div className="select-address">
                <div className="">
                    <MainPageTitle
                        title={t('checkout::Select Your Credit Card')}
                    >
                        <a
                            className="main-content__action"
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                setShowDialog(true);
                                setCardForm(
                                    <CardForm
                                        onCardAdded={() => {
                                            refreshCards();
                                            toggleShowingDialog();
                                            reset();
                                            setInfo(
                                                t(
                                                    'card::Create card sucessfully.'
                                                )
                                            );
                                        }}
                                        onCancel={toggleShowingDialog}
                                        defaultChangeable={true}
                                        formInMyPage={false}
                                    />
                                );
                            }}
                        >
                            {t('checkout::Add new credit card')}
                        </a>
                    </MainPageTitle>
                </div>
                <div className="select-location">
                    <div className="row">
                        {cards.length > 0 ? (
                            cards.map(card => (
                                <Card
                                    key={card.id}
                                    card={card}
                                    isSelected={selectedCardId === card.id}
                                    onSelect={handleClickOnCard(card)}
                                    onClickEdit={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowDialog(true);
                                        setCardForm(
                                            <CardForm
                                                onCardAdded={() => {
                                                    refreshCards();
                                                    toggleShowingDialog();
                                                    reset();
                                                    setInfo(
                                                        t(
                                                            'card::Update card sucessfully.'
                                                        )
                                                    );
                                                }}
                                                onCancel={toggleShowingDialog}
                                                card={card}
                                                defaultChangeable={true}
                                                formInMyPage={false}
                                            />
                                        );
                                    }}
                                    onClickDelete={() => {
                                        openConfirmation(card);
                                    }}
                                    showEdit={true}
                                    allowDelete={
                                        allowDelete && !card.is_default
                                    }
                                />
                            ))
                        ) : (
                            <div className="col-md-12">
                                <AlertMessage type="warning">
                                    {t(
                                        "card::You haven't had any saved credit cards yet."
                                    )}
                                </AlertMessage>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
