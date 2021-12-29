import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { connect } from 'react-redux';

import actions from './actions';
import * as asyncActions from './asyncActions';
import bindActionCreators from '@magento/peregrine/lib/util/bindActionCreators';
import GET_CUSTOMER_QUERY from './getCurrentCustomer.graphql';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';

const UserContext = createContext();

const UserContextProvider = props => {
    const { actions, asyncActions, children, userState } = props;

    const userApi = useMemo(
        () => ({
            actions,
            ...asyncActions
        }),
        [actions, asyncActions]
    );

    const contextValue = useMemo(() => [userState, userApi], [
        userApi,
        userState
    ]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

const mapStateToProps = ({ user }) => ({ userState: user });

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
    asyncActions: bindActionCreators(asyncActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserContextProvider);

export const useUserContext = () => useContext(UserContext);

export const useUserContextQuery = () => {
    const [, { getUserDetails, getUserDetailsInBackground }] = useUserContext();
    const fetchUserDetails = useAwaitQuery(GET_CUSTOMER_QUERY);
    const userContextFetchDetails = useCallback(
        async (loadInBackground = false) => {
            if (loadInBackground) {
                return getUserDetailsInBackground({ fetchUserDetails });
            }

            return getUserDetails({ fetchUserDetails });
        },
        [fetchUserDetails, getUserDetails, getUserDetailsInBackground]
    );

    return { userContextFetchDetails };
};
