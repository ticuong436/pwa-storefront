import { handleActions } from 'redux-actions';

import actions from './actions';

const initialState = {
    error: '',
    info: ''
};

const reducerMap = {
    [actions.setInfo]: (state, { payload }) => {
        if (payload == state.info) {
            return state;
        }

        return {
            ...state,
            info: payload
        };
    },
    [actions.setError]: (state, { payload }) => {
        if (payload == state.error) {
            return state;
        }

        return {
            ...state,
            error: payload
        };
    },
    [actions.reset]: state => {
        if (!state.error && !state.info) {
            return state;
        }

        return {
            ...state,
            ...initialState
        };
    }
};

export default handleActions(reducerMap, initialState);
