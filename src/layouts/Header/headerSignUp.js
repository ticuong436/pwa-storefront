import React from 'react';
import { Link, resourceUrl } from '@skp/drivers';
import logoImage from 'design/source/images/logo-registration.svg';
import { useToggleSidebarClass } from '@skp/hooks/useLayoutEffect';

const HeaderSignUp = () => {
    useToggleSidebarClass(false);

    return (
        <header className="header header--registration">
            <div className="container">
                <div className="header__inner">
                    <h1 className="header__logo">
                        <Link to={resourceUrl('/login')}>
                            <img src={logoImage} />
                        </Link>
                    </h1>
                </div>
            </div>
        </header>
    );
};

export default HeaderSignUp;
