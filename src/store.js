import { combineReducers, createStore } from 'redux';
import { enhancer } from '@magento/peregrine';

import app from '@magento/peregrine/lib/store/reducers/app';
import cart from '@magento/peregrine/lib/store/reducers/cart';
import { siteReducer as site } from './layouts/context/site';
import { notificationReducer as notification } from './layouts/context/notification';
import { userReducer as user } from './layouts/context/user';

const reducers = {
    app,
    site,
    cart,
    notification,
    user
};

// This is the connective layer between the Peregrine store and the
// venia-concept UI. You can add your own reducers/enhancers here and combine
// them with the Peregrine exports.
//
// example:
// const rootReducer = combineReducers({ ...reducers, ...myReducers });
// const rootEnhancer = composeEnhancers(enhancer, myEnhancer);
// export default createStore(rootReducer, rootEnhancer);
const rootReducer = combineReducers(reducers);

export default createStore(rootReducer, enhancer);
