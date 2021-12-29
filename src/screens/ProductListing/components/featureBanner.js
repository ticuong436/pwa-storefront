import React from 'react';
import { Link, resourceUrl } from '@skp/drivers';
import { useQuery } from '@apollo/react-hooks';
import GET_PRODUCT_FILTER_FEATURES from '@skp/screens/ProductListing/graphql/productFilterFeatures.graphql';
import SeeMoreLink from './seeMoreLink';
import TargetBlankLink from '@skp/components/TargetBlankLink';

const FeatureBanner = ({ pillarCode }) => {
    const { data } = useQuery(GET_PRODUCT_FILTER_FEATURES, {
        variables: { pillar: pillarCode },
        fetchPolicy: 'no-cache',
        skip: !pillarCode
    });
    const { productFilters = {} } = data || {};
    const { features = [] } = productFilters;

    if (!features.length) {
        return null;
    }

    return (
        <div className="features-shopping">
            <div className="row">
                {features.map(feature => {
                    return (
                        <div
                            className="features-item col-lg-4 col-md-6"
                            key={feature.id}
                        >
                            {feature.link_status ? (
                                <TargetBlankLink
                                    href={feature.link}
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        className="w-100"
                                        src={resourceUrl(feature.banner, {
                                            type: 'image-feature'
                                        })}
                                    />
                                </TargetBlankLink>
                            ) : (
                                <Link
                                    to={resourceUrl(
                                        `${pillarCode}/feature/${feature.id}`
                                    )}
                                >
                                    <img
                                        className="w-100"
                                        src={resourceUrl(feature.banner, {
                                            type: 'image-feature'
                                        })}
                                    />
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
            <SeeMoreLink url={resourceUrl(pillarCode + '/features')} />
        </div>
    );
};

export default FeatureBanner;
