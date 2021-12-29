import React from 'react';
import { useConfirmation } from './useConfirmation';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { resourceUrl, Redirect, useParams } from '@skp/drivers';
import { useTranslation } from 'react-i18next';
import Product from '@skp/screens/Apply/Step2/product';
import MainPageTitle from '@skp/components/MainPageTitle';

const Confirmation = () => {
    const { product_id: productId } = useParams();
    const { t } = useTranslation(['checkout', 'apply']);

    const {
        shouldShowLoadingIndicator,
        product,
        applyData,
        applyOption
    } = useConfirmation({
        productId
    });

    if (!applyData) {
        return <Redirect to={resourceUrl('/')} />;
    }

    if (shouldShowLoadingIndicator) {
        return <LoadingIndicator />;
    }

    return (
        <div className="checkout-wrap">
            <div className="confir-checkout">
                <MainPageTitle title={t('apply::Applied')} />
                <div className="order-shipping">
                    <p className="order--step">
                        {t('checkout::APPLY PLACED')}: {applyData.created_at}
                    </p>
                    <h2 className="order--title confir-order--title">
                        {t('apply::Application ID')} : {applyData.apply_number}
                    </h2>
                    <div className="order--des-wrap">
                        <p className="order--des">
                            {t(
                                'checkout::Thank You for your application with Sky Premium.'
                            )}
                        </p>
                        <p className="order--des">
                            {t(
                                'checkout::We are currently processing your application. You will receive updates via email on your order status once your item(s) have been shipped'
                            )}
                        </p>
                    </div>
                </div>
                <div className="">
                    <div className="">
                        <div className="">
                            <div className="text-center">
                                <a className="confir-btn--link">
                                    {t('checkout::Processing')}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="checkout-step__address">
                    <MainPageTitle title={t('apply::Application Summary')} />
                </div>

                <div className="box-cart">
                    <Product product={product} applyOption={applyOption} />
                </div>
            </div>
        </div>
    );
};

export default Confirmation;
