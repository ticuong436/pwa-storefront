import LoadingIndicator from '@skp/components/LoadingIndicator';
import React from 'react';
import { SimplePagination } from '@skp/components/SimplePagination';
import { usePaymentHistories } from './usePaymentHistories';
import MainPageTite from '@skp/components/MainPageTitle';
import AlertMessage from '@skp/components/AlertMessage';
import { useTranslation } from 'react-i18next';
import TargetBlankLink from '@skp/components/TargetBlankLink';
import defaultClasses from './paymentHistory.module.css';

const PaymentHistories = () => {
    const {
        loadingHistories,
        histories,
        has_more,
        current_page,
        errorLoadingHistories,
        changePageLoading,
        changePage
    } = usePaymentHistories();
    const { t } = useTranslation(['mypage']);

    if (loadingHistories || changePageLoading) {
        return <LoadingIndicator />;
    }

    return (
        <>
            <MainPageTite title="Payment History" />
            <div className="table-responsive skypoint-pc">
                <table className="table mypage-table">
                    <thead className="txt-center">
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Content</th>
                            <th scope="col">Period</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Status</th>
                            <th scope="col" />
                        </tr>
                    </thead>
                    <tbody className="txt-center">
                        {histories && histories.length ? (
                            histories.map(v => {
                                return (
                                    <tr key={v.id}>
                                        <td>{v.date}</td>
                                        <td>{t(v.title)}</td>
                                        <td>{v.content}</td>
                                        <td>{v.amount}</td>
                                        <td>{v.status}</td>
                                        <td>
                                            {v.invoice_page_url != null && (
                                                <TargetBlankLink
                                                    className="table-customize__link"
                                                    href={v.invoice_page_url}
                                                >
                                                    {t('mypage::Issue Receipt')}
                                                </TargetBlankLink>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5}>
                                    {t('mypage::There is no payment history')}
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>

            <div className="mobile-order">
                {histories && histories.length > 0 ? (
                    histories.map(v => {
                        return (
                            <div className="mobile-list" key={v.id}>
                                <div className="mobile-list-block">
                                    <div className="mobile-list-content">
                                        <div className="mobile-item w-60p">
                                            <span className="mobile--title">
                                                Date
                                            </span>
                                            <span className="mobile--text">
                                                {v.date}
                                            </span>
                                        </div>
                                        <div className="mobile-item w-40p">
                                            <span className="mobile--title">
                                                Period
                                            </span>
                                            <span className="mobile--text">
                                                {v.content}
                                            </span>
                                        </div>
                                        <div className="mobile-item w-60p">
                                            <span className="mobile--title">
                                                Content
                                            </span>
                                            <span className="mobile--text">
                                                {t(v.title)}
                                            </span>
                                        </div>
                                        <div className="mobile-item w-40p">
                                            <span className="mobile--title">
                                                Amount
                                            </span>
                                            <span className="mobile--text">
                                                {v.amount}
                                            </span>
                                        </div>
                                        <div className="mobile-item w-60p">
                                            <span className="mobile--title">
                                                Status
                                            </span>
                                            <span className="mobile--text">
                                                {v.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className={`${
                                            defaultClasses.mobileItemAction
                                        }`}
                                    >
                                        {v.invoice_page_url != null && (
                                            <TargetBlankLink
                                                className="table-customize__link"
                                                href={v.invoice_page_url}
                                            >
                                                {t('mypage::Issue Receipt')}
                                            </TargetBlankLink>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <AlertMessage type="warning">
                        {t('mypage::There is no payment history')}
                    </AlertMessage>
                )}
            </div>

            {(current_page == 1 && !has_more) ||
                (!errorLoadingHistories && (
                    <SimplePagination
                        nextPage={() => changePage(current_page)}
                        previousPage={() => changePage(current_page, false)}
                        currentPage={current_page}
                        hasMore={has_more}
                    />
                ))}
        </>
    );
};

export default PaymentHistories;
