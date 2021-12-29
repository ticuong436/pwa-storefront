import React from 'react';
import { resourceUrl } from '@skp/drivers';
import HeartWishList from '@skp/components/ProductPrice/heartWishList';
import ProductInfoBox from '@skp/design/ProductInfoBox';
import ProductBoxPriceArea from '@skp/components/ProductBoxPriceArea';
import { getPriceSelling } from '@skp/utils/product';
import { useUserContext } from '@skp/layouts/context/user';

export default function ProductBox({ product, refetchWishList }) {
    const productLink = product.external_detail_url || {
        pathname: resourceUrl(`/product/${product.id}`)
    };
    const [{ currentUser }] = useUserContext();

    return (
        <ProductInfoBox
            action={
                <HeartWishList
                    product={product}
                    refetchWishList={refetchWishList}
                />
            }
            detailUrl={productLink}
            product={{
                id: product.id,
                name: product.name,
                is_new: product.is_new,
                pillar_name: product.pillar.name,
                service_name: product.service_name.label,
                sky_point: product.sky_point || 0,
                short_description: product.short_description.html,
                image: product.small_image.url
            }}
            priceArea={
                <ProductBoxPriceArea
                    product={product}
                    priceSelling={getPriceSelling(
                        product,
                        currentUser.group_id
                    )}
                />
            }
        />
    );
}
