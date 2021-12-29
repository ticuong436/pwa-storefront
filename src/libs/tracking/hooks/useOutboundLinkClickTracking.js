import ReactGA from 'react-ga';
import { initGA } from '@skp/libs/tracking/initGA';
import { useEffect } from 'react';

initGA();

export const useOutboundLinkClickTracking = () => {
    useEffect(() => {
        const handleLinkClick = event => {
            const link = event.target;

            if (
                typeof link.tagName !== 'undefined' &&
                link.tagName.toLowerCase() == 'a' &&
                link.href &&
                link.host &&
                link.host !== window.location.host
            ) {
                ReactGA.ga(
                    'send',
                    'event',
                    'External Link',
                    'Click',
                    link.href
                );
            }
        };
        document.addEventListener('click', handleLinkClick);
        return () => document.removeEventListener('click', handleLinkClick);
    }, []);
};
