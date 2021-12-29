import React from 'react';

const ItemPerPage = props => {
    const { listItems, pageSize, setPageSize } = props;

    return (
        <div className="pagination-choose">
            <span>Show</span>
            <div className="control">
                {/* eslint-disable-next-line jsx-a11y/no-onchange */}
                <select
                    className="pagination-select"
                    value={pageSize}
                    onChange={e => setPageSize(e.target.value)}
                >
                    {listItems.map(item => (
                        <option value={item} key={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>
            <span>per page</span>
        </div>
    );
};

export default ItemPerPage;
