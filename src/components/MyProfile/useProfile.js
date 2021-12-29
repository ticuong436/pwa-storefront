import customerOperation from './profile.gql';
import GET_COUNTRIES from './getCountries.graphql';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useEffect, useState } from 'react';
import GET_CUSTOMER_CONFIG_DATA from './getCustomerConfigData.graphql';
import {
    getNewOfferTerminateCanUpdate,
    getNewChangeTypeCanUpdate
} from '@skp/utils/changeType';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { useUserContextQuery } from '@skp/layouts/context/user/context';
import Moment from 'moment';
import { useTranslation } from 'react-i18next';

export default function useProfile() {
    const { t } = useTranslation(['mypage']);

    // State for upgrade/downgrade/teminate change type
    const [isChangingType, setIsChangingType] = useState(false);
    const [newOfferGradeCanUpdate, setNewOfferGradeCanUpdate] = useState('');
    const [
        newOfferTerminateCanUpdate,
        setNewOfferTerminateCanUpdate
    ] = useState('');
    const [changeType, setChangeType] = useState('');
    const [userGroup, setUserGroup] = useState('');

    const { queries, mutations } = customerOperation;
    const {
        loading: loadingCustomer,
        data: dataCustomer,
        error: errorLoadingCustomer,
        refetch: reloadCustomer
    } = useQuery(queries.getCurrentCustomer, {
        fetchPolicy: 'network-only'
    });

    const { customer = {} } = dataCustomer || {};

    const { data: dataCountries } = useQuery(GET_COUNTRIES, {
        fetchPolicy: 'network-only'
    });
    const { countries = [] } = dataCountries || {};

    const [
        updateCustomer,
        {
            loading: isUpdatingCustomer,
            error: updateCustomerError,
            data: updateCustomerResponse
        }
    ] = useMutation(mutations.updateCustomer);

    const { userContextFetchDetails } = useUserContextQuery();

    const [, { setInfo, setError }] = useNotificationContext();

    const handleSubmit = async formParams => {
        formParams.dob = Moment(formParams.dob).format('YYYY-MM-DD');

        await updateCustomer({
            variables: { inputUpdateCustomer: formParams }
        });
        reloadCustomer();
        userContextFetchDetails();
        setInfo(t('mypage::Update account information success'));
    };

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

        setNewOfferGradeCanUpdate(getNewChangeTypeCanUpdate(customer));
        setNewOfferTerminateCanUpdate(getNewOfferTerminateCanUpdate(customer));
        setChangeType(customer.change_type);
        setUserGroup(customer.group);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer, countries]);

    const { data: dataConfig } = useQuery(GET_CUSTOMER_CONFIG_DATA);
    const { customerConfigData = {} } = dataConfig || {};
    const {
        contactCountryCodes = [],
        nationalities = [],
        occupations = [],
        genders = []
    } = customerConfigData || {};

    useEffect(() => {
        if (customer.profile_alert_flag && customer.profile_alert_message) {
            setError(customer.profile_alert_message);
        } else {
            setError('');
        }
    }, [customer, setError]);

    return {
        customer,
        countries,
        isUpdatingCustomer,
        updateCustomerError,
        updateCustomerResponse,
        newOfferGradeCanUpdate,
        newOfferTerminateCanUpdate,
        changeType,
        userGroup,
        loadingCustomer,
        regions,
        contactCountryCodes,
        nationalities,
        occupations,
        isChangingType,
        onCountryChanged,
        handleSubmit,
        setIsChangingType,
        setChangeType,
        setNewOfferGradeCanUpdate,
        setNewOfferTerminateCanUpdate,
        setUserGroup,
        reloadCustomer,
        errorLoadingCustomer,
        genders
    };
}
