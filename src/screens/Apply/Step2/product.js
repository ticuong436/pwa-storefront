import React from 'react';
import { Link, resourceUrl } from '@skp/drivers';
import { useTranslation } from 'react-i18next';
import Moment from 'moment';

const Product = props => {
    const { product, applyOption } = props;

    const { t } = useTranslation(['checkout', 'apply']);

    const productLink = resourceUrl(`/product/${product.id}`);
    const planLabel =
        applyOption.plan == 0
            ? t('checkout::Not Requested')
            : (
                  product.apply_option.plan_resource.find(({ value }) => {
                      return value == applyOption.plan;
                  }) || {}
              ).label;

    return (
        <div className="box-cart__item row">
            <div className="col-lg-3 col-md-12 hide-xs">
                <div className="box-cart__images">
                    <Link to={productLink}>
                        <img src={product.small_image.url} alt="" />
                    </Link>
                </div>
            </div>
            <div className="col-lg-9 col-md-12 row">
                <div className="col-lg-6 col-md-12 box-cart__left step2-cart__left">
                    <div className="box-cart__images hide-pc">
                        <Link to={productLink}>
                            <img src={product.small_image.url} alt="" />
                        </Link>
                    </div>
                    <div className="box-cart__titles">
                        <h5 className="box-cart__name">
                            <Link to={productLink} className="box-cart__link">
                                {product.name}
                            </Link>
                        </h5>
                        <div className="box-cart__detail">
                            {product.service_name.label && (
                                <>
                                    <span className="box-cart__txt">
                                        {product.service_name.label}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-12 col-md-12 box-cart__form">
                    <div>
                        <div
                            className={`multiCollapse-${
                                product.id
                            } collapse show`}
                        >
                            {applyOption.plan && (
                                <div className="box-cart__view-item">
                                    <span className="box-cart__view-item--left">
                                        {t('apply::Apply Plan')}
                                    </span>
                                    <span className="box-cart__view-item--right">
                                        : {planLabel}
                                    </span>
                                </div>
                            )}

                            {applyOption.plan_date1 && (
                                <div className="box-cart__view-item">
                                    <span className="box-cart__view-item--left">
                                        {t('apply::Request For First Date')}
                                    </span>
                                    <span className="box-cart__view-item--right">
                                        :{' '}
                                        {Moment(applyOption.plan_date1).format(
                                            'YYYY/MM/DD'
                                        )}
                                    </span>
                                </div>
                            )}

                            {applyOption.plan_date2 && (
                                <div className="box-cart__view-item">
                                    <span className="box-cart__view-item--left">
                                        {t('apply::Request For Second Date')}
                                    </span>
                                    <span className="box-cart__view-item--right">
                                        :{' '}
                                        {Moment(applyOption.plan_date2).format(
                                            'YYYY/MM/DD'
                                        )}
                                    </span>
                                </div>
                            )}

                            {applyOption.plan_date3 && (
                                <div className="box-cart__view-item">
                                    <span className="box-cart__view-item--left">
                                        {t('apply::Request For Third Date')}
                                    </span>
                                    <span className="box-cart__view-item--right">
                                        :{' '}
                                        {Moment(applyOption.plan_date3).format(
                                            'YYYY/MM/DD'
                                        )}
                                    </span>
                                </div>
                            )}

                            {applyOption.plan_adult && (
                                <div className="box-cart__view-item">
                                    <span className="box-cart__view-item--left">
                                        {t('apply::Adult Person Count')}
                                    </span>
                                    <span className="box-cart__view-item--right">
                                        :{' '}
                                        {applyOption.plan_adult == 0
                                            ? t('checkout::Not Requested')
                                            : applyOption.plan_adult}
                                    </span>
                                </div>
                            )}

                            {applyOption.plan_child && (
                                <div className="box-cart__view-item">
                                    <span className="box-cart__view-item--left">
                                        {t('apply::Child Person Count')}
                                    </span>
                                    <span className="box-cart__view-item--right">
                                        :{' '}
                                        {applyOption.plan_child == 0
                                            ? t('checkout::Not Requested')
                                            : applyOption.plan_child}
                                    </span>
                                </div>
                            )}

                            {applyOption.customer_note && (
                                <div className="box-cart__view-item">
                                    <span className="box-cart__view-item--left">
                                        {t('apply::Note')}
                                    </span>
                                    <span className="box-cart__view-item--right">
                                        : {applyOption.customer_note}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
