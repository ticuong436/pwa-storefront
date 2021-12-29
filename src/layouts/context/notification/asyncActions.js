import actions from './actions';

export const setInfo = message => async dispatch =>
    dispatch(actions.setInfo(message));

export const clearInfo = () => async dispatch => dispatch(actions.setInfo(''));

export const setError = message => async dispatch =>
    dispatch(actions.setError(message));

export const clearError = () => async dispatch =>
    dispatch(actions.setError(''));

export const reset = () => async dispatch => dispatch(actions.reset());
