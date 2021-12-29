import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import classes from '@skp/screens/ProductListing/styles/featureProduct.css';
import FeatureProductBox from '@skp/screens/ProductListing/components/featureProductBox';
import GET_FEATURE_PRODUCT from '@skp/screens/ProductListing/graphql/getFeatureProducts.graphql';

export default function FeatureProductListing({
    categoryId
}) {
    const { data } = useQuery(GET_FEATURE_PRODUCT, {
        variables: {
            category_id: categoryId
        },
        fetchPolicy: 'network-only'
    });

    if( data && data.featureProduct && data.featureProduct.length > 3 ) {
        data.featureProduct = data.featureProduct.slice( 0, 3 )
    }

    return (
        <div className={`row ${classes.listing}`}>
            {
                data && data.featureProduct
                ? data.featureProduct.map((product) => (
                    <div
                        className={`result-item col-6 col-md-${12/data.featureProduct.length} p-0`}
                        key={product.id}
                    >
                        <FeatureProductBox product={product}/>
                    </div>
                ))
                :
                ''
            }
        </div>
    );
}
