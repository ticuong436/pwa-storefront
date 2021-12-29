import React from 'react';
import { Link, resourceUrl } from '@skp/drivers';
import { useTranslation } from 'react-i18next';
import { useUserContext } from '@skp/layouts/context/user';
import { SERVICE_CODE } from '@skp/config';
import TargetBlankLink from '@skp/components/TargetBlankLink';
import defaultClasses from './applyButton.module.css';

const ApplyButton = props => {
    const { product } = props;
    const { t } = useTranslation(['apply_button']);
    const [{ currentUser }] = useUserContext();

    const isProductMultiplay =
        product.service_name.value == SERVICE_CODE.the_multiplay_travel ||
        product.service_name.value == SERVICE_CODE.the_multiplay_wellness;

    const showTargetUrl =
        product.__typename == 'VirtualProduct' &&
        product.target_url &&
        product.target_url.trim() &&
        ((product.is_only_platium &&
            currentUser.group == 'PLATINUM' &&
            !isProductMultiplay) ||
            (currentUser.is_multiplay && isProductMultiplay));

    if (showTargetUrl) {
        return (
            <div className="product-cart">
                <div className="product-cart__btn">
                    <TargetBlankLink
                        href={product.target_url}
                        rel="noopener noreferrer"
                        className="button button--primary"
                    >
                        {t('apply_button::Go to URL')}
                    </TargetBlankLink>
                </div>
            </div>
        );
    }

    if (product.point_mall_flag && product.stock_status !== 'OUT_OF_STOCK') {
        const actualPrice = product.price_range.minimum_price.final_price.value;
        const totalSkyPoint = currentUser.skyPoints.total;
        const disabeld = actualPrice > totalSkyPoint;

        return (
            <div className="product-cart">
                <div className="product-cart__btn">
                    {disabeld ? (
                        <div className="product-cart">
                            <div className="product-cart__btn">
                                <a className="button button--none">
                                    {t('apply_button::Short of Point')}
                                </a>
                            </div>
                        </div>
                    ) : (
                        <Link
                            to={resourceUrl(
                                `/product/${
                                    product.id
                                }/point-mall-checkout/first-step`
                            )}
                            className="button button--primary"
                        >
                            {t('apply_button::Purchase by SKY POINTS')}
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    if (
        product.sky_apply_way === 'period' ||
        product.sky_apply_way === 'any_time'
    ) {
        if (
            product.is_applied_virtual_product ||
            product.is_applied_lottery_product
        ) {
            return (
                <div className="product-cart">
                    <div className="product-cart__btn">
                        <a className={`button ${defaultClasses.appliedBtn}`}>
                            {t('apply_button::You already applied')}
                        </a>
                    </div>
                </div>
            );
        }

        if (product.sky_time_sales.status === 'NOT_STARTED_YET') {
            return (
                <div className="product-cart">
                    <div className="product-cart__btn">
                        <a className={`button ${defaultClasses.appliedBtn}`}>
                            {t('apply_button::Coming soon')}
                        </a>
                    </div>
                </div>
            );
        }

        if (
            product.sky_time_sales.status === 'ENDED' ||
            product.sky_time_sales.status === 'INVALID'
        ) {
            return (
                <div className="product-cart">
                    <div className="product-cart__btn">
                        <a className="button button--none">
                            {t('apply_button::Out of date')}
                        </a>
                    </div>
                </div>
            );
        }

        if (product.stock_status !== 'OUT_OF_STOCK') {
            return (
                <div className="product-cart">
                    <div className="product-cart__btn">
                        {product.__typename === 'LotteryProduct' ? (
                            <Link
                                to={resourceUrl(
                                    `/product/${
                                        product.id
                                    }/lottery-checkout/first-step`
                                )}
                                className="button button--primary"
                            >
                                {t('apply_button::Lottery Product')}
                            </Link>
                        ) : (
                            <Link
                                to={resourceUrl(
                                    `/product/${product.id}/apply/first-step`
                                )}
                                className="button button--primary"
                            >
                                {t('apply_button::Virtual Product')}
                            </Link>
                        )}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="product-cart">
                    <div className="product-cart__btn">
                        <a className={`button ${defaultClasses.outOfStockBtn}`}>
                            {t('apply_button::Out Of Stock')}
                        </a>
                    </div>
                </div>
            );
        }
    }

    return '';
};

export default ApplyButton;
