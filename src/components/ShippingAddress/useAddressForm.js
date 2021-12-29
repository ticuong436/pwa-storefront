import { useQuery, useMutation } from '@apollo/react-hooks';
import GET_COUNTRIES from '@skp/components/CreditCard/getCountries.graphql';
import ADD_CUSTOMER_ADDRESS from './addCustomerAddress.graphql';
import UPDATE_CUSTOMER_ADDRESS from './updateCustomerAddress.graphql';
import { useUserContext } from '@skp/layouts/context/user';

export const useAddressForm = ({ address, onAddressAdded }) => {
    const { data = {} } = useQuery(GET_COUNTRIES);
    const { countries = [] } = data;

    const [
        addOrUpdateAddress,
        { loading: submitting, error: submitError }
    ] = useMutation(
        address.id ? UPDATE_CUSTOMER_ADDRESS : ADD_CUSTOMER_ADDRESS
    );

    const countryJp = countries.find(country => country.id === 'JP');

    const [{ currentUser, isGettingDetails: isGettingUser }] = useUserContext();

    const handleSubmit = async params => {
        const input = {
            lastname: params.lastname,
            firstname: params.firstname,
            country: params.country,
            postal_code: params.postal_code,
            city: params.city,
            phone: params.contact_phone,
            address_street1: params.address_street1,
            address_street2: params.address_street2,
            default_shipping: params.default_shipping
        };
        if (address.id) {
            input.id = address.id;
        }

        try {
            await addOrUpdateAddress({
                variables: input
            });

            onAddressAdded();
        } catch (error) {
            console.log(error);
        }
    };

    return {
        submitting,
        submitError,
        handleSubmit,
        currentUser,
        isGettingUser
    };
};
