import React from 'react';
import MyPageLayout from '@skp/components/MyPageLayout';
import BookingList from '@skp/components/BookingList';
import { useTranslation } from 'react-i18next';

const BookingHistory = () => {
    const { t } = useTranslation(['navigation']);

    return (
        <MyPageLayout pageTitle={t('navigation::My Bookings')}>
            <div className="col-md-12">
                <BookingList />
            </div>
        </MyPageLayout>
    );
};

export default BookingHistory;
