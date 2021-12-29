import React from 'react';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import { useToggleModalClass } from '@skp/hooks/useLayoutEffect';

const Popup = props => {
    const { children, isOpen } = props;

    useToggleModalClass(isOpen);

    if (!isOpen) {
        return null;
    }

    return (
        <Portal>
            <div
                className="modal modal-customize fade modal-custom show"
                id="modal-credit-card"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="modal-credit-card"
                aria-hidden="true"
                style={isOpen ? { display: 'block' } : {}}
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-customize__body">
                        <div className="modal-customize__top">
                            <h2 className="modal-customize__title">
                                新しいクレジットカードを追加
                            </h2>
                            <span className="modal-customize__note">*必須</span>
                        </div>
                        <div className="modal-customize__info">
                            <div className="credit-shipping">{children}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" />
        </Portal>
    );
};

export default Popup;
