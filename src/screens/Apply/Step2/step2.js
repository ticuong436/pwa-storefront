import React from 'react';
import { useStep2 } from './useStep2';
import { Form } from 'informed';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { Link, resourceUrl, Redirect, useParams } from '@skp/drivers';
import { useTranslation } from 'react-i18next';
import Product from './product';
import AlertMessage from '@skp/components/AlertMessage';
import { getErrorMessage } from '@skp/utils/graphqlError';
import MainPageTitle from '@skp/components/MainPageTitle';

const Step2 = () => {
    const { product_id: productId } = useParams();

    const {
        shouldShowLoadingIndicator,
        product,
        handleSubmit,
        isApplying,
        applyError,
        applyOption
    } = useStep2({
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

    if (!applyOption) {
        return (
            <Redirect
                to={resourceUrl(`/product/${product.id}/apply/first-step`)}
            />
        );
    }

    return (
        <Form onSubmit={handleSubmit}>
            <div className="checkout-wrap">
                <div className="">
                    <div className="checkout-edit-box">
                        <div>
                            <MainPageTitle title={t('apply::Application')}>
                                <Link
                                    to={{
                                        pathname: resourceUrl(
                                            `/product/${productId}/apply/first-step`
                                        ),
                                        state: {
                                            ...applyOption
                                        }
                                    }}
                                    className="main-content__link"
                                >
                                    {t('apply::Back to Apply Detail')}
                                </Link>
                            </MainPageTitle>
                        </div>
                    </div>
                    <div className="order-shipping">
                        <p className="order--step">
                            {t('checkout::Step {{step}}', { step: 2 })}
                        </p>
                        <h2 className="order--title">
                            {t('apply::Review Your Application')}
                        </h2>
                        <div className="reg-list order-box">
                            <div className="reg-hexagon order-item reg-hexagon-active">
                                <span>1</span>
                            </div>
                            <div className="reg-hexagon order-item reg-hexagon-active">
                                <span className="reg-text">2</span>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-9 col-md-12 checkout-left">
                            <div className="">
                                <div className="">
                                    <MainPageTitle
                                        title={t('apply::Application Summary')}
                                    />
                                    <div className="box-cart">
                                        <Product
                                            product={product}
                                            applyOption={applyOption}
                                        />
                                    </div>
                                </div>
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
                                    {isApplying && <LoadingIndicator />}
                                    {applyError && (
                                        <AlertMessage type="error">
                                            {getErrorMessage(applyError)}
                                        </AlertMessage>
                                    )}
                                    <div className="total-cart__btn">
                                        <button
                                            type="submit"
                                            disabled={isApplying}
                                            className="button button--primary button--full"
                                        >
                                            {t('checkout::SUBMIT')}
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

export default Step2;
