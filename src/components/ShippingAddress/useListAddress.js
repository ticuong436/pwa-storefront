import { useReducer } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import GET_CUSTOMER_ADDRESSES from './getCustomerAddresses.graphql';
import DELETE_CUSTOMER_ADDRESS from './deleteCustomerAddress.graphql';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { useTranslation } from 'react-i18next';

export const useListAddress = () => {
    const [, { setInfo, setError }] = useNotificationContext();
    const { t } = useTranslation(['shipping_address']);

    const { data: customerAddressesResult, refetch, loading } = useQuery(
        GET_CUSTOMER_ADDRESSES,
        {
            fetchPolicy: 'network-only'
        }
    );

    const [deleteCustomerAddress] = useMutation(DELETE_CUSTOMER_ADDRESS);

    const initialState = {
        address: {},
        isOpenConfirm: false,
        inProgress: false
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case 'show_confirm':
                return {
                    ...initialState,
                    isOpenConfirm: true,
                    address: action.address
                };
            case 'close_confirm':
                return {
                    ...initialState,
                    isOpenConfirm: false
                };
            case 'delete_address_success':
                return {
                    ...initialState,
                    isOpenConfirm: false,
                    inProgress: false
                };
            case 'delete_address_error':
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

    const { isOpenConfirm, inProgress, address } = state;

    const handleDeleteAddress = async () => {
        dispatch({ type: 'inprogress' });

        try {
            await deleteCustomerAddress({
                variables: {
                    id: address.id
                }
            });

            refetch();

            dispatch({
                type: 'delete_address_success'
            });
            setInfo(
                t('shipping_address::Delete shipping address Sucessfully.')
            );
        } catch (err) {
            dispatch({
                type: 'delete_address_error'
            });

            setError(
                t(
                    'shipping_address::Something went wrong! Delete shipping address failed.'
                )
            );

            if (process.env.NODE_ENV === 'development') {
                console.error(err);
            }
        }
    };

    return {
        addresses: customerAddressesResult
            ? customerAddressesResult.customer.addresses
            : [],
        refreshAddresses: refetch,
        isLoadingAddresses: loading,
        isOpenConfirm,
        inProgress,
        closeConfirmation: () => dispatch({ type: 'close_confirm' }),
        openConfirmation: address =>
            dispatch({ type: 'show_confirm', address }),
        handleDeleteAddress
    };
};
