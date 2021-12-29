import React from 'react';
import { Form } from 'informed';
import { useSignIn } from './useSignIn';
import { isRequired } from '@skp/utils/formValidators';
import Field from '@magento/venia-ui/lib/components/Field';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { Link, Redirect, resourceUrl } from '@skp/drivers';
import TextInput from '@skp/components/TextInput';
import { useTranslation } from 'react-i18next';
import HeaderLogin from '@skp/layouts/Header/headerLogin';
import { getErrorMessage } from '@skp/utils/graphqlError';
import AlertMessage from '@skp/components/AlertMessage';

const SignIn = () => {
    const { t } = useTranslation(['common', 'auth', 'validation']);

    const {
        errors,
        handleSubmit,
        isBusy,
        redirectTo,
        clearErrorMessage
    } = useSignIn();

    if (redirectTo) {
        return <Redirect to={redirectTo} />;
    }

    // Map over any errors we get and display an appropriate error.
    const errorMessage = errors.length
        ? errors
              .map(({ message }) => getErrorMessage(message))
              .reduce((prevMsg, msg) => msg + '\n' + prevMsg, '')
        : null;

    return (
        <>
            {errorMessage && (
                <AlertMessage type="error">{errorMessage}</AlertMessage>
            )}
            <div className="login">
                <HeaderLogin />
                <div className="welcome">
                    <h4 className="welcome--title">
                        {t('common::Welcome to The Good Life')}
                    </h4>
                    <p className="welcome--sub">
                        {/* Missing translation for this string => it will show: Sign in to get started */}
                        {/* But best practice is define it in JA json file to reference */}
                        {t('auth::Sign in to get started')}
                    </p>
                    <p className="welcome--des" />
                </div>
                <div className="form">
                    <Form
                        className="form-login"
                        onValueChange={clearErrorMessage}
                        onSubmit={handleSubmit}
                    >
                        <Field
                            label={t('auth::Email/UID')}
                            id="email"
                            classes={{ root: 'control', label: 'input-lable' }}
                        >
                            <TextInput
                                autoComplete="email"
                                field="email"
                                id="email"
                                validate={isRequired(t)}
                                classes={{ input: 'form-control' }}
                                mask={value => (value ? value.trim() : value)}
                                maskOnBlur
                            />
                        </Field>
                        <Field
                            label={t('auth::Password')}
                            id="password"
                            classes={{ root: 'control', label: 'input-lable' }}
                        >
                            <TextInput
                                autoComplete="current-password"
                                field="password"
                                id="password"
                                type="password"
                                validate={isRequired(t)}
                                classes={{ input: 'form-control' }}
                            />
                        </Field>
                        <div className="control control-checkbox">
                            <label>
                                <input
                                    className="input-checkbox"
                                    type="checkbox"
                                />
                                <span>{t('auth::Remember me')}</span>
                            </label>
                        </div>
                        {isBusy && (
                            <div>
                                <LoadingIndicator global={true} />
                            </div>
                        )}
                        <div className="control control-log">
                            <Link
                                to={resourceUrl('/forgot-password')}
                                className="forgot-pass"
                            >
                                <span className="hide-xs">
                                    パスワードをお忘れの方はこちらへ
                                </span>
                                <span className="hide-pc">
                                    パスワードをお忘れの方は
                                    <br />
                                    こちらへ
                                </span>
                            </Link>
                            <button
                                type="submit"
                                className="button-action"
                                disabled={isBusy}
                            >
                                {t('auth::Login')}
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
        </>
    );
};

export default SignIn;
