import React from 'react';
import simplePaginationCss from './simplePagination.css';

const SimplePagination = ({ nextPage, previousPage, currentPage, hasMore }) => {
    return (
        <div className="pagination float-right simple-pagination">
            <ul className="pagination-list">
                <li
                    className={`pagination-item pagination-item cursor-pointer ${
                        simplePaginationCss.simplePagination
                    }`}
                    onClick={() => {
                        if (currentPage == 1) {
                            return;
                        }
                        previousPage();
                    }}
                >
                    <a className="pagination-link">&lt;</a>
                </li>
                <li
                    className={`pagination-item pagination-item cursor-pointer ${
                        simplePaginationCss.simplePagination
                    }`}
                    onClick={() => {
                        if (!hasMore) {
                            return;
                        }
                        nextPage();
                    }}
                >
                    <a className="pagination-link">&gt;</a>
                </li>
            </ul>
        </div>
    );
};

export default SimplePagination;
