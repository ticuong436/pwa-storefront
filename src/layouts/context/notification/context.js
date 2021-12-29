import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';

import actions from './actions';
import * as asyncActions from './asyncActions';
import bindActionCreators from '@magento/peregrine/lib/util/bindActionCreators';
import { useLocation } from '@skp/drivers';

const NotificationContext = createContext();

const NotificationContextProvider = props => {
    const { actions, asyncActions, state, children } = props;

    const api = useMemo(
        () => ({
            actions,
            ...asyncActions
        }),
        [actions, asyncActions]
    );

    const contextValue = useMemo(() => [state, api], [api, state]);

    // Reset notifications on route change
    const location = useLocation();
    useEffect(() => {
        api.reset();
    }, [location.pathname, api]);

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
};

const mapStateToProps = ({ notification }) => ({
    state: notification
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
    asyncActions: bindActionCreators(asyncActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationContextProvider);

export const useNotificationContext = () => useContext(NotificationContext);
