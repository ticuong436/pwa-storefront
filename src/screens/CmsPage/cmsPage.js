import { Meta } from '@magento/venia-ui/lib/components/Head';
import React from 'react';
import { Redirect, resourceUrl, useParams, useLocation } from '@skp/drivers';
import { useCmsPage } from './useCmsPage';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import AppContent from '@skp/layouts/appContent';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { getErrorMessage } from '@skp/utils/graphqlError';
import PageTitle from '@skp/components/PageTitle';
import productsConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Products/configAggregator';
import { setContentTypeConfig } from '@magento/pagebuilder/lib/config.js';

setContentTypeConfig('products', {
    configAggregator: productsConfigAggregator,
    component: React.lazy(() => import('../../components/ProductsPageBuilder'))
});

export default function CmsPage() {
    const { cms_page_url_key: urlKey } = useParams();
    const { page, error, loading, requireAuth, isPrivatePage } = useCmsPage(
        urlKey
    );
    const location = useLocation();

    if (loading) {
        return <LoadingIndicator />;
    }

    if (requireAuth) {
        return (
            <Redirect
                to={{
                    pathname: resourceUrl('/login'),
                    state: {
                        from: location
                    }
                }}
            />
        );
    }

    if (error) {
        return (
            <Redirect
                to={{
                    pathname: resourceUrl('/login'),
                    state: { messageError: getErrorMessage(error) }
                }}
            />
        );
    }

    if (isPrivatePage && page.page_layout !== 'empty') {
        return (
            <AppContent isMasked={false} useWhiteBackground={true}>
                <PageTitle
                    title={page.meta_title || page.title}
                    transate={false}
                />
                <Meta name="description" content={page.meta_description} />
                <RichContent html={page.content} />
            </AppContent>
        );
    }

    return (
        <>
            <PageTitle title={page.meta_title || page.title} transate={false} />
            <Meta name="description" content={page.meta_description} />
            <RichContent html={page.content} />
        </>
    );
}
