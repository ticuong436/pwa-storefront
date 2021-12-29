import { useQuery, useMutation } from '@apollo/react-hooks';
import customerOperation from './customer.gql';
import GET_CUSTOMER_CONFIG_DATA from './getCustomerConfigData.graphql';
import GET_COUNTRIES from './getCountries.graphql';
import { useState, useEffect } from 'react';
import Moment from 'moment';
import { useTermLinks } from '@skp/hooks/useTermLinks';
import { useNotificationContext } from '@skp/layouts/context/notification';

export default function useRegisterPlatinumPartner() {
    const { data: dataConfig } = useQuery(GET_CUSTOMER_CONFIG_DATA);
    const { customerConfigData = {} } = dataConfig || {};
    const {
        genders = [],
        contactCountryCodes = [],
        nationalities = [],
        occupations = []
    } = customerConfigData || {};

    const { queries, mutations } = customerOperation;
    const { data: dataCustomer } = useQuery(queries.getCurrentCustomer, {
        fetchPolicy: 'network-only'
    });

    const { customer = {} } = dataCustomer || {};
    const [
        createCustomer,
        {
            loading: isCreatingCustomer,
            error: createCustomerError,
            data: createCustomerResponse
        }
    ] = useMutation(mutations.createPlatinumPartnerCustomer);

    const [, { reset: resetNotificationMessage }] = useNotificationContext();

    const handleSubmit = async formParams => {
        resetNotificationMessage();
        delete formParams.passwordConfirm;

        formParams.dob = Moment(formParams.dob).format('YYYY/MM/DD');

        await createCustomer({
            variables: { inputCreatePlatinumCustomer: formParams }
        });
    };

    const { data: dataCountries } = useQuery(GET_COUNTRIES);
    const { countries = [] } = dataCountries || {};

    const { term, policy, points, members } = useTermLinks();

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
        }
    };

    useEffect(() => {
        if (countries) {
            onCountryChanged('JP');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countries]);

    const now = new Date();
    const nextPaymentDate = new Date(
        now.setMonth(
            now.getMonth() + parseInt(customer.subscription_payment_cycle)
        )
    );
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    const nextPaymentDateFormat = `${nextPaymentDate.getDate()} ${
        monthNames[nextPaymentDate.getMonth()]
    } ${nextPaymentDate.getFullYear()}`;

    return {
        genders,
        contactCountryCodes,
        nationalities,
        occupations,
        handleSubmit,
        isCreatingCustomer,
        createCustomerError,
        createCustomerResponse,
        customer,
        countries,
        onCountryChanged,
        regions,
        nextPaymentDateFormat,
        skyMemberShipPage: members,
        termOfUsePage: term,
        privacyPolicyPage: policy,
        skyPointsRegulationPage: points
    };
}
