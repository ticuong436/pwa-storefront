import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';

import { RetryLink } from 'apollo-link-retry';
import MutationQueueLink from '@adobe/apollo-link-mutation-queue';
import app from '@magento/peregrine/lib/store/actions/app';
import { Util } from '@magento/peregrine';
import { Adapter } from './drivers';
import store from './store';
import siteActions from './layouts/context/site/actions';
import { signOut } from './layouts/context/user/asyncActions';
import { removeCart } from '@magento/peregrine/lib/store/actions/cart';
import { isAuthError } from './utils/graphqlError';
import MainApp, { AppContextProvider } from './layouts';
import { isRunningInWebview, sendEventToWebview } from './utils/webview';

// TODO: do we need service worker?
// import { registerSW } from './registerSW';
import 'design/dest/css/main.css';
import './index.css';

const { BrowserPersistence } = Util;
const apiBase = new URL(process.env.GRAPHQL_ENDPOINT).toString();

import { initI18n } from './i18n/initI18n';
initI18n();

/**
 * The Venia adapter provides basic context objects: a router, a store, a
 * GraphQL client, and some common functions.
 */

// The Venia adapter is not opinionated about auth.
const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists.
    const storage = new BrowserPersistence();
    const token = storage.getItem('signin_token');

    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    };
});

// https://www.apollographql.com/docs/link/links/error/
const errorLink = onError(error => {
    const { graphQLErrors, networkError } = error;
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) => {
            if (message == "The cart isn't active.") {
                // Sometimes, cart became inactive, it will cause error until user logged out
                // to prevent, we remove this current inactive cart
                store.dispatch(removeCart());
            }
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            );
        });
    if (networkError) {
        console.log(`[Network error]: ${networkError}`);
        if (networkError.statusCode === 503) {
            store.dispatch(siteActions.enableMaintenanceMode());
        }
    }

    if (isAuthError(error)) {
        if (isRunningInWebview()) {
            sendEventToWebview('login-token-expired-or-invalid');
        }
        store.dispatch(signOut());
    }
});

// @see https://www.apollographql.com/docs/link/composition/.
const apolloLink = ApolloLink.from([
    new MutationQueueLink(),
    new RetryLink({
        delay: {
            initial: 300,
            max: Infinity,
            jitter: true
        },
        attempts: {
            max: 0,
            retryIf: error => error && navigator.onLine
        }
    }),
    authLink,
    errorLink,
    // An apollo-link-http Link
    Adapter.apolloLink(apiBase)
]);

ReactDOM.render(
    <Adapter apiBase={apiBase} apollo={{ link: apolloLink }} store={store}>
        <AppContextProvider>
            <MainApp />
        </AppContextProvider>
    </Adapter>,
    document.getElementById('root')
);

// Temporary disable service worker
// registerSW();

window.addEventListener('online', () => {
    store.dispatch(app.setOnline());
});
window.addEventListener('offline', () => {
    store.dispatch(app.setOffline());
});

if (module.hot) {
    // When any of the dependencies to this entry file change we should hot reload.
    module.hot.accept();
}
