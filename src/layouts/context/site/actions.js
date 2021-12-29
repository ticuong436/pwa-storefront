import { createActions } from 'redux-actions';

const prefix = 'SITE';

const actionTypes = [
    'SET_USE_GLOBAL_SEARCH',
    'SET_NOT_USE_GLOBAL_SEARCH',
    'SET_CURRENT_PILLAR_CODE',
    'ENABLE_MAINTENANCE_MODE'
];

export default createActions(...actionTypes, { prefix });
