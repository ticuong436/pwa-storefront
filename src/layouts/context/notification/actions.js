import { createActions } from 'redux-actions';

const prefix = 'MESSAGE';
const actionTypes = ['SET_INFO', 'SET_ERROR', 'RESET'];

export default createActions(...actionTypes, { prefix });
