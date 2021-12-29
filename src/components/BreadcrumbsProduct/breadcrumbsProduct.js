import { number, shape, string } from 'prop-types';
import React from 'react';
import { resourceUrl, useLocation } from '@skp/drivers';
import Breadcrumbs from '@skp/components/Breadcrumbs';
import { SERVICE_THE_TIME } from '@skp/config';

export default function BreadcrumbsProduct({ product }) {
    const location = useLocation();
    const items = [];
    if (product.pillar && product.pillar.name) {
        items.push({
            url: resourceUrl(`/${product.pillar.code}`),
            title: product.pillar.name
        });
    }

    const isFromFeaturePage =
        location.state && location.state.feature && location.state.feature.id;

    const isFromCategoryPage =
        location.state && location.state.category && location.state.category.id;

    if (
        product.service_name &&
        product.service_name.label &&
        !isFromCategoryPage &&
        !isFromFeaturePage
    ) {
        items.push({
            url: resourceUrl(
                `/${product.pillar.code}/service/${product.service_name.value}`
            ),
            title: product.service_name.label
        });
    }

    if (
        location.state &&
        location.state.timeEvent &&
        location.state.timeEvent.id
    ) {
        items.push({
            url: resourceUrl(
                `/${product.pillar.code}/service/${SERVICE_THE_TIME}/${
                    location.state.timeEvent.id
                }`
            ),
            title: location.state.timeEvent.name
        });
    }

    if (isFromFeaturePage) {
        items.push({
            url: resourceUrl(
                `/${product.pillar.code}/feature/${location.state.feature.id}`
            ),
            title: location.state.feature.name
        });
    }

    if (isFromCategoryPage) {
        items.push({
            url: resourceUrl(
                `/${product.pillar.code}/category/${location.state.category.id}`
            ),
            title: location.state.category.name
        });
    }

    items.push({
        title: product.name
    });

    return <Breadcrumbs items={items} />;
}

BreadcrumbsProduct.propTypes = {
    product: shape({
        id: number.isRequired,
        name: string.isRequired,
        pillar: shape({
            code: string,
            name: string
        }).isRequired,
        service_name: shape({
            value: string,
            label: string
        }).isRequired
    }).isRequired
};
