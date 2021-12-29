import React from 'react';
import Product from './product';
import { Form } from 'informed';
import { useStep1 } from './useStep1';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useParams, resourceUrl } from '@skp/drivers';
import MainPageTitle from '@skp/components/MainPageTitle';
import { useTranslation } from 'react-i18next';
import AlertMessage from '@skp/components/AlertMessage';

const Step1 = () => {
    const { product_id: productId } = useParams();

    const {
        shouldShowLoadingIndicator,
        product,
        handleSubmit,
        state
    } = useStep1({
        productId
    });

    const { t } = useTranslation(['checkout', 'apply']);

    if (shouldShowLoadingIndicator) {
        return <LoadingIndicator />;
    }

    if (!product) {
        return (
            <AlertMessage type="warning">
                {t("checkout::Can't find product")}
            </AlertMessage>
        );
    }

    if (product.is_applied_virtual_product) {
        return (
            <ErrorView>
                <h1>{t('checkout::The product has been applied')}</h1>
            </ErrorView>
        );
    }

    return (
        <Form onSubmit={handleSubmit} initialValues={state || {}}>
            <div className="apply-step1">
                <MainPageTitle
                    title={t('apply::Application')}
                    link={{
                        url: resourceUrl(`/product/${productId}`),
                        title: t('checkout::Back to detail')
                    }}
                />
                <div className="checkout-step">
                    <div className="order-shipping">
                        <p className="order--step">
                            {t('checkout::Step {{step}}', { step: 1 })}
                        </p>
                        <h2 className="order--title">
                            {t('apply::Apply Options')}
                        </h2>
                        <div className="reg-list order-box">
                            <div className="reg-hexagon order-item reg-hexagon-active">
                                <span className="reg-text">1</span>
                            </div>
                            <div className="reg-hexagon order-item">
                                <span>2</span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-9 col-md-12 checkout-left">
                            <MainPageTitle
                                title={t('apply::Select Your Apply Detail')}
                            />
                            <div className="box-cart">
                                <Product item={product} />
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-12">
                            <div className="total-cart">
                                <div className="total-cart__top">
                                    <p className="total-cart__item txt-semibold">
                                        <span className="total-cart__name">
                                            {t('checkout::Order Detail')}
                                        </span>
                                        <span className="total-cart__value">
                                            1 {t('checkout::Item')}
                                        </span>
                                    </p>
                                </div>
                                <div className="total-cart__middle">
                                    <div className="mt-4">
                                        <button
                                            className="button button--primary button--full"
                                            type="submit"
                                        >
                                            {t('apply::PROCEED TO CONFIRM')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    );
};

export default Step1;
