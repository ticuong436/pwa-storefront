import React from 'react';
import { useToasts } from '@magento/peregrine';
import AlertMessage from '@skp/components/AlertMessage';

/**
 * Override style for @magento/venia-ui/lib/components/ToastContainer/toastContainer.js
 * A container for toast notifications.
 *
 * This component must be a child, nested or otherwise, of a
 * ToastContextProvider component.
 *
 */
const Container = () => {
    const [{ toasts }] = useToasts();

    // Given a map of toasts each with a property "timestamp", sort and display
    // based on the timestamp.
    const sortByTimestamp = ([, toastA], [, toastB]) =>
        toastA.timestamp - toastB.timestamp;

    const toastElements = Array.from(toasts)
        .sort(sortByTimestamp)
        .map(([id, toast]) => {
            const key = toast.isDuplicate ? Math.random() : id;

            return (
                <AlertMessage key={key} type={toast.type}>
                    {toast.message}
                </AlertMessage>
            );
        });

    return (
        <div
            id="toast-root"
            className="alert-message alert-customize alert-customize--bottom"
        >
            {toastElements}
        </div>
    );
};

export default Container;
