import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';
import { useForgotPassword } from './useForgotPassword';
import forgotPasswordOperations from './forgotPassword.gql.js';
import { useTranslation } from 'react-i18next';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@skp/components/TextInput';
import { Form } from 'informed';
import { isRequired } from '@skp/utils/formValidators';
import { Link, resourceUrl } from '@skp/drivers';
import HeaderLogin from '@skp/layouts/Header/headerLogin';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import AlertMessage from '@skp/components/AlertMessage';
import { getErrorMessage } from '@skp/utils/graphqlError';

const ForgotPassword = () => {
    const { t } = useTranslation(['common', 'auth', 'validation']);

    const {
        formErrors,
        handleFormSubmit,
        inProgress,
        resultSubmit
    } = useForgotPassword({
        ...forgotPasswordOperations
    });

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
                        'auth::If there is an account associated with, you will receive an email with a link to change your password.'
                    )}
                </AlertMessage>
            )}
            <div className="login">
                <HeaderLogin />
                <div className="welcome">
                    <h4 className="welcome--title">
                        {t('common::Welcome to The Good Life')}
                    </h4>
                    <p className="welcome--sub">
                        {t('auth::If you forgot your password')}
                    </p>
                    <p className="welcome--des">
                        {t(
                            'auth::Enter your registered email here to receive the guide to reset your password.'
                        )}
                    </p>
                </div>
                <div className="form">
                    <Form className="form-login" onSubmit={handleFormSubmit}>
                        <Field
                            label={t('auth::Email address')}
                            id="email"
                            classes={{
                                root: 'control',
                                label: 'input-lable'
                            }}
                        >
                            <TextInput
                                autoComplete="email"
                                field="email"
                                validate={isRequired(t)}
                                classes={{ input: 'form-control' }}
                                mask={value => value.trim()}
                                maskOnBlur
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

export default ForgotPassword;

ForgotPassword.propTypes = {
    initialValues: shape({
        email: string
    })
};
