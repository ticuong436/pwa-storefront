import React, { useEffect } from 'react';
import HeaderSignUp from './Header/headerSignUp';
import FooterSignUp from './Footer/footerSignUp';
import { number } from 'prop-types';
import { useUserContext } from './context/user';
import { Redirect, useLocation, resourceUrl } from '@skp/drivers';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useTranslation } from 'react-i18next';
import { useUserContextQuery } from './context/user/context';
import PageTitle from '@skp/components/PageTitle';

const RegistrationLayout = ({ children, step, pageTitle = null }) => {
    const [{ isSignedIn, currentUser, isGettingDetails }] = useUserContext();

    const { userContextFetchDetails } = useUserContextQuery();
    useEffect(() => {
        userContextFetchDetails();
    }, [userContextFetchDetails]);

    const location = useLocation();
    const { t } = useTranslation(['common']);

    if (isGettingDetails) {
        return <LoadingIndicator global={true} overlay={false} />;
    }

    if (!isSignedIn && (step == 2 || step == 3)) {
        return (
            <Redirect
                to={{
                    pathname: resourceUrl('/login'),
                    state: {
                        from: location,
                        messageError: t('common::Your session expired')
                    }
                }}
            />
        );
    }

    if (currentUser.is_registering === false) {
        return <Redirect to={resourceUrl('/')} />;
    }

    const activeNo = currentStep =>
        currentStep == step ? 'reg-hexagon-active' : '';

    const tickNo = currentStep =>
        currentStep < step ? 'reg-hexagon-tick' : '';

    const activeLabel = currentStep =>
        currentStep == step ? 'reg-member--active' : '';

    let stepList = null;
    if (step > 0) {
        stepList = (
            <div className="reg-member">
                <div className={`reg-list ${activeNo(1)}`}>
                    <div className={`reg-hexagon ${tickNo(1)}`}>
                        <span>1</span>
                    </div>
                    <div className={`reg-member--des ${activeLabel(1)}`}>
                        会員情報
                    </div>
                </div>
                <div className={`reg-list ${activeNo(2)}`}>
                    <div className={`reg-hexagon ${tickNo(2)}`}>
                        <span>2</span>
                    </div>
                    <div className={`reg-member--des ${activeLabel(2)}`}>
                        会費決済
                    </div>
                </div>
                <div className={`reg-list ${activeNo(3)}`}>
                    <div className={`reg-hexagon ${tickNo(3)}`}>
                        <span>3</span>
                    </div>
                    <div className={`reg-member--des ${activeLabel(3)}`}>
                        登録完了
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wrapper registration">
            {pageTitle && <PageTitle title={pageTitle} />}
            <HeaderSignUp />
            <main className="main">
                <div
                    className={`main-fluid ${
                        step == 0 ? 'main-fluid--white' : ''
                    }`}
                >
                    {children(stepList)}
                </div>
            </main>
            <FooterSignUp />
        </div>
    );
};

RegistrationLayout.propTypes = {
    step: number
};

export default RegistrationLayout;
