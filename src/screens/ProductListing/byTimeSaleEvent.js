import React from 'react';
import { string } from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import ProductListing from './components/productListing';
import ProductFilters from './components/productFilters';
import GET_TIMESALE_EVENT from './graphql/timeSaleEvent.graphql';
import TopBanner from './components/topBanner';
import PageInfo from './components/pageInfo';
import { useParams } from '@skp/drivers';
import { usePillarSearch } from './hooks/usePillarSearch';
import { useProductFilters } from './hooks/useProductFilters';
import PageTitleForPillar from '@skp/components/PageTitleForPillar';

const TimeSaleEvent = ({ pillarCode }) => {
    const { time_event_id: eventId } = useParams();
    const { data, loading } = useQuery(GET_TIMESALE_EVENT, {
        fetchPolicy: 'network-only',
        variables: {
            id: Number(eventId)
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
                subTitle={data.event.title}
                translateSubtitle={false}
            />
            <TopBanner bannerUrl={data.event.image} />
            <div className="container">
                <div className="main-content">
                    <PageInfo
                        title={data.event.title}
                        description={data.event.description}
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
                                    timeEventId={eventId}
                                />
                            </div>
                            <div className="product-content col-lg-9 col-md-12">
                                <ProductListing
                                    pillarCode={pillarCode}
                                    timeEvent={{
                                        id: eventId,
                                        name: data.event.title
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

TimeSaleEvent.propTypes = {
    pillarCode: string
};

export default TimeSaleEvent;
