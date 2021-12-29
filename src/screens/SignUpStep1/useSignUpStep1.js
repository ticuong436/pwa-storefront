import { useQuery, useMutation } from '@apollo/react-hooks';
import { useState, useCallback } from 'react';
import GET_COUNTRIES from '@skp/components/MyProfile/getCountries.graphql';
import GET_CUSTOMER_CONFIG_DATA from './getCustomerConfigData.graphql';
import { resourceUrl, useHistory, useLocation } from '@skp/drivers';
import { useSignInApi } from '@skp/hooks/signIn/useSignInApi';
import Moment from 'moment';

export const useSignUpStep1 = props => {
    // Props and context variables
    const history = useHistory();
    const location = useLocation();
    const {
        createAccountOperations: { mutations }
    } = props;
    const [createAccountMutation] = useMutation(
        mutations.createAccountMutation
    );
    const { signIn } = useSignInApi();

    const [inProgress, setInprogress] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    let isRedirectFromStep0 = true;
    const dataStep0 = location.state ? location.state.data : {};
    const { email, firstName, lastName } = dataStep0;

    if (location.state === undefined || !email) {
        isRedirectFromStep0 = false;
    }

    const { data } = useQuery(GET_CUSTOMER_CONFIG_DATA);
    const customerConfigData = data ? data.customerConfigData : {};
    const {
        genders = [],
        contact_country_codes = [],
        nationalities = [],
        occupations = []
    } = customerConfigData || {};

    const { data: dataCountries, loading: loadingCountries } = useQuery(
        GET_COUNTRIES
    );
    const { countries = [] } = dataCountries || {};

    const getStatesOfCountry = useCallback(
        countryId => {
            const country = countries.find(country => country.id === countryId);
            if (
                country &&
                country.available_regions &&
                country.available_regions.length
            ) {
                return country.available_regions;
            }

            return [];
        },
        [countries]
    );

    const handleRegisterCustomer = async formParams => {
        const dobFormatForStep2 = Moment(formParams.dob).format('YYYY/MM/DD');

        formParams.dob = dobFormatForStep2;

        setInprogress(true);

        try {
            delete formParams.passwordConfirm;

            formParams.email = dataStep0.email;
            formParams.invite_code = dataStep0.invite_code;

            await createAccountMutation({
                variables: { customerInput: formParams }
            });

            await signIn(formParams.email, formParams.password);

            // Redirect to the second step
            history.replace({
                pathname: resourceUrl('/sign-up/second-step'),
                state: {
                    fromStep: 1,
                    firstName: firstName,
                    lastName: lastName,
                    dob: dobFormatForStep2
                }
            });
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e);
            }

            setErrorMessage(e.message);
            setInprogress(false);
        }
    };

    return {
        email,
        firstName,
        lastName,
        countries,
        genders,
        contact_country_codes,
        nationalities,
        occupations,
        inProgress,
        loadingCountries,
        errorMessage,
        isRedirectFromStep0,
        handleRegisterCustomer,
        getStatesOfCountry
    };
};
