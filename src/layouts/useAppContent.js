import { useCallback, useState, useEffect } from 'react';
import { useUserContext } from './context/user';
import { useCheckLoginSession } from '@skp/hooks/useCheckLoginSession';
import { useUserContextQuery } from './context/user/context';

export const useAppContent = () => {
    const [sidebarIsOpening, setSidebarIsOpening] = useState(false);
    const [{ currentUser, isSignedIn, isGettingDetails }] = useUserContext();
    const { userContextFetchDetails } = useUserContextQuery();
    useEffect(() => {
        // Currently, we use useRouteMatch for PillarRoute in routes.js,
        // when navigate to pillar route, it will trigger this to reload user,
        // that is not we want. We only want this to be load on load page.
        // So we check if customer already loaded, we don't load again.
        if (currentUser.email) {
            return;
        }

        userContextFetchDetails();
    }, [currentUser.email, userContextFetchDetails]);

    const { isLoggingOut, handleSignOut } = useCheckLoginSession({
        watchToken: true
    });

    const toggleSidebar = useCallback(() => {
        setSidebarIsOpening(prevState => !prevState);
    }, [setSidebarIsOpening]);
    return {
        sidebarIsOpening,
        toggleSidebar,
        isSignedIn,
        isGettingDetails,
        currentUser,
        handleSignOut,
        isLoggingOut
    };
};
