import React from 'react';
import logoImage from 'design/source/images/logo.png';
import { useToggleSidebarClass } from '@skp/hooks/useLayoutEffect';

const HeaderLogin = () => {
    useToggleSidebarClass(false);

    return (
        // TODO: Recheck with FE
        <div
            className="header"
            style={{ backgroundColor: 'transparent', borderBottom: 'none' }}
        >
            <div className="logo">
                <img src={logoImage} />
            </div>
        </div>
    );
};

export default HeaderLogin;
