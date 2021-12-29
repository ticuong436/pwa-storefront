import cmsPagesOperations from './cmsPagesQuery.gql';
import { useQuery } from '@apollo/react-hooks';

export const useTermLinks = () => {
    const { queries } = cmsPagesOperations;
    const { getSignUpAgreementPages } = queries;

    const {
        data: { term = {}, policy = {}, points = {}, members = {} } = {}
    } = useQuery(getSignUpAgreementPages);

    return {
        term,
        policy,
        points,
        members
    };
};
