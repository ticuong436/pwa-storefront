import { useState, useEffect, useCallback } from 'react';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import getAddressByPostalCodeOperations from './addressData.gql';
import GET_COUNTRIES from './getCountries.graphql';
import debounce from 'lodash.debounce';

export const usePostCodeSearching = (card, formApiRef) => {
    const { data = {} } = useQuery(GET_COUNTRIES, {
        fetchPolicy: 'network-only'
    });
    const { countries = [] } = data;
    const [regions, setRegions] = useState([]);
    const [countryId, setCountryId] = useState('');
    const { queries } = getAddressByPostalCodeOperations;
    const { getAddress } = queries;

    const [runGetAddress] = useLazyQuery(getAddress, {
        fetchPolicy: 'no-cache',
        onCompleted: addressData => {
            if (
                countryId === 'JP' &&
                addressData.getAddressByPostCode &&
                addressData.getAddressByPostCode.length
            ) {
                const stateId = regions.find(
                    element =>
                        element.default_name ===
                        addressData.getAddressByPostCode[0].state_en
                );

                formApiRef.current.setValue(
                    'city',
                    addressData.getAddressByPostCode[0].city_en
                );
                formApiRef.current.setValue(
                    'state_region_id',
                    stateId ? stateId.id : ''
                );
                formApiRef.current.setValue(
                    'address_street1',
                    addressData.getAddressByPostCode[0].address_en
                );
            } else {
                formApiRef.current.setValue('city', '');
                formApiRef.current.setValue('state', '');
                formApiRef.current.setValue('state_region_id', '');
                formApiRef.current.setValue('address_street1', '');
            }
        }
    });

    const delayedPostCodeSearching = useCallback(
        debounce(postCode => {
            const trimPostalCode = postCode ? postCode.trim() : '';

            if (trimPostalCode.match(/^\d{7}$/)) {
                runGetAddress({
                    variables: { post_code: trimPostalCode }
                });
            }
        }, 400),
        []
    );

    const onPostalCodeChanged = postCode => {
        delayedPostCodeSearching(postCode);
    };

    const onCountryChanged = countryId => {
        if (!countries.length) {
            return;
        }

        const country = countries.find(country => country.id === countryId);

        setCountryId(countryId);

        if (country.available_regions && country.available_regions.length) {
            setRegions(country.available_regions);
        } else {
            setRegions([]);
        }
    };

    useEffect(() => {
        if (card.country && countries) {
            onCountryChanged(card.country);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [card.country, countries]);

    useEffect(() => {
        const regionTokyo = regions.filter(region => region.code === 'Tokyo');

        if (formApiRef && formApiRef.current) {
            formApiRef.current.setValue(
                'state_region_id',
                card.state_region_id
                    ? card.state_region_id
                    : regionTokyo[0]
                    ? regionTokyo[0].id
                    : null
            );
        }
    }, [card.state_region_id, formApiRef, regions]);

    return {
        countries,
        regions,
        onCountryChanged,
        onPostalCodeChanged
    };
};
