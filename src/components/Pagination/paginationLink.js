import React, { useCallback } from 'react';
import { bool, func, number } from 'prop-types';

const PaginationLink = props => {
    const { isActive, number, onClick, children } = props;
    const handleClick = useCallback(() => {
        onClick(number);
    }, [onClick, number]);

    return (
        <li
            className={
                isActive
                    ? 'pagination-item pagination-item--active'
                    : 'pagination-item pagination-item'
            }
        >
            <a className="pagination-link cursor-pointer" onClick={handleClick}>
                {children || number}
            </a>
        </li>
    );
};

PaginationLink.propTypes = {
    isActive: bool,
    number: number,
    onClick: func
};

export default PaginationLink;
