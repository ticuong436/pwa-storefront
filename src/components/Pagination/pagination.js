import React, { useMemo } from 'react';
import { func, number, shape } from 'prop-types';
import { usePagination } from '@magento/peregrine/lib/talons/Pagination/usePagination';
import PaginationLink from './paginationLink';

const Pagination = props => {
    const { currentPage, setPage, totalPages } = props.pageControl;

    const talonProps = usePagination({
        currentPage,
        setPage,
        totalPages
    });

    const { handleNavBack, handleNavForward, tiles } = talonProps;

    const navigationTiles = useMemo(
        () =>
            tiles.map(tileNumber => {
                return (
                    <PaginationLink
                        isActive={tileNumber === currentPage}
                        key={tileNumber}
                        number={tileNumber}
                        onClick={setPage}
                    />
                );
            }),
        [currentPage, tiles, setPage]
    );

    return (
        <ul className="pagination-list">
            {totalPages > 1 && (
                <>
                    <PaginationLink number={1} onClick={handleNavBack}>
                        &lt;
                    </PaginationLink>
                    {navigationTiles}
                    <PaginationLink number={1} onClick={handleNavForward}>
                        &gt;
                    </PaginationLink>
                </>
            )}
        </ul>
    );
};

Pagination.propTypes = {
    pageControl: shape({
        currentPage: number,
        setPage: func,
        totalPages: number
    }).isRequired
};

export default Pagination;
