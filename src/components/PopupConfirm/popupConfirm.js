import React from 'react';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import { useToggleModalClass } from '@skp/hooks/useLayoutEffect';
import LoadingIndicator from '@skp/components/LoadingIndicator';

const PopupConfirm = props => {
    const {
        title = '',
        isOpen,
        onCancel,
        onConfirm,
        isLoading,
        size = 'small',
        description = ''
    } = props;

    useToggleModalClass(isOpen);

    const rootClass = isOpen
        ? 'modal fade modal-customize show'
        : 'modal fade modal-customize';

    return (
        <Portal>
            <div
                className={rootClass}
                id="modal-confirm"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="modal-confirm"
                aria-hidden="true"
                style={isOpen ? { display: 'block' } : {}}
            >
                <div
                    className={`modal-dialog ${
                        size === 'small' ? 'modal-dialog--small' : ''
                    }`}
                    role="document"
                >
                    <div className="modal-customize__body">
                        <div className="modal-customize__info">
                            {title}

                            {description}
                            {isLoading && <LoadingIndicator global={true} />}
                            <div className="modal-confirm">
                                <div className="modal-confirm__btn">
                                    <button
                                        className="button btn-block button--primary"
                                        disabled={isLoading}
                                        onClick={onConfirm}
                                    >
                                        はい
                                    </button>
                                </div>
                                {onCancel && (
                                    <div className="modal-confirm__btn">
                                        <button
                                            className="button btn-block"
                                            onClick={onCancel}
                                        >
                                            キャンセル
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && <div className="modal-backdrop fade show" />}
        </Portal>
    );
};

export default PopupConfirm;
