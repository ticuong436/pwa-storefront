import React from 'react';
import { bool, string } from 'prop-types';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import { useToggleModalClass } from '@skp/hooks/useLayoutEffect';

const Dialog = props => {
    const { children, isOpen, title } = props;
    useToggleModalClass(isOpen);

    const rootClass = isOpen
        ? 'modal modal-customize fade modal-custom show'
        : 'modal modal-customize fade modal-custom';

    if (!isOpen) {
        return null;
    }

    return (
        <Portal>
            <div className="pt-5 mt-5 mt-auto">
                <div
                    className={rootClass}
                    id="modal-shipping-address"
                    aria-labelledby="modal-shipping-address"
                    tabIndex="-1"
                    role="dialog"
                    aria-hidden="true"
                    style={isOpen ? { display: 'block' } : {}}
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-customize__body">
                            <div className="modal-customize__top">
                                <h2 className="modal-customize__title">
                                    {title}
                                </h2>
                                <p className="modal-customize__sub">
                                    日本語で入力ください
                                </p>
                                <span className="modal-customize__note">
                                    *必須
                                </span>
                            </div>
                            <div className="modal-customize__info">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && <div className="modal-backdrop fade show" />}
        </Portal>
    );
};

export default Dialog;

Dialog.propTypes = {
    isOpen: bool,
    title: string
};
