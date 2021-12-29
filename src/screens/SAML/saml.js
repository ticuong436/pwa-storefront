import React, { useEffect, useCallback, useState } from 'react';
import { useLocation } from '@skp/drivers';
import HANDLE_SAML_REQUEST from './handleSAMLRequest.graphql';
import { useMutation } from '@apollo/react-hooks';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import Error500 from '@skp/components/Errors/500';

const SAML = () => {
    const [handleSAMLRequest, { loading, error }] = useMutation(
        HANDLE_SAML_REQUEST
    );
    const [submitError, setSubmitError] = useState(null);

    const sendSamlResponseToSP = useCallback(samlData => {
        const data = JSON.parse(samlData.handleSamlRequest.postData);
        var form = document.createElement('form');
        for (const key in data) {
            const input = document.createElement('input');
            input.name = key;
            input.value = data[key];
            form.appendChild(input);
        }

        form.method = 'POST';
        form.action = samlData.handleSamlRequest.destination;
        form.style = 'display:none';
        document.body.appendChild(form);
        form.submit();
    }, []);

    const location = useLocation();

    useEffect(() => {
        const send = async () => {
            const response = await handleSAMLRequest({
                variables: {
                    queryString: location.search.substr(1)
                }
            });

            if (response.data.handleSamlRequest.isValid) {
                sendSamlResponseToSP(response.data);
            } else {
                setSubmitError(response.data.handleSamlRequest.message);
            }
        };

        send();
    }, [handleSAMLRequest, sendSamlResponseToSP, location.search]);

    if (loading) {
        return <LoadingIndicator isDisplay={true} />;
    }

    return error || submitError ? <Error500 /> : null;
};

export default SAML;
