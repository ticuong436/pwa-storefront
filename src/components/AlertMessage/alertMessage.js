import React, { useEffect } from 'react';
import {
    CheckCircle as CheckCircleIcon,
    AlertCircle as AlertCircleIcon,
    XCircle as XCircleIcon
} from 'react-feather';
import classNames from 'classnames';
import { bool, node, oneOf } from 'prop-types';

const icons = {
    info: <CheckCircleIcon />,
    warning: <AlertCircleIcon />,
    error: <XCircleIcon />
};

const AlertMessage = ({
    type,
    children,
    marginBottom = true,
    positionAbsolute = false,
    scrollToTop = false
}) => {
    const alertClass = classNames('alert-message__item ', {
        success: type == 'info',
        warning: type == 'warning',
        danger: type == 'error',
        'mb-0': marginBottom !== true,
        'position-absolute': positionAbsolute === true
    });

    useEffect(() => {
        if (scrollToTop) {
            window.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [type, children, scrollToTop]);

    return (
        <div className={alertClass}>
            <span className="alert-message__icon">{icons[type]}</span>
            <span className="alert-message__name">{children}</span>
        </div>
    );
};

AlertMessage.propTypes = {
    type: oneOf(['info', 'warning', 'error']).isRequired,
    children: node.isRequired,
    marginBottom: bool,
    positionAbsolute: bool
};

export default AlertMessage;
