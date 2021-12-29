import React from 'react';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useUnpaidPerod } from './useUnpaidPeriod';
import { UnpaidInfo, PaymentHistories } from '@skp/components/UnpaidPeriod';
import CardForm from '@skp/components/CreditCard/cardForm';

const UnpaidPeriod = () => {
    const {
        unpaid,
        loadingCustomer,
        handlePayUnpaid,
        submitting
    } = useUnpaidPerod();

    if (loadingCustomer) {
        return <LoadingIndicator />;
    }

    return (
        <div className="mypage">
            {unpaid.isUnpaid && (
                <>
                    <UnpaidInfo
                        amount={unpaid.unpaidMemberFee.totalAmount}
                        date={`${unpaid.unpaidMemberFee.invoiceFromDate} 〜 ${
                            unpaid.unpaidMemberFee.invoiceToDate
                        }`}
                    />
                    <CardForm
                        onCardAdded={handlePayUnpaid}
                        defaultChangeable={false}
                        forUnpaidScreen={true}
                        shouldDisableSubmit={submitting}
                    />
                </>
            )}
            <PaymentHistories />
        </div>
    );
};

export default UnpaidPeriod;
