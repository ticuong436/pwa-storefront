import { useCallback, useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import getAddressByPostalCodeOperations from './addressData.gql';
import debounce from 'lodash.debounce';

export const usePostCodeSearching = (getStatesOfCountry, formApiRef) => {
    const [registerRegions, setRegisterRegions] = useState([]);
    const shippingRegions = getStatesOfCountry('JP');
    const [registerCountryId, setRegisterCountryId] = useState('JP');

    const { queries } = getAddressByPostalCodeOperations;
    const { getAddress } = queries;

    const onCountryRegisterChanged = countryId => {
        setRegisterCountryId(countryId);
        setRegisterRegions(getStatesOfCountry(countryId));

        if (countryId !== 'JP') {
            formApiRef.current.setValue('registration_address1', '');
            formApiRef.current.setValue('registration_city', '');
            formApiRef.current.setValue('registration_state', '');
        }
    };

    // Fetch the data using apollo react hooks
    const [runGetAddressRegister] = useLazyQuery(getAddress, {
        fetchPolicy: 'no-cache',
        onCompleted: addressData => {
            if (
                registerCountryId === 'JP' &&
                addressData.getAddressByPostCode &&
                addressData.getAddressByPostCode.length
            ) {
                formApiRef.current.setValue(
                    'registration_city',
                    addressData.getAddressByPostCode[0].city_en
                );
                formApiRef.current.setValue(
                    'registration_address1',
                    addressData.getAddressByPostCode[0].address_en
                );
                formApiRef.current.setValue(
                    'registration_state',
                    addressData.getAddressByPostCode[0].state_en
                );
            } else {
                formApiRef.current.setValue('registration_address1', '');
                formApiRef.current.setValue('registration_city', '');
                formApiRef.current.setValue('registration_state', '');
            }
        }
    });

    const [runGetAddressShipping] = useLazyQuery(getAddress, {
        fetchPolicy: 'no-cache',
        onCompleted: addressData => {
            if (
                addressData.getAddressByPostCode &&
                addressData.getAddressByPostCode.length
            ) {
                const shippingStateId = shippingRegions.find(
                    element =>
                        element.default_name ===
                        addressData.getAddressByPostCode[0].state_en
                );

                formApiRef.current.setValue(
                    'shipping_address_state',
                    shippingStateId ? shippingStateId.id : ''
                );
                formApiRef.current.setValue(
                    'shipping_address_city',
                    addressData.getAddressByPostCode[0].city_jp
                );
                formApiRef.current.setValue(
                    'shipping_address1',
                    addressData.getAddressByPostCode[0].address_jp
                );
            } else {
                formApiRef.current.setValue('shipping_address_state', '');
                formApiRef.current.setValue('shipping_address_city', '');
                formApiRef.current.setValue('shipping_address1', '');
            }
        }
    });

    const delayedPostCodeSearching = useCallback(
        debounce(postCode => {
            const trimPostalCode = postCode ? postCode.trim() : '';

            if (registerCountryId === 'JP' && trimPostalCode.match(/^\d{7}$/)) {
                formApiRef.current.setValue(
                    'shipping_address_postal_code',
                    trimPostalCode
                );
                runGetAddressRegister({
                    variables: { post_code: trimPostalCode }
                });

                runGetAddressShipping({
                    variables: { post_code: trimPostalCode }
                });
            } else {
                formApiRef.current.setValue('registration_address1', '');
                formApiRef.current.setValue('registration_state', '');
                formApiRef.current.setValue('registration_city', '');
            }
        }, 400),
        []
    );

    const onPostalCodeChangedRegisterAddress = postCode => {
        delayedPostCodeSearching(postCode);
    };

    const onPostalCodeChangedShippingAddress = postCode => {
        const trimPostalCode = postCode ? postCode.trim() : '';

        if (trimPostalCode.match(/^\d{7}$/)) {
            runGetAddressShipping({
                variables: { post_code: trimPostalCode }
            });
        } else {
            formApiRef.current.setValue('shipping_address_state', '');
            formApiRef.current.setValue('shipping_address_city', '');
            formApiRef.current.setValue('shipping_address1', '');
        }
    };

    const onChangedPhoneNumberShipping = phoneNumber => {
        const trimPhoneNumber = phoneNumber ? phoneNumber.trim() : '';

        if (trimPhoneNumber.match(/^[0-9]*$/) && trimPhoneNumber.length <= 12) {
            formApiRef.current.setValue(
                'shipping_address_phone_number',
                trimPhoneNumber
            );
        }
    };

    useEffect(() => {
        const regions = getStatesOfCountry(registerCountryId);

        if (regions && regions.length) {
            setRegisterRegions(regions);
        }
    }, [getStatesOfCountry, registerCountryId]);

    return {
        onCountryRegisterChanged,
        onPostalCodeChangedRegisterAddress,
        onChangedPhoneNumberShipping,
        formApiRef,
        registerRegions,
        onPostalCodeChangedShippingAddress,
        shippingRegions
    };
};
