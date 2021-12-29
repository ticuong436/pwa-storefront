import React, { useState } from 'react';
import classNames from 'classnames';
import classes from '@skp/screens/ProductListing/styles/filterPanel.css';

export default function FilterPanel({
    title,
    collapsible = true,
    hideInMobile = false,
    children
}) {
    const [showCollapse, setShowCollapse] = useState(true);
    const titleClass = classNames('search-product--title cursor-pointer', {
        ['hide-pseudo-after']: !collapsible,
        [classes.collapsed]: !showCollapse
    });

    return (
        <div className={`search-product-box ${hideInMobile ? 'hide-xs' : ''}`}>
            <h4
                className={titleClass}
                onClick={() =>
                    collapsible &&
                    setShowCollapse(showCollapse => !showCollapse)
                }
            >
                {title}
            </h4>
            <div className={showCollapse ? '' : 'd-none'}>{children}</div>
        </div>
    );
}
