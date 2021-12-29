import React, { Fragment } from 'react';
import { Form } from 'informed';

import {
    validateConfirmPassword,
    hasLengthAtLeast
} from '@skp/utils/formValidators';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@skp/components/TextInput';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useResetPassword } from './useResetPassword.js';
import resetPasswordOperations from './resetPassword.gql.js';
import { Redirect, Link, resourceUrl } from '@skp/drivers';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '@skp/utils/graphqlError';
import HeaderLogin from '@skp/layouts/Header/headerLogin';
import AlertMessage from '@skp/components/AlertMessage';

const ResetPassword = () => {
    const { t } = useTranslation(['common', 'auth', 'validation']);

    const {
        formErrors,
        handleFormSubmit,
        inProgress,
        resultSubmit,
        hasValidData,
        checkLinkTokenExpired
    } = useResetPassword({
        ...resetPasswordOperations
    });
    if (!hasValidData) {
        return (
            <Redirect
                to={{
                    pathname: resourceUrl('/forgot-password')
                }}
            />
        );
    }

    if (checkLinkTokenExpired && !checkLinkTokenExpired.result) {
        return (
            <Redirect
                to={{
                    pathname: resourceUrl('/forgot-password'),
                    state: { messageError: checkLinkTokenExpired.message }
                }}
            />
        );
    }

    const children = (
        <Fragment>
            {formErrors && (
                <AlertMessage type="error">
                    {getErrorMessage(formErrors.message)}
                </AlertMessage>
            )}
            {resultSubmit && (
                <AlertMessage type="info">
                    {t(
                        'auth::Your new password has been saved. Please use this password to sign into your Account.'
                    )}
                </AlertMessage>
            )}

            <div className="login">
                <HeaderLogin />
                <div className="welcome">
                    <h4 className="welcome--title">
                        {t('auth::Reset your password')}
                    </h4>
                    <p className="welcome--sub">
                        {t('auth::If you forgot your password')}
                    </p>
                    <p className="welcome--des" />
                </div>
                <div className="form">
                    <Form className="form-login" onSubmit={handleFormSubmit}>
                        <Field
                            label={t('auth::New password')}
                            id="new_password"
                            classes={{
                                root: 'control',
                                label: 'input-lable'
                            }}
                        >
                            <TextInput
                                type="password"
                                field="newPassword"
                                validate={value =>
                                    hasLengthAtLeast(t, value, 8)
                                }
                                classes={{ input: 'form-control' }}
                            />
                        </Field>
                        <Field
                            label={t('auth::New password (confirmation)')}
                            id="password_confirm"
                            classes={{
                                root: 'control',
                                label: 'input-lable'
                            }}
                        >
                            <TextInput
                                type="password"
                                field="passwordConfirm"
                                validate={(value, values) =>
                                    validateConfirmPassword(
                                        t,
                                        value,
                                        values,
                                        'newPassword'
                                    )
                                }
                                classes={{ input: 'form-control' }}
                            />
                            {inProgress && <LoadingIndicator global={true} />}
                        </Field>
                        <div className="control control-log">
                            <Link
                                className="back-login"
                                to={resourceUrl('/login')}
                            >
                                {t('auth::Back to login')}
                            </Link>
                            <button
                                type="submit"
                                className="button-action"
                                disabled={inProgress}
                            >
                                {t('auth::Reset password')}
                            </button>
                        </div>
                    </Form>
                </div>
                <div className="copyright">
                    <span>
                        {t(
                            'auth::© {{year}} SKY PREMIUM INTERNATIONAL PTE LTD. ALL RIGHTS RESERVED.',
                            {
                                year: new Date().getFullYear()
                            }
                        )}
                    </span>
                </div>
            </div>
        </Fragment>
    );

    return <div>{children}</div>;
};

export default ResetPassword;
