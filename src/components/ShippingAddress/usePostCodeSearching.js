import { useCallback } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import getAddressByPostalCodeOperations from './addressData.gql';
import debounce from 'lodash.debounce';

export const usePostCodeSearching = (regionsJp, formApiRef) => {
    const { queries } = getAddressByPostalCodeOperations;
    const { getAddress } = queries;

    const [runGetAddressShipping] = useLazyQuery(getAddress, {
        fetchPolicy: 'no-cache',
        onCompleted: addressData => {
            if (
                addressData.getAddressByPostCode &&
                addressData.getAddressByPostCode.length
            ) {
                const shippingStateId = regionsJp.find(
                    element =>
                        element.default_name ===
                        addressData.getAddressByPostCode[0].state_en
                );
                formApiRef.current.setValue(
                    'city',
                    addressData.getAddressByPostCode[0].city_jp
                );
                formApiRef.current.setValue(
                    'state',
                    shippingStateId ? shippingStateId.id : ''
                );
                formApiRef.current.setValue(
                    'address_street1',
                    addressData.getAddressByPostCode[0].address_jp
                );
            } else {
                formApiRef.current.setValue('city', '');
                formApiRef.current.setValue('state', '');
                formApiRef.current.setValue('address_street1', '');
            }
        }
    });

    const delayedPostCodeSearching = useCallback(
        debounce(postCode => {
            const trimPostalCode = postCode ? postCode.trim() : '';

            if (trimPostalCode.match(/^\d{7}$/)) {
                runGetAddressShipping({
                    variables: { post_code: trimPostalCode }
                });
            }
        }, 400),
        []
    );

    const onPostalCodeChanged = postCode => {
        delayedPostCodeSearching(postCode);
    };

    return {
        onPostalCodeChanged
    };
};
