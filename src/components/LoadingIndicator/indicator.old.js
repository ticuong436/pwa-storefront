import React from 'react';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import defaultClasses from './indicator.css';
import { Loader as LoaderIcon } from 'react-feather';
import { mergeClasses } from '@skp/utils/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

const LoadingIndicator = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const className = props.global ? classes.global : classes.root;

    const component = (
        <div
            className={
                className +
                ' ' +
                (props.overlay ? classes.backgroundOverlay : '')
            }
        >
            <Icon
                src={LoaderIcon}
                size={64}
                classes={{ icon: classes.indicator }}
            />
            <span className={classes.message}>{props.children}</span>
        </div>
    );

    // Using Portal to mount component in #root, avoid conflict between position fixd and css transform translate
    return props.global ? <Portal>{component}</Portal> : component;
};

export default LoadingIndicator;

LoadingIndicator.defaultProps = {
    overlay: true
};
