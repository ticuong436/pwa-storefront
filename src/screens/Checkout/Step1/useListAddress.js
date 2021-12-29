import { useQuery, useMutation } from '@apollo/react-hooks';
import GET_CUSTOMER_ADDRESSES from './getCustomerAddresses.graphql';
import SET_SHIPPING_METHOD from './setShippingMethod.graphql';
import SET_CART_SHIPPING_ADDRESS from './setCartShippingAddress.graphql';
import { useReducer } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useListAddress = ({ state, setForceRender }) => {
    const [{ cartId }] = useCartContext();

    const { data: customerAddressesResult, refetch, loading } = useQuery(
        GET_CUSTOMER_ADDRESSES,
        {
            onCompleted: data => {
                onFetchedAddresses(data ? data.customer.addresses : []);
            },
            // TODO: set apollo default fetchPolicy to no-cache or network-only. Only cache public data?
            fetchPolicy: 'no-cache',
            skip: !cartId
        }
    );

    const onFetchedAddresses = addresses => {
        if (addresses.length) {
            const defaultAddress =
                state && state.selectedAddress
                    ? state.selectedAddress
                    : addresses.find(address => address.default_shipping);
            selectAddress(defaultAddress);
        }
    };

    const [setShippingAddress] = useMutation(SET_CART_SHIPPING_ADDRESS);
    const [setShippingMethod] = useMutation(SET_SHIPPING_METHOD);

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

            try {
                const data = await setShippingAddress({
                    variables: { cartId, addressId: address.id }
                });

                await setShippingMethod({
                    variables: {
                        cartId,
                        carrierCode:
                            data.data.setShippingAddressesOnCart.cart
                                .shipping_addresses[0]
                                .available_shipping_methods[0].carrier_code,
                        methodCode:
                            data.data.setShippingAddressesOnCart.cart
                                .shipping_addresses[0]
                                .available_shipping_methods[0].method_code
                    }
                });

                setAddressState({ selectedAddress: address });
                setForceRender(true);
            } catch (e) {
                console.log(e);
            } finally {
                setAddressState({ isSelectingAddress: false });
            }
        }
    };

    return {
        addresses: customerAddressesResult
            ? customerAddressesResult.customer.addresses
            : [],
        refreshAddresses: refetch,
        isLoadingAddresses: loading,
        selectAddress,
        selectedAddress,
        isSelectingAddress
    };
};
