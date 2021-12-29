import React, { useCallback } from 'react';
import { resourceUrl } from '@skp/drivers';
import { useTranslation } from 'react-i18next';
import ProductInfoBox from '@skp/design/ProductInfoBox';
import ProductBoxPriceArea from '@skp/components/ProductBoxPriceArea';
import { getPriceSelling } from '@skp/utils/product';
import { useUserContext } from '@skp/layouts/context/user';
import deleteIcon from './delete-icon.png';
import Moment from 'moment';

export default function ProductBox({
    product,
    onDelete,
    parentProduct,
    onSkip,
    subscription
}) {
    const productLink = resourceUrl(`/product/${parentProduct.id}`);
    const { t } = useTranslation(['product', 'shopping_subscription']);
    const [{ currentUser }] = useUserContext();

    const trashIcon = (
        <div
            className="cursor-pointer"
            onClick={() => {
                onDelete();
            }}
        >
            <img src={deleteIcon} />
        </div>
    );

    const getSubscriptionDescription = useCallback(
        subscription => {
            const nextPaymentDate = Moment(subscription.next_payment_date)
                .locale(process.env.SKY_STOREFRONT_LANGUAGE)
                .format(
                    t('shopping_subscription::Next payment date MM/DD (dd)')
                );
            const lastDateChangeOrder = Moment(subscription.next_payment_date)
                .subtract(1, 'd')
                .locale(process.env.SKY_STOREFRONT_LANGUAGE)
                .format(
                    t(
                        'shopping_subscription::The last date change order MM/DD (dd)'
                    )
                );

            return `
                <p>
                    ${nextPaymentDate.toString()}<br />
                    ${lastDateChangeOrder.toString()}<br />
                    ${t('shopping_subscription::Order quantity', {
                        quantity: subscription.order_quantity
                    })}
                </p>
            `;
        },
        [t]
    );

    return (
        <ProductInfoBox
            action={trashIcon}
            detailUrl={productLink}
            detailAction={
                <a
                    className={`result--submit ${
                        !subscription.can_skip ? 'no-cursor button--none' : ''
                    }`}
                    onClick={() => {
                        subscription.can_skip && onSkip();
                    }}
                >
                    {subscription.is_skipping
                        ? t('shopping_subscription::Skipping')
                        : t('shopping_subscription::Skip')}
                </a>
            }
            product={{
                id: product.id,
                name: product.name,
                is_new: parentProduct.is_new,
                pillar_name: parentProduct.pillar.name,
                service_name: parentProduct.service_name.label,
                sky_point: product.sky_point || 0,
                short_description: getSubscriptionDescription(subscription),
                image: parentProduct.small_image.url,
                from_shopping_subscription_page: true
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
