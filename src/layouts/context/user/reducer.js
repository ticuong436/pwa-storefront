import { handleActions } from 'redux-actions';

import actions from './actions';
import { checkValidToken, getToken } from './utils';

export const name = 'user';

const initialState = {
    currentUser: {
        email: '',
        firstname: '',
        lastname: '',
        fullname: '',
        group: '',
        group_id: '',
        group_image: '',
        skyPoints: {
            total: 0
        },
        profile_alert_flag: null,
        can_register_platinum_partner: null,
        is_registering: null,
        is_inactive: null,
        wishlist_id: null,
        is_multiplay: null
    },
    getDetailsError: null,
    isGettingDetails: false,
    isSignedIn: checkValidToken(),
    token: getToken()
};

const reducerMap = {
    [actions.setToken]: (state, { payload }) => {
        return {
            ...state,
            isSignedIn: true,
            token: payload
        };
    },
    [actions.clearToken]: state => {
        return {
            ...state,
            isSignedIn: false,
            token: null
        };
    },
    [actions.getDetails.request]: state => {
        return {
            ...state,
            getDetailsError: null,
            isGettingDetails: true
        };
    },
    [actions.getDetails.receive]: (state, { payload, error }) => {
        if (error) {
            return {
                ...state,
                getDetailsError: payload,
                isGettingDetails: false
            };
        }

        return {
            ...state,
            currentUser: payload,
            getDetailsError: null,
            isGettingDetails: false
        };
    },
    [actions.reset]: () => {
        return {
            ...initialState,
            isSignedIn: false,
            token: null
        };
    }
};

export default handleActions(reducerMap, initialState);
