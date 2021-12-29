import React from 'react';
import { resourceUrl } from '@skp/drivers';
import deleteIcon from './delete-icon.png';
import { useTranslation } from 'react-i18next';
import ProductInfoBox from '@skp/design/ProductInfoBox';
import ProductBoxPriceArea from '@skp/components/ProductBoxPriceArea';
import { getPriceSelling } from '@skp/utils/product';
import { useUserContext } from '@skp/layouts/context/user';

export default function ProductBox({ product, handleDeleteRequest }) {
    const productLink = resourceUrl(`/product/${product.id}`);
    const { t } = useTranslation(['product']);
    const [{ currentUser }] = useUserContext();

    return (
        <ProductInfoBox
            action={
                <a
                    href="#"
                    title={t('product::REMOVE')}
                    style={{ marginTop: '-4px' }}
                    onClick={e => {
                        e.preventDefault();
                        handleDeleteRequest();
                    }}
                >
                    <img src={deleteIcon} alt={t('product::REMOVE')} />
                </a>
            }
            additionalInfo={
                product.stock_status === 'OUT_OF_STOCK'
                    ? t('product::WAITING FOR RESTOCK')
                    : null
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
