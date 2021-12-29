import React, { Fragment, useEffect } from 'react';
import { useProduct } from './useProduct';
import { Meta } from '@magento/venia-ui/lib/components/Head';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import ProductFullDetail from '@skp/components/ProductFullDetail';
import { MagentoGraphQLTypes } from '@magento/venia-ui/lib/util/apolloCache';
import mapProduct from '@skp/utils/mapProduct';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import GET_PRODUCT_DETAIL from './getProductDetail.graphql';
import { useParams } from '@skp/drivers';
import BreadcrumbsProduct from '@skp/components/BreadcrumbsProduct';
import PageTitle from '@skp/components/PageTitle';
import { useTranslation } from 'react-i18next';
import { isRunningInWebview, sendEventToWebview } from '@skp/utils/webview';

const Product = () => {
    const { t } = useTranslation(['common']);
    const { id } = useParams();
    useEffect(() => {
        // setTimeout to handle scroll to top when back by browser
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);

        return () => clearTimeout(timer);
    }, [id]);

    const talonProps = useProduct({
        cachePrefix: MagentoGraphQLTypes.ProductInterface,
        mapProduct,
        query: GET_PRODUCT_DETAIL,
        id
    });

    const {
        error,
        loading,
        product,
        refetch,
        sendProductAddToCart,
        goosearchScriptLoading
    } = talonProps;

    if (loading || goosearchScriptLoading) {
        // Return loading indicator here will make component <ProductFullDetail>
        // to remount and then reset all internal state (useState) every time product id (routing) changed.
        // There is case:
        // - (1) Go to product A detail
        // - (2) Click on product B on Upsell / Related products list
        //   In this case Route component is kept (not remount), only product id param changed
        return <LoadingIndicator />;
    }

    if (!product || error) {
        return (
            <ErrorView>
                <h1 style={{ minHeight: '300px' }}>
                    {t('common::Page not found')}
                </h1>
            </ErrorView>
        );
    }

    if (product.external_detail_url) {
        window.location.replace(product.external_detail_url);
        return null;
    }

    if (isRunningInWebview()) {
        sendEventToWebview(
            'product-detail-loaded',
            JSON.stringify({
                id: product.id,
                name: product.name
            })
        );
    }

    return (
        <Fragment>
            <PageTitle
                title={`${product.name}${
                    product.pillar.name ? ' - ' + product.pillar.name : ''
                }`}
                transate={false}
            />
            <Meta name="description" content={product.meta_description} />
            <BreadcrumbsProduct product={product} />
            <ProductFullDetail
                product={product}
                refetch={refetch}
                gssAddToCartHandler={sendProductAddToCart}
            />
        </Fragment>
    );
};

export default Product;
