export const getErrorMessage = error => {
    const errorStr = error.toString().split('GraphQL error: ');

    let message = '';
    if (errorStr.length > 1) {
        message = errorStr[1];
    } else {
        message = errorStr[0];
    }

    if (message == 'Internal server error') {
        // FIXME: Cannot use translate here, hard code for now
        // Processing could not be continued. Please contact customer support.
        return 'An error occurred during processing. We apologize for the inconvenience, but please attach a screenshot of this screen and contact the support desk (memberjp@skypremium.com).';
    }

    return message;
};

export const getErrorCategory = error => {
    if (error && error.graphQLErrors && error.graphQLErrors.length > 0) {
        return error.graphQLErrors[0].extensions.category;
    }

    return null;
};

export const is404Error = error => {
    return getErrorCategory(error) === 'graphql-no-such-entity';
};

export const isAuthError = error => {
    return getErrorCategory(error) === 'graphql-authorization';
};
