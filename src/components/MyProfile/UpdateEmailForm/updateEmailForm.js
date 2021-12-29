import React from 'react';
import { Form } from 'informed';
import { mergeClasses } from '@skp/utils/classify';
import { isRequired, emailValidation } from '@skp/utils/formValidators';
import { useTranslation } from 'react-i18next';
import TextInput from '@skp/components/TextInput';
import defaultClasses from './updateEmailForm.css';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import updateEmailOperations from './updateEmail.gql.js';
import { useUpdateEmail } from './useUpdateEmail.js';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { getErrorMessage } from '@skp/utils/graphqlError';

const UpdateEmailForm = props => {
    const { t } = useTranslation(['validation']);
    const [, { setInfo, setError }] = useNotificationContext();
    const classes = mergeClasses(defaultClasses, props.classes);
    const { user = {} } = props;

    const handleUpdateEmail = useUpdateEmail({
        mutations: updateEmailOperations.mutations
    });

    const { errors, handleUpdate, inProgress, result } = handleUpdateEmail;

    if (errors) {
        setError(getErrorMessage(errors.message));
    }

    if (result) {
        setInfo('メールアドレスを変更いたしました。');
    }

    return (
        <div>
            <Form
                className={classes.root}
                onSubmit={handleUpdate}
                autoComplete="off"
            >
                <div className="reg-form modal-form">
                    <div className="control form-mail">
                        <TextInput
                            field="email"
                            validationSchema={emailValidation(t)}
                            classes={{ input: 'form-control member-email' }}
                            initialValue={user.email}
                        />
                        <span className="input-lable">Mail Address</span>
                    </div>
                    <div className="control form-mail">
                        <TextInput
                            type="password"
                            field="password"
                            validate={value => isRequired(t)(value)}
                            classes={{ input: 'form-control' }}
                        />
                        <span className="input-lable">Password</span>
                    </div>
                    <div className="modal-button">
                        {inProgress && <LoadingIndicator />}
                        {!inProgress && (
                            <button
                                type="submit"
                                className={classes.btn_shadow}
                            >
                                Eメールの変更
                            </button>
                        )}
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default UpdateEmailForm;
