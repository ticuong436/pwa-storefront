import { useEffect, useCallback } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import getAddressByPostalCodeOperations from './addressData.gql';
import debounce from 'lodash.debounce';

export const usePostCodeSearching = (regions, customer, formApiRef) => {
    const { queries } = getAddressByPostalCodeOperations;
    const { getAddress } = queries;

    const [runGetAddress] = useLazyQuery(getAddress, {
        fetchPolicy: 'no-cache',
        onCompleted: addressData => {
            if (
                addressData.getAddressByPostCode &&
                addressData.getAddressByPostCode.length
            ) {
                const stateId = regions.find(
                    element =>
                        element.default_name ===
                        addressData.getAddressByPostCode[0].state_en
                );
                formApiRef.current.setValue(
                    'registration_state',
                    stateId ? stateId.default_name : ''
                );
                formApiRef.current.setValue(
                    'registration_city',
                    addressData.getAddressByPostCode[0].city_en
                );
                formApiRef.current.setValue(
                    'registration_address1',
                    addressData.getAddressByPostCode[0].address_en
                );
            } else {
                formApiRef.current.setValue('registration_address1', '');
                formApiRef.current.setValue('registration_state', '');
                formApiRef.current.setValue('registration_city', '');
            }
        }
    });

    useEffect(() => {
        if (formApiRef && formApiRef.current) {
            formApiRef.current.setValue(
                'registration_address1',
                customer.registration_address1
            );
            formApiRef.current.setValue(
                'registration_state',
                customer.registration_state
            );
            formApiRef.current.setValue(
                'registration_city',
                customer.registration_city
            );
        }
    }, [customer, formApiRef]);

    const delayedPostCodeSearching = useCallback(
        debounce(postCode => {
            const trimPostalCode = postCode ? postCode.trim() : '';

            if (trimPostalCode === '') {
                formApiRef.current.setValue('registration_city', '');
                formApiRef.current.setValue('registration_address1', '');
                formApiRef.current.setValue('registration_state', '');
            } else {
                if (trimPostalCode.match(/^\d{7}$/)) {
                    runGetAddress({
                        variables: { post_code: trimPostalCode }
                    });
                }
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
