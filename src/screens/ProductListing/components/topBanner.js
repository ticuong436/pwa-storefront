import React from 'react';
import FeatureProductListing from '@skp/screens/ProductListing/components/featureProductListing';

export default function TopBanner({ bannerUrl, categoryId }) {
    return (
        <>
        <div className="shopping-top position-relative mb-5">
            <img src={bannerUrl} alt="" className="w-100" />
        </div>
        <div className="container position-relative">
            <FeatureProductListing categoryId={categoryId} />
        </div>
        </>
    );
}
