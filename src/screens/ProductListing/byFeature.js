import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import ProductListing from './components/productListing';
import ProductFilters from './components/productFilters';
import GET_FEATURE_INFO from './graphql/featureInfo.graphql';
import TopBanner from './components/topBanner';
import PageInfo from './components/pageInfo';
import { useParams } from '@skp/drivers';
import { usePillarSearch } from './hooks/usePillarSearch';
import { useProductFilters } from './hooks/useProductFilters';
import PageTitleForPillar from '@skp/components/PageTitleForPillar';

const ByFeature = ({ pillarCode }) => {
    const { feature_id: featureId } = useParams();
    const { data, loading } = useQuery(GET_FEATURE_INFO, {
        fetchPolicy: 'network-only',
        variables: {
            id: Number(featureId)
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

    usePillarSearch(pillarCode);

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <>
            <PageTitleForPillar
                pillarCode={pillarCode}
                subTitle={data.feature.title}
                translateSubtitle={false}
            />
            <TopBanner bannerUrl={data.feature.header_banner} />
            <div className="container">
                <div className="main-content">
                    <PageInfo
                        title={data.feature.title}
                        description={data.feature.description}
                    />
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
                                    featureId={featureId}
                                />
                            </div>
                            <div className="product-content col-lg-9 col-md-12">
                                <ProductListing
                                    pillarCode={pillarCode}
                                    feature={{
                                        id: featureId,
                                        name: data.feature.title
                                    }}
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

export default ByFeature;
