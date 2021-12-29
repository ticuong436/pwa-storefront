import React from 'react';
import { usePublicAppContent } from './usePublicAppContent';
import { resourceUrl, useLocation } from '@skp/drivers';
import AlertMessage from '@skp/components/AlertMessage';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import PageTitle from '@skp/components/PageTitle';

const PublicAppContent = ({ children, pageTitle = null }) => {
    const { mainBanner, loadingBanner } = usePublicAppContent();
    const customStyle = {};
    const location = useLocation();
    let messageError = '';

    if (location.state && location.state.messageError) {
        messageError = location.state.messageError;
    }

    if (loadingBanner) {
        return <LoadingIndicator global={true} overlay={false} />;
    }

    if (mainBanner.image) {
        customStyle.backgroundImage = `url('${resourceUrl(mainBanner.image, {
            type: 'image-banner'
        })}')`;
    }

    return (
        <div className="wrapper wrapper-login" style={customStyle}>
            {pageTitle && <PageTitle title={pageTitle} />}
            {messageError && (
                <AlertMessage
                    type="error"
                    marginBottom={false}
                    positionAbsolute={true}
                >
                    {messageError}
                </AlertMessage>
            )}
            {children}
        </div>
    );
};

export default PublicAppContent;
