import { useReducer } from 'react';
import { useMutation } from '@apollo/react-hooks';
import {
    getNewOfferTerminateCanUpdate,
    TERMINATE
} from '@skp/utils/changeType';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { useTranslation } from 'react-i18next';

export const useOfferTerminate = props => {
    const [, { setInfo, setError }] = useNotificationContext();
    const { t } = useTranslation(['profile', 'common']);

    const {
        offerChangeGradeOperations: { mutations },
        newOfferTerminateCanUpdate,
        changeType,
        setIsChangingType,
        setChangeType,
        setNewOfferTerminateCanUpdate,
        reloadCustomer
    } = props;

    const initialState = {
        newOfferTerminateCanUpdate: newOfferTerminateCanUpdate,
        isOpenConfirm: false,
        inProgress: false,
        changeType: changeType
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case 'terminate_offer_success':
                return {
                    ...initialState,
                    newOfferTerminateCanUpdate:
                        action.newOfferTerminateCanUpdate,
                    isOpenConfirm: false,
                    inProgress: false
                };
            case 'terminate_offer_error':
                return {
                    ...initialState,
                    newOfferTerminateCanUpdate:
                        action.newOfferTerminateCanUpdate,
                    isOpenConfirm: true,
                    inProgress: false
                };
            case 'show_confirm':
                return {
                    ...initialState,
                    isOpenConfirm: true
                };
            case 'close_confirm':
                return {
                    ...initialState,
                    isOpenConfirm: false
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

    const [updateCustomerOfferType] = useMutation(
        mutations.changeGradeMutation
    );

    const { isOpenConfirm, inProgress } = state;

    const handleTerminateOffer = async type => {
        dispatch({ type: 'inprogress' });
        setIsChangingType(true);

        try {
            await updateCustomerOfferType({
                variables: {
                    type: type
                }
            });

            const customer = await reloadCustomer();

            setIsChangingType(false);
            setChangeType(customer.data.customer.change_type);
            setNewOfferTerminateCanUpdate(
                getNewOfferTerminateCanUpdate(customer.data.customer)
            );
            dispatch({
                type: 'terminate_offer_success',
                newOfferTerminateCanUpdate: type
            });

            setInfo(
                `${
                    type === TERMINATE
                        ? t('profile::Change terminate the offer successfully.')
                        : t('profile::Change terminate cancel.')
                }`
            );
        } catch (err) {
            setIsChangingType(false);
            dispatch({
                type: 'terminate_offer_error',
                newOfferTerminateCanUpdate: type
            });
            setError(t('common::Something went wrong!'));

            if (process.env.NODE_ENV === 'development') {
                console.error(err);
            }
        }
    };

    return {
        inProgress,
        isOpenConfirm,
        newOfferTerminateCanUpdate,
        changeType,
        handleTerminateOffer,
        dispatch
    };
};
