import React from 'react';
import { string } from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import ProductListing from './components/productListing';
import ProductFilters from './components/productFilters';
import GET_PRODUCT_SERVICE from './graphql/productService.graphql';
import TopBanner from './components/topBanner';
import PageInfo from './components/pageInfo';
import { useParams } from '@skp/drivers';
import { usePillarSearch } from './hooks/usePillarSearch';
import { useProductFilters } from './hooks/useProductFilters';
import { useServiceInstruction } from './hooks/useServiceInstruction';
import HotelListing from '@skp/components/HotelListing';
import PageTitleForPillar from '@skp/components/PageTitleForPillar';
import { SERVICE_CODE } from '@skp/config';

const ByService = ({ pillarCode }) => {
    const { service_code: routeServiceCode } = useParams();
    let serviceCode = routeServiceCode;
    /**
     * FIXME: after fix link on mobile
     * Temporary support old service code of the multiplay service,
     * because mobile app still refer to old service url
     * the-multiplay => the-multiplay-travel, the-multiplay-wellness
     */
    if (routeServiceCode === 'the-multiplay') {
        serviceCode = routeServiceCode + '-' + pillarCode;
    }

    const { data, loading } = useQuery(GET_PRODUCT_SERVICE, {
        fetchPolicy: 'network-only',
        variables: {
            code: serviceCode
        }
    });

    const {
        categories,
        services,
        features,
        timeEvents,
        attributes,
        searchFilterParams,
        hotelFilters,
        addFilterParam,
        removeFilterParam
    } = useProductFilters({
        pillarCode,
        serviceCode
    });

    const serviceInstruction = useServiceInstruction({
        services,
        serviceCode,
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
                subTitle={data.service.title}
                translateSubtitle={false}
            />
            <TopBanner bannerUrl={data.service.image} />
            <div className="container">
                <div className="main-content">
                    <PageInfo
                        serviceCode={serviceCode}
                        title={data.service.title}
                        description={data.service.description}
                        serviceInstruction={serviceInstruction}
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
                                    hotelFilters={hotelFilters}
                                    searchFilterParams={searchFilterParams}
                                    addFilterParam={addFilterParam}
                                    removeFilterParam={removeFilterParam}
                                    pillarCode={pillarCode}
                                    serviceCode={serviceCode}
                                />
                            </div>
                            <div className="product-content col-lg-9 col-md-12">
                                {serviceCode != SERVICE_CODE.hotels ? (
                                    <ProductListing
                                        pillarCode={pillarCode}
                                        service={{
                                            serviceCode,
                                            name: data.service.title
                                        }}
                                        searchFilterParams={searchFilterParams}
                                        addFilterParam={addFilterParam}
                                        removeFilterParam={removeFilterParam}
                                    />
                                ) : (
                                    <HotelListing
                                        searchFilterParams={searchFilterParams}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

ByService.propTypes = {
    pillarCode: string
};

export default ByService;
