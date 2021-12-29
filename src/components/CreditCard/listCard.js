import React from 'react';
import Card from './card';
import { useListCard } from './useListCard';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useHistory, resourceUrl } from '@skp/drivers';
import PopupConfirm from '@skp/components/PopupConfirm';
import MainPageTitle from '@skp/components/MainPageTitle';
import AlertMessage from '@skp/components/AlertMessage';
import { useTranslation } from 'react-i18next';

function ListCard({ selectedCardId, onFetchedCards }) {
    const history = useHistory();
    const { t } = useTranslation(['card']);

    const {
        cards,
        isLoadingCards,
        handleDeleteCard,
        openConfirmation,
        closeConfirmation,
        isOpenConfirm,
        inProgress
    } = useListCard({
        onFetchedCards
    });

    if (isLoadingCards) {
        return <LoadingIndicator />;
    }

    const titlePopupConfirm = (
        <p className="modal-customize__des">
            Are you sure you want to delete your credit card information?
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
            <div className="credit-shipping">
                <MainPageTitle title="Credit card information" />
                {cards.length > 0 ? (
                    <>
                        <div className="select-address">
                            <div className="select-location">
                                <div className="row">
                                    {cards.map(card => (
                                        <Card
                                            key={card.id}
                                            card={card}
                                            isSelected={
                                                selectedCardId
                                                    ? selectedCardId === card.id
                                                    : card.is_default
                                            }
                                            onClickEdit={e => {
                                                e.preventDefault();
                                                history.push({
                                                    pathname: resourceUrl(
                                                        'mypage/credit-card/edit'
                                                    ),
                                                    state: {
                                                        currentCard: card
                                                    }
                                                });
                                            }}
                                            showEdit={true}
                                            allowDelete={!card.is_default}
                                            onClickDelete={() => {
                                                openConfirmation(card);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="credit-shipping__button">
                            <a
                                className="button button--primary"
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    history.push(
                                        resourceUrl('/mypage/credit-card/add')
                                    );
                                }}
                            >
                                Add new credit card
                            </a>
                        </div>
                    </>
                ) : (
                    <div className="credit-shipping">
                        <AlertMessage type="warning">
                            {t(
                                "card::You haven't had any saved credit cards yet."
                            )}
                        </AlertMessage>
                        <div className="credit-shipping__button">
                            <a
                                className="button button--primary"
                                href="#"
                                onClick={() =>
                                    history.push(
                                        resourceUrl('/mypage/credit-card/add')
                                    )
                                }
                            >
                                Add new credit card
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ListCard;
