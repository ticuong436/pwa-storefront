import React, { useMemo } from 'react';
import Slider from 'react-slick';
import ProductListingCard from '@skp/screens/ProductListing/components/productListingCard';
import { mapProductFromDbToListing } from '@skp/screens/ProductListing/utils/product';
import { useUserContext } from '@skp/layouts/context/user';

const ProductRelation = ({
    relationProducts,
    displayType,
    refetchCart = null,
    productListName = ''
}) => {
    const recommendSlideSettings = {
        autoplay: true,
        dots: true,
        infinite: true,
        slidesToShow: relationProducts.length > 4 ? 4 : relationProducts.length,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            }
        ]
    };

    const [{ currentUser }] = useUserContext();

    const productsList = useMemo(() => {
        return relationProducts.map((item, index) => {
            return [
                item.id,
                <ProductListingCard
                    productIndex={index}
                    listName={productListName}
                    displayType={displayType}
                    product={mapProductFromDbToListing(item, currentUser)}
                    refetchCart={refetchCart}
                />
            ];
        });
    }, [
        relationProducts,
        productListName,
        displayType,
        currentUser,
        refetchCart
    ]);

    return (
        <>
            <Slider
                {...recommendSlideSettings}
                className="result row d-none d-lg-block d-md-block"
            >
                {productsList.map(([key, item]) => (
                    <div className="result-item recommend-item col-3" key={key}>
                        {item}
                    </div>
                ))}
            </Slider>
            <div className="row d-lg-none d-md-none">
                {productsList.map(([key, item]) => (
                    <div className="result-item recommend-item col-6" key={key}>
                        {item}
                    </div>
                ))}
            </div>
        </>
    );
};

export default ProductRelation;
