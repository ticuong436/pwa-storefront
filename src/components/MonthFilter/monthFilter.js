import React, { useState } from 'react';
import { Link } from '@skp/drivers';
import classNames from 'classnames';

const MonthFilter = props => {
    const { currentMonth, months, url, title } = props;
    const monthOptions = [{ key: '', value: 'Unspecified' }];

    months.map(month => {
        monthOptions.push({ key: month.key, value: month.value });
    });

    const [isShowDropDown, setIsShowDropDown] = useState(false);

    const collapseClass = classNames('collapse', {
        ['show']: isShowDropDown
    });

    const menuLinkClass = classNames('side-toggle__link', {
        ['collapsed']: isShowDropDown
    });

    const monthListHTML = monthOptions.map((month, index) => {
        return (
            <li className="side-menu__item" key={index}>
                <Link
                    className={
                        currentMonth == month.key
                            ? 'side-menu__link side-menu__link--active'
                            : 'side-menu__link'
                    }
                    to={url + (month.key ? `?month=${month.key}` : '')}
                >
                    {month.value}
                </Link>
            </li>
        );
    });

    const displayMonth = monthOptions.find(month => {
        return month.key == currentMonth;
    });

    return (
        <div className="side-mobile">
            <div className="side-toggle dropdown-toggle">
                <a
                    className={menuLinkClass}
                    data-toggle="collapse"
                    aria-expanded="true"
                    onClick={e => {
                        e.preventDefault();
                        setIsShowDropDown(isShowDropDown => !isShowDropDown);
                    }}
                >
                    {displayMonth ? displayMonth.value : 'Unspecified'}
                </a>
            </div>
            <div className={collapseClass} id="multi-collapse">
                <h3 className="point-side--title">{title}</h3>
                <ul className="side-menu">
                    <ul className="side-menu">{monthListHTML}</ul>
                </ul>
            </div>
        </div>
    );
};

export default MonthFilter;
