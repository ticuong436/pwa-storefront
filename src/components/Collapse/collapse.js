import React, { useState } from 'react';
import { shape, string } from 'prop-types';
import classNames from 'classnames';

const Collapse = props => {
    const { children, title, classes } = props;
    const [isShow, setIsShow] = useState(false);
    const collapseClass = classNames('', {
        ['d-none']: !isShow
    });

    return (
        <div className="fill">
            <a
                className={`fill--title ${classes ? classes.title : ''}`}
                data-toggle="collapse"
                href="#multi-collapse"
                role="button"
                onClick={e => {
                    e.preventDefault();
                    setIsShow(!isShow);
                }}
            >
                {title}
            </a>
            <div className={`col ${classes ? classes.content : ''}`}>
                <div className={collapseClass}>{children}</div>
            </div>
        </div>
    );
};

export default Collapse;

Collapse.propTypes = {
    classes: shape({
        title: string,
        content: string
    }),
    title: string
};
