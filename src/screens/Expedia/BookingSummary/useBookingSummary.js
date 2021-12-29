import { useState, useEffect } from 'react';
import { useHistory, resourceUrl } from '@skp/drivers';
import customerOperation from './customer.gql';
import { useQuery, useMutation } from '@apollo/react-hooks';
import GET_CUSTOMER_CONFIG_DATA from './getCustomerConfigData.graphql';
import GET_COUNTRIES from './getCountries.graphql';
import BOOKING_HOTEL from './bookHotel.graphql';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '@skp/utils/graphqlError';

export default function useBookingSummary() {
    const history = useHistory();
    const {
        room,
        roomsInput,
        hotelInfo,
        checkInDate,
        checkOutDate,
        hotelId
    } = history.location.state;

    const { queries } = customerOperation;
    const { loading: loadingCustomer, data: dataCustomer } = useQuery(
        queries.getCurrentCustomer,
        {
            fetchPolicy: 'network-only'
        }
    );
    const [, { setError }] = useNotificationContext();
    const { t } = useTranslation(['common']);

    const [isAgree, setIsAgree] = useState(false);
    const { customer = {} } = dataCustomer || {};

    const { data: dataConfig } = useQuery(GET_CUSTOMER_CONFIG_DATA);
    const { customerConfigData = {} } = dataConfig || {};
    const { contactCountryCodes = [], genders = [] } = customerConfigData || {};

    const { data: dataCountries } = useQuery(GET_COUNTRIES, {
        fetchPolicy: 'network-only'
    });

    const [bookHotel, { loading: submitting }] = useMutation(BOOKING_HOTEL);

    const { countries = [] } = dataCountries || {};

    const [regions, setRegions] = useState([]);

    const onCountryChanged = countryId => {
        const country = countries.find(country => country.id === countryId);
        if (
            country &&
            country.available_regions &&
            country.available_regions.length
        ) {
            setRegions(country.available_regions);
        } else if (regions.length) {
            setRegions([]);
            customer.registration_state = '';
        }
    };

    useEffect(() => {
        if (customer && customer.registration_country && countries) {
            onCountryChanged(customer.registration_country);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer, countries]);

    const handleSubmit = async values => {
        setIsAgree(false);
        let hotelAddress = hotelInfo.address.line_1
            ? hotelInfo.address.line_1 + ' '
            : '';

        hotelAddress += hotelInfo.address.line_2
            ? hotelInfo.address.line_2 + ' '
            : '';

        hotelAddress += hotelInfo.address.city;

        const rooms = [];

        const customerFamilyName = values.customer_family_name
            ? values.customer_family_name
            : '';
        const customerGivenName = values.customer_given_name
            ? values.customer_given_name
            : '';
        const description = values.description ? values.description : '';
        for (let i = 0; i < customerFamilyName.length; i++) {
            rooms.push({
                family_name: customerFamilyName[i],
                given_name: customerGivenName[i],
                special_request:
                    description && description[i] ? description[i] : ''
            });
        }

        const cardAddress = values.address.split(' ');

        const input = {
            email: values.email,
            hotel_address: hotelAddress,
            hotel_country_code: hotelInfo.address.country_code,
            hotel_id: hotelId,
            hotel_name: hotelInfo.name,
            card_brand: values.card_brand,
            card_expiration_month: values.card_exp_month,
            card_expiration_year: values.card_exp_year,
            card_number: values.card_number,
            card_security_code: values.card_cvc,
            country_code: values.registration_country_number,
            phone_number: values.registration_phone_number,
            rate_id: room.rate_id,
            rate_token_id: room.rate_token_id,
            room_id: room.room_id,
            room_image: hotelInfo.thumbnail,
            room_type: room.bed_group_description,
            card_family_name: values.card_family_name,
            card_given_name: values.card_given_name,
            address_country_code: values.registration_country,
            address_city: cardAddress[0] ? cardAddress[0] : '',
            address_line_1: cardAddress[1] ? cardAddress[1] : '',
            address_line_2: cardAddress[2] ? cardAddress[2] : '',
            rooms: rooms,
            rooms_input: roomsInput
        };

        try {
            const { data } = await bookHotel({
                variables: input
            });

            if (data.bookHotel.booking_id) {
                history.push({
                    pathname: resourceUrl(
                        `hotel/booking-confirmation/${
                            data.bookHotel.booking_id
                        }`
                    ),
                    state: {
                        bookingId: data.bookHotel.booking_id
                    }
                });
            } else {
                setIsAgree(true);
                setError(t('common::Something went wrong!'));
            }
        } catch (error) {
            setIsAgree(true);
            setError(getErrorMessage(error.message));

            if (process.env.NODE_ENV === 'development') {
                console.log(error);
            }
        }
    };

    return {
        customer,
        loadingCustomer,
        genders,
        isAgree,
        setIsAgree,
        countries,
        regions,
        onCountryChanged,
        contactCountryCodes,
        handleSubmit,
        room,
        roomsInput,
        hotelInfo,
        checkInDate,
        checkOutDate,
        submitting,
        hotelId
    };
}
