import React from 'react';
import { bool, shape, string } from 'prop-types';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import { useToggleModalClass } from '@skp/hooks/useLayoutEffect';

const Modal = props => {
    const { children, isOpen, id, title } = props;

    useToggleModalClass(isOpen);

    const rootClass = isOpen ? 'modal fade modal-customize show' : 'modal fade';

    return (
        <Portal>
            <div
                className={rootClass}
                id={id}
                style={isOpen ? { display: 'block' } : {}}
            >
                <div
                    className="modal-dialog modal-dialog--small"
                    tabIndex="-1"
                    role="document"
                    aria-labelledby="modal-step2"
                    aria-hidden="true"
                >
                    <div className="modal-customize__body">
                        {!!title && (
                            <div className="modal-customize__top">
                                <h4 className="modal-customize__title">
                                    {' '}
                                    {title}
                                </h4>
                            </div>
                        )}
                        {children}
                    </div>
                </div>
            </div>
            {isOpen && <div className="modal-backdrop fade show" />}
        </Portal>
    );
};

export default Modal;

Modal.propTypes = {
    classes: shape({
        root: string,
        root_open: string
    }),
    isOpen: bool,
    title: string
};
