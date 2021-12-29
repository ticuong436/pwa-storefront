import React, { useLayoutEffect } from 'react';

export default function Error503() {
    useLayoutEffect(() => {
        // Reset meta viewport which was set in pwa-storefront/template.html
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
            viewport.setAttribute(
                'content',
                'width=device-width, initial-scale=1.0'
            );
        }
    }, []);

    return (
        <iframe
            title="Site under maintenance"
            // Full page iframe
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                width: '100%',
                height: '100%',
                border: 'none',
                margin: 0,
                padding: 0,
                overflow: 'hidden',
                zIndex: 999999
            }}
            src="https://info.skypremium.com.sg/maintenance2021"
        />
    );
}
