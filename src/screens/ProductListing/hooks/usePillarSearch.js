import { useEffect } from 'react';
import { useSiteContext } from '@skp/layouts/context/site';

export const usePillarSearch = pillarCode => {
    const [
        { currentPillarCode, isUsingGlobalSearch },
        {
            actions: { setCurrentPillarCode, setNotUseGlobalSearch }
        }
    ] = useSiteContext();

    useEffect(() => {
        // Timeout to make call after site context was reseted when route change
        // in pwa-storefront/src/layouts/context/site/context.js
        const timer = setTimeout(() => {
            if (currentPillarCode !== pillarCode) {
                setCurrentPillarCode(pillarCode);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [currentPillarCode, pillarCode, setCurrentPillarCode]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isUsingGlobalSearch) {
                setNotUseGlobalSearch();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [isUsingGlobalSearch, setNotUseGlobalSearch]);
};
