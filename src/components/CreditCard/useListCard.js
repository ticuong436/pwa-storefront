import { useReducer } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import GET_CUSTOMER_CARDS from './getCustomerCards.graphql';
import DELETE_CUSTOMER_CARDS from './deleteCustomerCard.graphql';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { useTranslation } from 'react-i18next';

export const useListCard = ({ onFetchedCards }) => {
    const { t } = useTranslation(['card']);

    let queryOption = {};
    if (onFetchedCards) {
        queryOption = {
            onCompleted: data => onFetchedCards(data.cards || []),
            notifyOnNetworkStatusChange: true
        };
    }
    const { data: customerCardsResult = {}, refetch, loading } = useQuery(
        GET_CUSTOMER_CARDS,
        {
            fetchPolicy: 'no-cache',
            ...queryOption
        }
    );

    const [, { setInfo, setError }] = useNotificationContext();

    const [deleteCustomerCard, { loading: isDeletingCard }] = useMutation(
        DELETE_CUSTOMER_CARDS
    );

    const initialState = {
        card: {},
        isOpenConfirm: false,
        inProgress: false
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case 'show_confirm':
                return {
                    ...initialState,
                    isOpenConfirm: true,
                    card: action.card
                };
            case 'close_confirm':
                return {
                    ...initialState,
                    isOpenConfirm: false
                };
            case 'delete_card_success':
                return {
                    ...initialState,
                    isOpenConfirm: false,
                    inProgress: false
                };
            case 'delete_card_error':
                return {
                    ...initialState,
                    isOpenConfirm: true,
                    inProgress: false
                };
            case 'inprogress':
                return {
                    ...initialState,
                    isOpenConfirm: true,
                    inProgress: true
                };
            default:
                throw new Error();
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const { isOpenConfirm, inProgress, card } = state;

    const handleDeleteCard = async () => {
        dispatch({ type: 'inprogress' });

        if (!card.is_default) {
            try {
                const { data } = await deleteCustomerCard({
                    variables: { id: card.id }
                });

                if (data.isSuccess) {
                    dispatch({
                        type: 'delete_card_success'
                    });
                    await refetch();
                    setInfo(t('card::Delete card successfully.'));
                } else {
                    dispatch({
                        type: 'delete_card_error'
                    });
                    setError(
                        t('card::Something went wrong! Delete card failed.')
                    );
                }
            } catch (error) {
                dispatch({
                    type: 'delete_card_error'
                });
                setError(t('card::Something went wrong! Delete card failed.'));

                if (process.env.NODE_ENV === 'development') {
                    console.error(error);
                }
            }
        }
    };

    return {
        cards: customerCardsResult.cards || [],
        refreshCards: refetch,
        isLoadingCards: loading,
        handleDeleteCard,
        isDeletingCard,
        closeConfirmation: () => dispatch({ type: 'close_confirm' }),
        openConfirmation: card => dispatch({ type: 'show_confirm', card }),
        isOpenConfirm,
        inProgress
    };
};
