import { useReducer } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { resourceUrl, useHistory, useLocation } from '@skp/drivers';
import GET_PRODUCT_BY_ID from './getProductById.graphql';
import GET_CUSTOMER_ADDRESSES from '@skp/screens/Checkout/Step1/getCustomerAddresses.graphql';
import { useGiftFee } from '@skp/screens/Checkout/useGiftFee';

export const useStep1 = ({ productId }) => {
    const { called, data, loading } = useQuery(GET_PRODUCT_BY_ID, {
        fetchPolicy: 'network-only',
        variables: { productId }
    });

    const { productByID: product } = data || {};

    const shouldShowLoadingIndicator = called && loading;

    const actionType = {
        ACTION_ADD: 'add',
        ACTION_EDIT: 'edit'
    };
    const initialShippingAddressActionPage = {
        type: null,
        currentAddress: {}
    };
    const [
        shippingAddressActionPage,
        setShippingAddressActionPage
    ] = useReducer((state, action) => {
        switch (action.type) {
            case null:
                return initialShippingAddressActionPage;
            case actionType.ACTION_ADD:
                return {
                    ...state,
                    type: action.type
                };
            case actionType.ACTION_EDIT:
                return {
                    type: action.type,
                    currentAddress: action.address
                };
        }
    }, initialShippingAddressActionPage);

    const location = useLocation();
    const state = location.state;

    // For shipping address
    const {
        data: customerAddressesResult,
        refetch,
        loading: isLoadingAddresses
    } = useQuery(GET_CUSTOMER_ADDRESSES, {
        onCompleted: data => {
            onFetchedAddresses(data ? data.customer.addresses : []);
        },
        fetchPolicy: 'network-only'
    });

    const addresses = customerAddressesResult
        ? customerAddressesResult.customer.addresses
        : [];

    const onFetchedAddresses = addresses => {
        if (addresses.length) {
            const defaultAddress =
                state && state.selectedAddress
                    ? state.selectedAddress
                    : addresses.find(address => address.default_shipping);
            selectAddress(defaultAddress);
        }
    };

    const [addressState, setAddressState] = useReducer(
        (currentState, newState) => ({ ...currentState, ...newState }),
        {
            selectedAddress: {},
            isSelectingAddress: false
        }
    );
    const { selectedAddress, isSelectingAddress } = addressState;
    const selectAddress = async address => {
        if (address.id !== selectedAddress.id) {
            setAddressState({ isSelectingAddress: true });
            setAddressState({ selectedAddress: address });
            setAddressState({ isSelectingAddress: false });
        }
    };

    const { giftFee, calculateGiftFee } = useGiftFee();

    const history = useHistory();
    const handleSubmit = values => {
        history.push({
            pathname: resourceUrl(
                `/product/${productId}/lottery-checkout/second-step`
            ),
            state: {
                ...state,
                ...values,
                product,
                giftFee,
                selectedAddress: addresses.find(
                    address => address.id == selectedAddress.id
                )
            }
        });
    };

    const removeInitialValue = (_productKey, ...fields) => {
        if (!state) {
            return;
        }

        fields.forEach(field => {
            delete state[field];
        });

        history.replace({ state: { ...state } });
    };

    return {
        product,
        shouldShowLoadingIndicator,
        shippingAddressActionPage,
        setShippingAddressActionPage,
        actionType,
        handleSubmit,
        addresses,
        refreshAddresses: refetch,
        isLoadingAddresses,
        selectAddress,
        selectedAddress,
        isSelectingAddress,
        state,
        removeInitialValue,
        giftFee,
        calculateGiftFee
    };
};
