import React, { useCallback } from 'react';

import { array, func, shape, string } from 'prop-types';

import { useApp } from '@magento/peregrine/lib/talons/App/useApp';

import { HeadProvider, Title } from '@magento/venia-ui/lib/components/Head';
import Mask from '@magento/venia-ui/lib/components/Mask';
import Routes from './Routes';
import ToastContainer from './Toasts';
import { useTranslation } from 'react-i18next';
import { useSiteContext } from './context/site';
import { Error503 } from '@skp/components/Errors';
import { useNotificationContext } from './context/notification';
import { useOutboundLinkClickTracking } from '@skp/libs/tracking';

// Check UPWARD Front Names config for reload to skip
import { useLocation } from '@skp/drivers';
import { useQuery } from '@apollo/react-hooks';
import GET_UPWARD_CONFIG from './getUpwardConfig.graphql';
import { useCookies } from 'react-cookie';
import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';

const App = props => {
    const { t } = useTranslation(['common']);
    const { markErrorHandled, renderError, unhandledErrors } = props;

    useOutboundLinkClickTracking();

    const [, { setError }] = useNotificationContext();

    // We don't need to show message now
    /* const handleIsOffline = useCallback(() => {
        setError(
            t('common::You are offline. Some features may be unavailable.')
        );
    }, [setError, t]);

    const handleIsOnline = useCallback(() => {
        setInfo(t('common::You are online.'));
    }, [setInfo, t]); */

    const handleIsOffline = useCallback(() => {}, []);
    const handleIsOnline = useCallback(() => {}, []);

    const handleError = useCallback(
        error => {
            /**
             * After deploy (yarn build) and there are change in some component files,
             * the webpack chunks will be changed, but there maybe some browser clients had already load the old chunks
             * => Which causes chunk load error or modules[moduleId] is undefined.
             * Now solution is reload the page to force browser load new js chunk file.
             */
            if (
                error.message == 'modules[moduleId] is undefined' ||
                error.name == 'ChunkLoadError'
            ) {
                window.console.log(
                    'Error which is handled by location.reload: ',
                    error
                );
                window.location.reload();
                return;
            }

            const ERROR_MESSAGE = t(
                'common::Sorry! An unexpected error occurred. Please try again.'
            );

            setError(`${ERROR_MESSAGE}`);
        },
        [setError, t]
    );

    const talonProps = useApp({
        handleError,
        handleIsOffline,
        handleIsOnline,
        markErrorHandled,
        renderError,
        unhandledErrors
    });

    const { hasOverlay, handleCloseDrawer } = talonProps;

    const [{ isInMaintenanceMode }] = useSiteContext();

    // Check UPWARD Front Names config for reload to skip
    const { data } = useQuery( GET_UPWARD_CONFIG, {
        fetchPolicy: 'network-only'
    } );
    const location = useLocation();
    let upwardConfig = [];
    if( data && data.upwardFrontNamesToSkip ){
        data.upwardFrontNamesToSkip.forEach( config => {
            upwardConfig.push( config.front_name )
        });
    }
    let currentPath = location.pathname.replace( process.env.PUBLIC_PATH, '' );
    const index = currentPath.indexOf('?');
    if( index > 0 ){
        currentPath = currentPath.slice(0, index);
    }
    if( currentPath.slice(-1) === '/' ){
        currentPath = currentPath.slice(0, -1);
    }

    const [cookies, setCookie, removeCookie] = useCookies(['customer_token']);
    const storage = new BrowserPersistence();
    const signinToken = storage.getItem('signin_token')

    //Set Cookie for login magento 2
    if( signinToken ){
        setCookie('customer_token', signinToken , { path: '/' });
    } else {
        removeCookie( 'customer_token', { path: '/' } )
    }

    if( upwardConfig.includes( currentPath ) ){
        window.location.reload();
        return null;
    }

    if (isInMaintenanceMode) {
        return (
            <HeadProvider>
                <Title>Site under maintenance</Title>
                <Error503 />
            </HeadProvider>
        );
    }

    if (renderError) {
        return (
            <HeadProvider>
                {/* Note: STORE_NAME is injected by Webpack at build time. */}
                <Title>{STORE_NAME}</Title>
                <Mask isActive={true} />
                <ToastContainer />
            </HeadProvider>
        );
    }

    return (
        <HeadProvider>
            <Title>{STORE_NAME}</Title>
            <Routes isMasked={hasOverlay} />
            <Mask isActive={hasOverlay} dismiss={handleCloseDrawer} />
            <ToastContainer />
        </HeadProvider>
    );
};

App.propTypes = {
    markErrorHandled: func.isRequired,
    renderError: shape({
        stack: string
    }),
    unhandledErrors: array
};

export default App;
