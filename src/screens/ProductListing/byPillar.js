import React from 'react';
import { string } from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import ProductListing from './components/productListing';
import ProductFilters from './components/productFilters';
import GET_PILLAR_INFO from './graphql/pillarInfo.graphql';
import TopBanner from './components/topBanner';
import PageInfo from './components/pageInfo';
import { getErrorMessage, is404Error } from '@skp/utils/graphqlError';
import { Error404 } from '@skp/components/Errors';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { usePillarSearch } from './hooks/usePillarSearch';
import { useProductFilters } from './hooks/useProductFilters';
import { useServiceInstruction } from './hooks/useServiceInstruction';
import PageTitleForPillar from '@skp/components/PageTitleForPillar';

const ByPillar = ({ code: pillarCode }) => {
    const { data, loading, error } = useQuery(GET_PILLAR_INFO, {
        fetchPolicy: 'no-cache',
        variables: {
            code: pillarCode
        }
    });

    const {
        categories,
        services,
        features,
        timeEvents,
        attributes,
        searchFilterParams,
        addFilterParam,
        removeFilterParam
    } = useProductFilters({
        pillarCode
    });

    const titlePillar = data && data.pillarInfo ? data.pillarInfo.title : '';
    const serviceInstruction = useServiceInstruction({
        pillarCode,
        titlePillar
    });

    usePillarSearch(pillarCode);

    if (loading) {
        return <LoadingIndicator />;
    }

    if (is404Error(error)) {
        return <Error404 />;
    }

    if (error) {
        return <ErrorView>{getErrorMessage(error)}</ErrorView>;
    }

    return (
        <>
            <PageTitleForPillar pillarCode={pillarCode} subTitle="Listing" />
            <TopBanner bannerUrl={data.pillarInfo.image} categoryId={data.pillarInfo.category.id} />
            <div className="container">
                <PageInfo
                    title={data.pillarInfo.title}
                    description={data.pillarInfo.description}
                    serviceInstruction={serviceInstruction}
                />

                <div className="main-content">
                    <div className="product-shopping">
                        <div className="row">
                            <div className="search-product col-lg-3 col-md-12">
                                <ProductFilters
                                    categories={categories}
                                    services={services}
                                    features={features}
                                    timeEvents={timeEvents}
                                    attributes={attributes}
                                    searchFilterParams={searchFilterParams}
                                    addFilterParam={addFilterParam}
                                    removeFilterParam={removeFilterParam}
                                    pillarCode={pillarCode}
                                />
                            </div>
                            <div className="product-content col-lg-9 col-md-12">
                                <ProductListing
                                    pillarCode={pillarCode}
                                    searchFilterParams={searchFilterParams}
                                    addFilterParam={addFilterParam}
                                    removeFilterParam={removeFilterParam}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

ByPillar.propTypes = {
    code: string
};

export default ByPillar;
