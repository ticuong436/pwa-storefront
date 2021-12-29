import { useQuery, useMutation } from '@apollo/react-hooks';
import GET_BOOKING_DETAIL from './bookingDetail.graphql';
import CANCEL_ROOM from './cancelRoom.graphql';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export const useBookingDetail = id => {
    const { t } = useTranslation(['hotel', 'common']);

    // Fetch the data using apollo react hooks
    const { data, error, loading, refetch } = useQuery(GET_BOOKING_DETAIL, {
        fetchPolicy: 'no-cache',
        variables: { id }
    });

    const [, { setInfo, setError }] = useNotificationContext();

    const bookingDetail = data ? data.getBookingDetail : {};

    const [cancelRoom, { loading: isCancelingRequest }] = useMutation(
        CANCEL_ROOM
    );

    const [isShowPopupConfirm, setShowPopupConfirm] = useState(false);

    const handleCancelRequest = async id => {
        try {
            const { data } = await cancelRoom({
                variables: { id }
            });

            if (data.isSuccess) {
                setInfo(t('hotel::Booking cancelled successfully'));
                refetch();
            } else {
                setError(t('common::Something went wrong!'));
            }
        } catch (deleteError) {
            setError(t('common::Something went wrong!'));
        } finally {
            setShowPopupConfirm(false);
        }
    };

    return {
        handleCancelRequest,
        isCancelingRequest,
        bookingDetail,
        error,
        isShowPopupConfirm,
        setShowPopupConfirm,
        loading
    };
};
