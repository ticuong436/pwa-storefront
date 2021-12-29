import GET_RECEIPT_PDF_URL from './getReceiptPdfUrl.graphql';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { useState } from 'react';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { useTranslation } from 'react-i18next';

export const useReceiptPdf = () => {
    const [, { setError }] = useNotificationContext();
    const { t } = useTranslation(['common']);
    const [downloading, setDownloading] = useState(false);
    const getUrlDownloadPdf = useAwaitQuery(GET_RECEIPT_PDF_URL);
    const downloadPdf = async (type, relatedItem) => {
        setDownloading(true);

        try {
            const result = await getUrlDownloadPdf({
                fetchPolicy: 'no-cache',
                variables: {
                    type: type,
                    relatedItem
                }
            });

            const urlDownloadPdf = result.data ? result.data.url : '';

            if (urlDownloadPdf) {
                const link = document.createElement('a');
                link.href = urlDownloadPdf;
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        } catch (error) {
            setError(t('common::Cannot download receipt'));
            console.error(error);
        }

        setDownloading(false);
    };

    return {
        downloading,
        downloadPdf
    };
};
