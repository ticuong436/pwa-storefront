import { useMutation } from '@apollo/react-hooks';
import ADD_CUSTOMER_CARD from './addCustomerCard.graphql';
import UPDATE_CUSTOMER_CARD from './updateCustomerCard.graphql';
import { useUserContext } from '@skp/layouts/context/user';

export const useCardForm = ({ card, onCardAdded }) => {
    const [
        addOrUpdateCard,
        { loading: submitting, error: submitError }
    ] = useMutation(card.id ? UPDATE_CUSTOMER_CARD : ADD_CUSTOMER_CARD);

    const [{ currentUser, isGettingDetails: isGettingUser }] = useUserContext();

    const handleSubmit = async params => {
        const input = {
            cardholder_name: params.name,
            card_exp_month: params.card_exp_month,
            card_exp_year: params.card_exp_year,
            country: params.country,
            city: params.city,
            address_street1: params.address_street1,
            address_street2: params.address_street2,
            postal_code: params.postal_code,
            state: params.state,
            stateRegionId: params.state_region_id,
            is_default: params.is_default
        };

        if (card.id) {
            input.id = card.id;
        } else {
            input.card_number = params.card_number;
            input.card_cvc = params.card_cvc;
        }

        try {
            const result = await addOrUpdateCard({
                variables: input
            });

            onCardAdded(
                result.data.addCustomerCard
                    ? result.data.addCustomerCard.id
                    : null
            );
        } catch (error) {
            console.error(error);
        }
    };

    return {
        submitting: submitting,
        submitError,
        handleSubmit,
        currentUser,
        isGettingUser
    };
};
