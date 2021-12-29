import React from 'react';
import { Link } from '@skp/drivers';

/**
 * We cannot use <Link> for external link
 *
 * So we wrap in this this component, to check if it is external link (start with http/https)
 */
const ExternalSupportLink = ({ to, children, ...rest }) => {
    const isExternal = typeof to === 'string' && to.match(/^http[s]*:\/\//i);

    if (isExternal) {
        return (
            <a href={to} {...rest}>
                {children}
            </a>
        );
    }

    return (
        <Link to={to} {...rest}>
            {children}
        </Link>
    );
};

export default React.memo(ExternalSupportLink);
