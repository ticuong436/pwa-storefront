import { useEffect, useState } from 'react';

export const useBreadcrumbs = () => {
    const [breadcrumbNode, setBreadcrumbNode] = useState(null);

    useEffect(() => {
        setBreadcrumbNode(document.getElementById('breadcrumbs-portal'));
    }, []);

    return {
        breadcrumbNode
    };
};
