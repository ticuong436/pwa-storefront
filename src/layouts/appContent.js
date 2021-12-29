import React, { useRef } from 'react';
import { useToggleSidebarClass } from '@skp/hooks/useLayoutEffect';
import Header from './Header';
import Sidebar from './SideBar';
import { useAppContent } from './useAppContent';
import { Redirect, resourceUrl, useLocation } from '@skp/drivers';
import Footer from './Footer';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useTranslation } from 'react-i18next';
import { isRunningInWebview } from '@skp/utils/webview';
import PageTitle from '@skp/components/PageTitle';

const AppContent = ({
    children,
    isMasked,
    pageTitle = null,
    layoutType = '',
    useWhiteBackground = false,
    isBuzz = false
}) => {
    const {
        sidebarIsOpening,
        toggleSidebar,
        isSignedIn,
        isGettingDetails,
        currentUser,
        handleSignOut,
        isLoggingOut
    } = useAppContent();

    const location = useLocation();

    const mainContentRef = useRef(null);

    const { t } = useTranslation(['common']);

    useToggleSidebarClass(sidebarIsOpening || isMasked);

    if (isGettingDetails) {
        return <LoadingIndicator global={true} overlay={false} />;
    }

    if (!isSignedIn) {
        return (
            <Redirect
                to={{
                    pathname: resourceUrl('/login'),
                    state: {
                        from: location,
                        messageError: t('common::Your session expired')
                    }
                }}
            />
        );
    }

    if (
        currentUser.is_inactive &&
        location.pathname !== resourceUrl('/customer/payment/history') &&
        location.pathname !== resourceUrl('/mypage/credit-card/add') &&
        !location.pathname.includes('mypage/credit-card/edit')
    ) {
        return <Redirect to={resourceUrl('/customer/payment/history')} />;
    }

    if (currentUser.is_registering) {
        return <Redirect to={resourceUrl('/sign-up/second-step')} />;
    }

    return (
        <div className="wrapper">
            {pageTitle && <PageTitle title={pageTitle} />}
            <Sidebar
                isSignedIn={isSignedIn}
                isLoggingOut={isLoggingOut}
                currentUser={currentUser}
                sidebarIsOpening={sidebarIsOpening}
                handleSignOut={handleSignOut}
                toggleSidebar={toggleSidebar}
            />
            <Header
                toggleSidebar={toggleSidebar}
                handleSignOut={handleSignOut}
                isLoggingOut={isLoggingOut}
                currentUser={currentUser}
                mainContentRef={mainContentRef}
            />
            <main className="main" ref={mainContentRef}>
                {layoutType == 'home' ? (
                    children
                ) : layoutType == 'category' ? (
                    <div
                        className={`main-fluid ${
                            useWhiteBackground ? 'main-fluid--white' : ''
                        }`}
                    >
                        {children}
                    </div>
                ) : (
                    <div
                        className={`main-fluid ${
                            useWhiteBackground ? 'main-fluid--white' : ''
                        }`}
                    >
                        <div className={isBuzz ? 'buzz-top' : 'container'}>
                            <div
                                id="breadcrumbs-portal"
                                className={isRunningInWebview() ? 'd-none' : ''}
                            />
                            <div className="main-content">{children}</div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default AppContent;
