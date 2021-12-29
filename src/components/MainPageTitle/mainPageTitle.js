import React from 'react';
import { shape, string } from 'prop-types';
import { Link } from '@skp/drivers';

function MainPageTitle({ title, link, children }) {
    return (
        <div className="main-content__top">
            <h2 className="main-content__title">{title}</h2>
            {link && (
                <Link to={link.url} className="main-content__link">
                    {link.title}
                </Link>
            )}
            {children}
        </div>
    );
}

MainPageTitle.propTypes = {
    title: string.isRequired,
    link: shape({
        url: string.isRequired,
        title: string.isRequired
    })
};

export default MainPageTitle;
