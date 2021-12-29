import React from 'react';
import { isRunningInWebview } from '@skp/utils/webview';

/**
 * Sometimes webview does not open target="_blank" link inside webview
 * Issues: https://github.com/react-native-webview/react-native-webview/issues/1855#issuecomment-783600324
 *
 * So we wrap link with target blank to this component,
 * if web is inside webview, we will remove target blank
 */
const TargetBlankLink = ({ children, href = '', ...rest }) => {
    let target = '_blank';
    if (isRunningInWebview()) {
        const baseUrl =
            window.location.host.replace('www.', '') + process.env.PUBLIC_PATH;
        const hrefCompare = href
            .toLowerCase()
            .replace(/http[s]?:\/\//, '')
            .replace('www.', '');

        if (hrefCompare.startsWith('/') || hrefCompare.startsWith(baseUrl)) {
            target = null;
        }
    }

    return (
        <a href={href} {...rest} target={target}>
            {children}
        </a>
    );
};

export default React.memo(TargetBlankLink);
