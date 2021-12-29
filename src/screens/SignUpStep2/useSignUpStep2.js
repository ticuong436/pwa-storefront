import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { resourceUrl, useHistory, useLocation } from '@skp/drivers';
import CHECK_IS_USER_TERMINATED_BEFORE from './checkIsUserTerminatedBefore.graphql';
import GET_REGISTRATION_CAMPAIN from './getRegistrationCampain.graphql';
import { useCheckLoginSession } from '@skp/hooks/useCheckLoginSession';
import { useUserContext } from '@skp/layouts/context/user';

export const useSignUpStep2 = props => {
    const { signOutApi } = useCheckLoginSession({ watchToken: true });

    const { queries, mutations } = props;
    const { getMemberSubscriptionPlans } = queries;
    const { data } = useQuery(getMemberSubscriptionPlans);

    const memberSubscriptionPlans = data ? data.memberSubscriptionPlans : [];

    const [updateCustomerSignUpStep2, { error, loading }] = useMutation(
        mutations.updateCustomerSignUpStep2
    );

    const history = useHistory();
    const { state: dataStep1 = {} } = useLocation();

    const [grade, setGrade] = useState('PLATINUM');
    const [paymentCycle, setPaymentCycle] = useState(1);

    const [{ currentUser }] = useUserContext();
    const { dob, firstName, lastName } = dataStep1;

    const {
        data: { isTerminatedUserWithInYear } = {},
        loading: checkingUser
    } = useQuery(CHECK_IS_USER_TERMINATED_BEFORE, {
        variables: {
            dob: dob ? dob : currentUser.dob,
            firstName: firstName ? firstName : currentUser.firstname,
            lastName: lastName ? lastName : currentUser.lastname
        },
        fetchPolicy: 'network-only'
    });

    const { data: registrationCampainData } = useQuery(
        GET_REGISTRATION_CAMPAIN,
        {
            fetchPolicy: 'network-only'
        }
    );

    const registrationCampain = registrationCampainData
        ? registrationCampainData.storeConfig
        : [];

    const countNextPaymentDate = paymentCycle => {
        const date = new Date();
        const nextPaymentDate = new Date(
            date.setMonth(date.getMonth() + paymentCycle)
        );
        const nextPaymentMonth = nextPaymentDate.getMonth() + 1;

        return (
            nextPaymentDate.getFullYear() +
            '/' +
            nextPaymentMonth.toString().padStart(2, '0') +
            '/' +
            nextPaymentDate
                .getDate()
                .toString()
                .padStart(2, '0')
        );
    };

    const [paymentAmount, setPaymentAmount] = useState(0);

    const [nextPaymentDate, setNextPaymentDate] = useState(
        countNextPaymentDate(paymentCycle)
    );

    const handleClickGrade = grade => {
        setGrade(grade);

        return true;
    };

    const handleClickPaymentCycle = paymentCycle => {
        setPaymentCycle(paymentCycle);
        setNextPaymentDate(countNextPaymentDate(paymentCycle));

        return true;
    };

    const handleFormSubmit = async formParams => {
        const data = { ...formParams, grade, payment_cycle: paymentCycle };

        const resultSignUp = await updateCustomerSignUpStep2({
            variables: { updateCustomerInput: data }
        });

        if (resultSignUp.data.updateCustomerSignUpStep2) {
            // Redirect to the third step
            history.replace({
                pathname: resourceUrl('/sign-up/third-step'),
                state: {
                    fromStep: 2
                }
            });
        }
    };

    const handleCancel = async () => {
        await signOutApi();

        history.push({
            pathname: resourceUrl('/login')
        });
    };

    useEffect(() => {
        const countPaymentAmount = (grade, cycle) => {
            if (memberSubscriptionPlans.length > 0) {
                const plan = memberSubscriptionPlans.find(
                    plan => plan.code == grade
                );
                const paymentCycle = plan.payment_cycles.find(
                    paymentCycle => paymentCycle.interval == cycle
                );

                return new Intl.NumberFormat().format(paymentCycle.price);
            }

            return 0;
        };

        setPaymentAmount(countPaymentAmount(grade, paymentCycle));
    }, [grade, paymentCycle, memberSubscriptionPlans]);

    return {
        isTerminatedUserWithInYear,
        registrationCampain,
        checkingUser,
        grade,
        paymentCycle,
        paymentAmount,
        nextPaymentDate,
        handleClickGrade,
        handleClickPaymentCycle,
        memberSubscriptionPlans,
        handleFormSubmit,
        inProgress: loading,
        error,
        handleCancel
    };
};
