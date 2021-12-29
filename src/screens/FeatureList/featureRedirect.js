import React from 'react';
import { Link, resourceUrl } from '@skp/drivers';
import TargetBlankLink from '@skp/components/TargetBlankLink';

const FeatureRedirect = props => {
    const { feature, children, pillarCode } = props;

    return (
        <>
            {feature.link_status ? (
                <TargetBlankLink className="fealist1-img" href={feature.link}>
                    {children}
                </TargetBlankLink>
            ) : (
                <Link
                    className="fealist1-img"
                    to={resourceUrl(`${pillarCode}/feature/${feature.id}`)}
                >
                    {children}
                </Link>
            )}
        </>
    );
};

export default FeatureRedirect;
