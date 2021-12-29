import React from 'react';
import { Form } from 'informed';
import { mergeClasses } from '@skp/utils/classify';
import { isRequired, validateConfirmPassword } from '@skp/utils/formValidators';
import TextInput from '@skp/components/TextInput';
import defaultClasses from './updatePasswordForm.css';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useUpdatePassword } from './useUpdatePassword.js';
import updatePasswordOperations from './updatePassword.gql.js';
import { useTranslation } from 'react-i18next';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { getErrorMessage } from '@skp/utils/graphqlError';

const UpdatePasswordForm = props => {
    const { t } = useTranslation(['validation', 'auth']);
    const [, { setInfo, setError }] = useNotificationContext();
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useUpdatePassword({
        mutations: updatePasswordOperations.mutations
    });

    const {
        formErrors: errors,
        handleFormSubmit: onSubmit,
        inProgress,
        resultSubmit
    } = talonProps;

    if (errors) {
        setError(getErrorMessage(errors.message));
    }

    if (resultSubmit) {
        setInfo(
            t(
                'auth::Your new password has been saved. Please use this password to sign into your Account.'
            )
        );
    }

    return (
        <div>
            <Form
                className={classes.root}
                onSubmit={onSubmit}
                autoComplete="off"
            >
                <div className="reg-form modal-form">
                    <div className="control form-mail">
                        <TextInput
                            type="password"
                            field="currentPassword"
                            validate={value => isRequired(t)(value)}
                            classes={{ input: 'form-control' }}
                        />
                        <span className="input-lable">現在のパスワード</span>
                    </div>
                    <div className="control form-mail">
                        <TextInput
                            type="password"
                            field="newPassword"
                            validate={value => isRequired(t)(value)}
                            classes={{ input: 'form-control' }}
                        />
                        <span className="input-lable">新しいパスワード</span>
                    </div>
                    <div className="control form-mail">
                        <TextInput
                            type="password"
                            field="passwordConfirm"
                            validate={
                                ((value, values) =>
                                    validateConfirmPassword(
                                        t,
                                        value,
                                        values,
                                        'newPassword'
                                    ),
                                value => isRequired(t)(value))
                            }
                            classes={{ input: 'form-control' }}
                        />
                        <span className="input-lable">
                            新しいパスワード（確認）
                        </span>
                    </div>
                    <div className="modal-button">
                        {inProgress && <LoadingIndicator />}
                        {errors && (
                            <p className="text-left text-danger">
                                {getErrorMessage(errors.message)}
                            </p>
                        )}
                        {!inProgress && (
                            <button
                                className={classes.btn_shadow}
                                type="submit"
                                disabled={inProgress}
                            >
                                パスワードの再設定
                            </button>
                        )}
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default UpdatePasswordForm;
