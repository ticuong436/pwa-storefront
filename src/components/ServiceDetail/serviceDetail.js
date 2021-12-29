import React from 'react';
import { useParams, Redirect, resourceUrl } from '@skp/drivers';
import { useServiceDetail } from './useServiceDetail';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useTranslation } from 'react-i18next';
import { is404Error } from '@skp/utils/graphqlError';
import { useReceiptPdf } from '@skp/hooks/useReceiptPdf';
import thumb_nail from "design/dest/images/original_6.jpg"
export default function ServiceDetail() {
    const { id } = useParams();
    const { serviceDetail, error, loading } = useServiceDetail(id);

    const { downloading: downloadingPdf, downloadPdf } = useReceiptPdf();

    const { t } = useTranslation(['mypage', 'apply', 'order_status']);

    if (is404Error(error)) {
        return <Redirect to={resourceUrl('/not-found')} />;
    }

    if (error && !loading) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
        return <div>Data Fetch Error</div>;
    }

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <div className="service-detail">
            <div className="service-detail__top">
                <h3 className="service-detail__title">
                    {serviceDetail.item.service_name}
                </h3>
                <p className="service-detail__sub">
                    {t('apply::Application ID')} {serviceDetail.order_number}
                </p>
                {serviceDetail.can_download_receipt ? (
                    <p className="txt-right">
                        <button
                            className="print-order-detail table-customize__link"
                            disabled={downloadingPdf}
                            onClick={e => {
                                e.preventDefault();
                                downloadPdf('SERVICE', id);
                            }}
                        >
                            {t('mypage::Issue Receipt')}
                        </button>
                    </p>
                ) : (
                    ''
                )}
            </div>
            <div className="service-detail__content">
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <div className="service-detail__left">
                            <div className="service-detail--name">
                                {t('apply::Booking made on')}{' '}
                                {serviceDetail.created_at}
                            </div>
                            <div className="service-detail__images">
                                {serviceDetail.item.thumbnail && (
                                    <img
                                        src={serviceDetail.item.thumbnail}
                                        alt="img"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="service-detail__right">
                            <div className="service-box">
                                <p className="service-box--title">
                                    {t('mypage::STATUS')}
                                </p>
                                <p className="service-box--text">
                                    {t('order_status::' + serviceDetail.status)}
                                </p>
                            </div>
                            <div className="service-box">
                                <p className="service-box--title">
                                    {t('apply::Apply Plan')}
                                </p>
                                <p className="service-box--text">
                                    {serviceDetail.item.plan_name}
                                </p>
                            </div>
                            <div className="service-box">
                                <p className="service-box--title">
                                    {t('apply::Service Date')}
                                </p>
                                <p className="service-box--text">
                                    {serviceDetail.item.service_date}
                                </p>
                            </div>
                            <div className="service-box">
                                <p className="service-box--title">
                                    {t('apply::Service Fee')}
                                </p>
                                <p className="service-box--text">
                                    {serviceDetail.item.service_fee
                                        ? serviceDetail.item.service_fee
                                        : '-'}
                                </p>
                            </div>
                            <div className="service-box">
                                <p className="service-box--title">
                                    {t('mypage::SKY POINTS EARNED')}
                                </p>
                                <p className="service-box--text">
                                    {serviceDetail.skypoint_earned !== null
                                        ? serviceDetail.skypoint_earned
                                        : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
