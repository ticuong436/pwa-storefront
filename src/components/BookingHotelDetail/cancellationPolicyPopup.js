import React from 'react';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import { useToggleModalClass } from '@skp/hooks/useLayoutEffect';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import classNames from 'classnames';

const CancellationPolicyPopup = props => {
    const {
        isOpen,
        onConfirm,
        isLoading,
        size = 'small',
        bookingDetail
    } = props;

    useToggleModalClass(isOpen);

    const showClass = classNames('modal fade modal-customize ', {
        show: isOpen == true,
        'd-block': isOpen == true
    });

    return (
        <Portal>
            <div
                className={showClass}
                id="modal-confirm"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="modal-confirm"
                aria-hidden="true"
            >
                <div
                    className={`modal-dialog ${
                        size === 'small' ? 'modal-dialog--small' : ''
                    }`}
                    role="document"
                >
                    <div className="modal-customize__body">
                        <div className="modal-customize__info">
                            <div className="modal-customize__des text-center mb-3">
                                <h1>キャンセルポリシー</h1>
                            </div>
                            <div
                                className="mt-4 mb-2"
                                dangerouslySetInnerHTML={{
                                    __html: bookingDetail.cancel_policy
                                }}
                            />
                            {isLoading && <LoadingIndicator global={true} />}
                            <div className="modal-confirm">
                                <div className="modal-confirm__btn">
                                    <a
                                        className="button button--primary"
                                        href="#"
                                        disabled={isLoading}
                                        onClick={e => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (isLoading) {
                                                return;
                                            }
                                            onConfirm();
                                        }}
                                    >
                                        OK
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && <div className="modal-backdrop fade show" />}
        </Portal>
    );
};

export default CancellationPolicyPopup;
