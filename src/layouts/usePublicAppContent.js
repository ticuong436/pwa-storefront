import mainBannerOperation from './main-banner.gql';
import { useQuery } from '@apollo/react-hooks';

export const usePublicAppContent = () => {
    const { queries } = mainBannerOperation;
    const { data, called, loading } = useQuery(queries.getMainBanner, {
        fetchPolicy: 'network-only'
    });
    const { mainBanner = {} } = data || {};

    return {
        loadingBanner: !called || loading,
        mainBanner
    };
};
