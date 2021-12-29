import React, { useState } from 'react';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import { useToggleModalClass } from '@skp/hooks/useLayoutEffect';
import LoadingIndicator from '@skp/components/LoadingIndicator';

const CancelBookingPopup = props => {
    const { isOpen, onCancel, onConfirm, isLoading } = props;
    const [activeConfirmButton, setActiveConfirmButton] = useState(false);

    useToggleModalClass(isOpen);

    const rootClass = isOpen ? 'modal fade modal-customize show' : 'modal fade';

    return (
        <Portal>
            <div
                className={rootClass}
                id="modal-cancel"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="modal-confirm"
                aria-hidden="true"
                style={isOpen ? { display: 'block' } : {}}
            >
                <div
                    className="modal-dialog modal-dialog--small"
                    tabIndex={-1}
                    role="document"
                    aria-labelledby="modal-step2"
                    aria-hidden="true"
                >
                    <div className="modal-customize__body">
                        <div className="modal-customize__top">
                            <h4 className="modal-customize__title">
                                Do you want to cancel your reservation?
                            </h4>
                        </div>
                        {isLoading && <LoadingIndicator global={true} />}
                        <div className="modal-body">
                            <div className="modal-customize__block">
                                <div
                                    className="flex-horizontal"
                                    style={{ width: '600px', margin: 'auto' }}
                                >
                                    <div className="control">
                                        <input
                                            className="modal-customize-box--checkbox-cancel-booking"
                                            type="checkbox"
                                            id="mod-box"
                                            onClick={e => {
                                                if (e.target.checked) {
                                                    setActiveConfirmButton(
                                                        true
                                                    );
                                                } else {
                                                    setActiveConfirmButton(
                                                        false
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="modal-customize__des">
                                        The hotel's cancellation policy, which you agreed to at the time of booking, will apply to your refund.
                                        <br />
                                        If there is a refund, it will be refunded to the payment card at the time of booking.
                                    </div>
                                </div>
                            </div>
                            <div className="modal-confirm">
                                <div className="modal-confirm__btn">
                                    <button
                                        className="button btn-block button--primary"
                                        type="button"
                                        disabled={
                                            activeConfirmButton == false ||
                                            isLoading
                                        }
                                        onClick={onConfirm}
                                    >
                                        Cancel this reservation
                                    </button>
                                </div>
                                <div className="modal-confirm__btn">
                                    <button
                                        className="button btn-block"
                                        type="button"
                                        data-dismiss="modal"
                                        onClick={onCancel}
                                    >
                                        キャンセル
                                    </button>
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

export default CancelBookingPopup;
