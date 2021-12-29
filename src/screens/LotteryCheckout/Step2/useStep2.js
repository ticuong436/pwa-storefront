import { resourceUrl, useHistory, useLocation } from '@skp/drivers';
import { useState } from 'react';

export const useStep2 = productId => {
    const location = useLocation();
    const history = useHistory();

    const goToCheckoutStep3 = () => {
        history.push({
            pathname: resourceUrl(
                `/product/${productId}/lottery-checkout/third-step`
            ),
            state: {
                ...location.state,
                selectedCard
            }
        });
    };

    const [isShowCardFormDialog, setShowCardFormDialog] = useState(false);
    const [cardForm, setCardForm] = useState('');

    const [selectedCard, setSelectedCard] = useState(
        location.state && location.state.selectedCard
            ? location.state.selectedCard
            : null
    );

    const selectCard = async card => {
        setSelectedCard(card);
    };

    const toggleShowingDialog = () => {
        setShowCardFormDialog(false);
        setCardForm('');
    };

    return {
        goToCheckoutStep3,
        location,
        isShowCardFormDialog,
        setShowCardFormDialog,
        cardForm,
        setCardForm,
        selectedCard,
        selectCard,
        toggleShowingDialog,
        giftFee: location.state ? location.state.giftFee : null
    };
};
