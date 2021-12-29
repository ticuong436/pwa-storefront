import { useQuery } from '@apollo/react-hooks';
import { checkValidToken } from '@skp/layouts/context/user';
import CMS_PAGE_QUERY from './cmsPage.graphql';

export const useCmsPage = urlKey => {
    const isPrivatePage = !urlKey.startsWith('public/');

    const requireAuth = isPrivatePage && !checkValidToken();

    const { data = {}, loading, error } = useQuery(CMS_PAGE_QUERY, {
        variables: { urlKey },
        fetchPolicy: 'network-only',
        skip: requireAuth
    });

    return {
        page: data.cmsPage || {},
        error,
        loading,
        isPrivatePage,
        requireAuth
    };
};
