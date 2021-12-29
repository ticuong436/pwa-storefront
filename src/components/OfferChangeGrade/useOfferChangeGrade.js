import { useReducer } from 'react';
import { useMutation } from '@apollo/react-hooks';
import {
    getNewChangeTypeCanUpdate,
    UPGRADE,
    DOWNGRADE
} from '@skp/utils/changeType';
import { useTranslation } from 'react-i18next';
import { useNotificationContext } from '@skp/layouts/context/notification';

export const useOfferChangeGrade = props => {
    const { t } = useTranslation(['profile', 'common']);
    const [, { setInfo, setError }] = useNotificationContext();

    const {
        offerChangeGradeOperations: { mutations },
        newOfferGradeCanUpdate,
        changeType,
        setIsChangingType,
        setChangeType,
        setNewOfferGradeCanUpdate,
        reloadCustomer,
        setTriggerRecollectTotals
    } = props;

    const initialState = {
        newOfferGradeCanUpdate: newOfferGradeCanUpdate,
        changeType: changeType,
        isOpenConfirm: false,
        inProgress: false
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case 'change_offer_grade_success':
                return {
                    ...initialState,
                    newOfferGradeCanUpdate: action.newOfferGradeCanUpdate,
                    isOpenConfirm: false,
                    inProgress: false
                };
            case 'change_offer_grade_error':
                return {
                    ...initialState,
                    newOfferGradeCanUpdate: action.newOfferGradeCanUpdate,
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

    const handleChangeOfferGrade = async type => {
        dispatch({ type: 'inprogress' });
        setIsChangingType(true);

        try {
            await updateCustomerOfferType({
                variables: {
                    type: type
                }
            });

            const customer = await reloadCustomer();

            if (setTriggerRecollectTotals) {
                setTriggerRecollectTotals(true);
                setInfo(t('profile::Upgrade To Platinum Successfully.'));
                return;
            }

            setIsChangingType(false);
            setChangeType(customer.data.customer.change_type);
            setNewOfferGradeCanUpdate(
                getNewChangeTypeCanUpdate(customer.data.customer)
            );

            dispatch({
                type: 'change_offer_grade_success',
                newOfferGradeCanUpdate: type
            });
            setInfo(
                `${
                    type === DOWNGRADE
                        ? t('profile::Downgrade successfully.')
                        : type === UPGRADE
                        ? t('profile::Upgrade successfully.')
                        : t('profile::Downgrade cancel.')
                }`
            );
        } catch (err) {
            setIsChangingType(false);
            dispatch({
                type: 'change_offer_grade_error',
                newOfferGradeCanUpdate: type
            });
            setError(t('common::Something went wrong!'));
            if (process.env.NODE_ENV === 'development') {
                console.error(err);
            }
        }
    };

    return {
        inProgress,
        newOfferGradeCanUpdate,
        isOpenConfirm,
        changeType,
        handleChangeOfferGrade,
        dispatch
    };
};
