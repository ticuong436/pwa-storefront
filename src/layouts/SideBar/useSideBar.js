import { useQuery } from '@apollo/react-hooks';
import GET_PRODUCT_TIME_EVENTS from './getProductTimeEvents.graphql';

export const useSideBar = ({ pillarCode }) => {
    const { data } = useQuery(GET_PRODUCT_TIME_EVENTS, {
        variables: { pillar: pillarCode || '' },
        fetchPolicy: 'no-cache',
        skip: !pillarCode
    });

    const { productFilters = {} } = data || {};

    return {
        timeEvents: productFilters.time_events || []
    };
};
