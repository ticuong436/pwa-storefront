import React, { Suspense } from 'react';
import { useErrorContext } from '@magento/peregrine/lib/context/unhandledErrors';
import { useErrorBoundary } from '@magento/venia-ui/lib/components/App/useErrorBoundary';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import App from './app';

const AppContainer = () => {
    const ErrorBoundary = useErrorBoundary(App);
    const [unhandledErrors, errorApi] = useErrorContext();

    return (
        // Suspense here for react-i18next useTranslation in app.js
        <Suspense fallback={<LoadingIndicator global={true} overlay={false} />}>
            <ErrorBoundary unhandledErrors={unhandledErrors} {...errorApi} />
        </Suspense>
    );
};

export default AppContainer;
