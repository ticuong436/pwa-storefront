import { useQuery } from '@apollo/react-hooks';
import bannerOperation from './banners.gql';
import { useEffect } from 'react';
import { resourceUrl } from '@skp/drivers';

export const useHome = () => {
    const { queries } = bannerOperation;
    const { data, loading } = useQuery(queries.getListBanner, {
        fetchPolicy: 'network-only'
    });
    const { banners = [] } = data || {};

    const mainBanner = banners.find(banner => banner.is_main_banner) || {};
    const slideBanners = banners.filter(banner => !banner.is_main_banner);

    useEffect(() => {
        // Preload images
        banners.forEach(banner => {
            new Image().src = resourceUrl(banner.image, {
                type: 'image-banner'
            });
        });
    }, [banners]);

    return {
        slideBanners,
        mainBanner,
        loading
    };
};
