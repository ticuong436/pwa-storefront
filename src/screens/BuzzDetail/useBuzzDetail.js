import { useParams } from '@skp/drivers';
import { useQuery } from '@apollo/react-hooks';
import GET_BUZZ_DETAIL from './getBuzzDetail.graphql';

export default function useBuzzDetail() {
    const { buzz_id: buzzId, category } = useParams();

    const { data, loading, error } = useQuery(GET_BUZZ_DETAIL, {
        fetchPolicy: 'network-only',
        variables: {
            category,
            id: Number(buzzId)
        }
    });

    return {
        buzzDetail: data ? data.getBuzzDetail : null,
        loading,
        error
    };
}
