import { useEffect } from 'react';
import { useLocation } from '@skp/drivers';
import ReactGA from 'react-ga';
import { initGA } from '@skp/libs/tracking/initGA';

initGA();

export const usePageViewTracking = pageTitle => {
    const location = useLocation();

    useEffect(() => {
        if (pageTitle) {
            ReactGA.ga('set', 'title', pageTitle);
        }
        ReactGA.pageview(location.pathname + location.search);
    }, [location.pathname, location.search, pageTitle]);
};
