import React, { useState } from 'react';
import { Link, resourceUrl } from '@skp/drivers';
import TargetBlankLink from '@skp/components/TargetBlankLink';

export default function FeatureFilter({
    features,
    featureId,
    pillarCode,
    limit
}) {
    const [endIndex, setEndIndex] = useState(limit || features.length);

    const onClickMore = event => {
        event.preventDefault();
        setEndIndex(endIndex => endIndex + limit);
    };

    const isLoadedAll = endIndex >= features.length;

    return (
        <>
            <ul className="search-product-list">
                {features.length > 0 &&
                    features.slice(0, endIndex).map(feature => (
                        <li className="search-product--sub" key={feature.id}>
                            {feature.link_status ? (
                                <TargetBlankLink href={feature.link}>
                                    {feature.title}
                                </TargetBlankLink>
                            ) : (
                                <Link
                                    to={resourceUrl(
                                        `${pillarCode}/feature/${feature.id}`
                                    )}
                                    className={
                                        featureId == feature.id
                                            ? 'search--active'
                                            : ''
                                    }
                                >
                                    {feature.title}
                                </Link>
                            )}
                        </li>
                    ))}
            </ul>
            {!isLoadedAll && (
                <button className="search--more" onClick={onClickMore}>
                    + More
                </button>
            )}
        </>
    );
}
