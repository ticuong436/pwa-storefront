import React from 'react';
import MyPageLayout from '@skp/components/MyPageLayout';
import BookingDetail from '@skp/components/BookingHotelDetail';
import { useTranslation } from 'react-i18next';

const BookingHotelDetail = () => {
    const { t } = useTranslation(['navigation']);
    return (
        <MyPageLayout
            pageTitle={t('navigation::My Bookings')}
            useDefaultBreadcrumbs={false}
        >
            <BookingDetail />
        </MyPageLayout>
    );
};

export default BookingHotelDetail;
