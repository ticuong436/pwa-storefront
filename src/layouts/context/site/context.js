import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';

import actions from './actions';
import * as asyncActions from './asyncActions';
import bindActionCreators from '@magento/peregrine/lib/util/bindActionCreators';
import { useLocation } from '@skp/drivers';

const SiteContext = createContext();

const SiteContextProvider = props => {
    const { actions, state, asyncActions, children } = props;

    const api = useMemo(
        () => ({
            actions,
            ...asyncActions
        }),
        [actions, asyncActions]
    );

    const contextValue = useMemo(() => [state, api], [api, state]);

    // Reset on route change
    const location = useLocation();
    useEffect(() => {
        api.actions.setCurrentPillarCode('');
        api.actions.setUseGlobalSearch();
    }, [location.pathname, api]);

    return (
        <SiteContext.Provider value={contextValue}>
            {children}
        </SiteContext.Provider>
    );
};

const mapStateToProps = ({ site }) => ({ state: site });

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
    asyncActions: bindActionCreators(asyncActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SiteContextProvider);

export const useSiteContext = () => useContext(SiteContext);
