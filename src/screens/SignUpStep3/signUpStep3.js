import React from 'react';
import { Redirect, resourceUrl } from '@skp/drivers';
import useSignUpStep3 from './useSignUpStep3';
import LoadingIndicator from '@skp/components/LoadingIndicator';

const SignUpStep3 = ({ stepList }) => {
    const {
        isRedirectFromSecondStep,
        welcomePageUrl,
        loadingWelcomePageUrl
    } = useSignUpStep3();

    if (!isRedirectFromSecondStep) {
        return <Redirect to={resourceUrl('/sign-up/second-step')} />;
    }

    if (loadingWelcomePageUrl) {
        return <LoadingIndicator />;
    }

    return (
        <div className="container">
            <div className="main-content">
                <div className="reg-block--step2">
                    <div className="regstep1">
                        {stepList}
                        <div className="reg-welcome">
                            Thank You for Your Registration.
                        </div>
                        <div className="reg-bottom">
                            <a href={welcomePageUrl} className="reg-btn">
                                Welcomeページへ
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpStep3;
