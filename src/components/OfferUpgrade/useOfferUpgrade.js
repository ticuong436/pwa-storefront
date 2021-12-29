import customerOperation from '@skp/components/MyProfile/profile.gql';
import { useQuery } from '@apollo/react-hooks';
import { useEffect, useState } from 'react';
import { getNewChangeTypeCanUpdate } from '@skp/utils/changeType';

export default function useOfferUpgrade() {
    const [isChangingType, setIsChangingType] = useState(false);
    const [newOfferGradeCanUpdate, setNewOfferGradeCanUpdate] = useState('');
    const [changeType, setChangeType] = useState('');
    const [userGroup, setUserGroup] = useState('');

    const { queries } = customerOperation;
    const {
        loading: loadingCustomer,
        data: dataCustomer,
        error: errorLoadingCustomer,
        refetch: reloadCustomer
    } = useQuery(queries.getCurrentCustomer, {
        fetchPolicy: 'network-only'
    });

    const { customer = {} } = dataCustomer || {};

    useEffect(() => {
        setNewOfferGradeCanUpdate(getNewChangeTypeCanUpdate(customer));
        setChangeType(customer.change_type);
        setUserGroup(customer.group);
    }, [customer]);

    return {
        customer,
        newOfferGradeCanUpdate,
        changeType,
        userGroup,
        isChangingType,
        setIsChangingType,
        setChangeType,
        setNewOfferGradeCanUpdate,
        reloadCustomer,
        loadingCustomer,
        errorLoadingCustomer
    };
}
