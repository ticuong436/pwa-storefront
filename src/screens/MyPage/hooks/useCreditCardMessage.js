import { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useNotificationContext } from '@skp/layouts/context/notification';
import GET_CREDIT_CARD_MESSAGE from '@skp/screens/MyPage/graphql/getCreditCardMessage.graphql';

export const useCreditCardMessage = () => {
    const [, { setError }] = useNotificationContext();

    const { data = {} } = useQuery(GET_CREDIT_CARD_MESSAGE, {
        fetchPolicy: 'no-cache'
    });
    const messageFromQuery = data.customerCreditCardMessage || '';

    useEffect(() => {
        const showMessage = message => {
            // Timeout to make call after notification was reseted when route change
            // in src/layouts/context/notification/context.js
            return setTimeout(() => {
                setError(message);
            }, 300);
        };

        let timer = null;
        if (messageFromQuery) {
            timer = showMessage(messageFromQuery);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [messageFromQuery, setError]);
};
