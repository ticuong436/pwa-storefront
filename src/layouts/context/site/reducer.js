import { handleActions } from 'redux-actions';

import actions from './actions';

export const name = 'site';

const initialState = {
    currentPillarCode: null,
    isUsingGlobalSearch: true,
    isInMaintenanceMode: false
};

const reducerMap = {
    [actions.setUseGlobalSearch]: state => {
        if (state.isUsingGlobalSearch) {
            return state;
        }

        return {
            ...state,
            isUsingGlobalSearch: true
        };
    },
    [actions.enableMaintenanceMode]: state => {
        if (state.isInMaintenanceMode) {
            return state;
        }

        return {
            ...state,
            isInMaintenanceMode: true
        };
    },
    [actions.setNotUseGlobalSearch]: state => {
        if (!state.isUsingGlobalSearch) {
            return state;
        }

        return {
            ...state,
            isUsingGlobalSearch: false
        };
    },
    [actions.setCurrentPillarCode]: (state, { payload }) => {
        if (payload == state.currentPillarCode) {
            return state;
        }

        return {
            ...state,
            currentPillarCode: payload
        };
    }
};

export default handleActions(reducerMap, initialState);
