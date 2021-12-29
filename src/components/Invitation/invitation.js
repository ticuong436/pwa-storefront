import React from 'react';
import { Form } from 'informed';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import TextInput from '@skp/components/TextInput/index';
import TextAreaInput from '@skp/components/TextAreaInput/index';
import invitationOperations from './sendInvitation.gql';
import { useInvitation } from './useInvitation';
import {
    isRequired,
    japanOldCharacterValidation
} from '@skp/utils/formValidators';
import { string } from 'yup';
import { useTranslation } from 'react-i18next';
import InvitationBanner from 'design/dest/images/mypage-invitation-banner.png';
import MainPageTitle from '@skp/components/MainPageTitle';
import myCss from "./invitationStyle.css";

const Invitation = () => {
    const { t } = useTranslation(['validation', 'invitation']);

    const emailValidation = string()
        .email(t('validation::Invalid email'))
        .required(t('validation::Is required'));

    const { handleSendInvitation, inProgress } = useInvitation({
        invitationOperations
    });

    return (
        <div className={`mypage ${myCss.mypage_invitation}`}>
            <MainPageTitle title="Invite a friend" />
            <div className="mypage-invitation__content">
                <div className="mypage-invitation__banner">
                    <img src={InvitationBanner} alt="" />
                </div>
                <div className={`${myCss.form_body}`}>
                    <div className={myCss.description}>Spread the good news. You are already benefiting from the many rewards of the Sky Premium membership by now, so why not inform your friends and let them enjoy the exclusive benefits as well? Start inviting your friends to Sky Premium now.</div>
                    <Form onSubmit={handleSendInvitation}>
                    <div className={`mypage-invitation__form ${myCss.mypage_invitation__form}`}>
                        {inProgress ? (
                            <LoadingIndicator />
                        ) : (
                            <div className={`row w-100 ${myCss.btn}`}>
                                <div className={`control ${myCss.form_customize_invite_friend} col-lg-12 col-md-12`}>
                                    <TextInput
                                        id="input-first-name"
                                        field="firstname"
                                        placeholder={t(
                                            'First Name'
                                        )}
                                        classes={{
                                            input:
                                            `${myCss.member_form} form-text ${myCss.form_scale} ${myCss.form_invitation_input_mail}`
                                        }}
                                        validate={value =>
                                            isRequired(t)(value)
                                        }
                                        validateOnBlur
                                    />
                                </div>
                                <div className={`control ${myCss.form_customize_invite_friend} col-lg-12 col-md-12`}>
                                    <TextInput
                                        id="input-last-name"
                                        field="lastname"
                                        placeholder={t(
                                            'Last Name'
                                        )}
                                        classes={{
                                            input:
                                            `${myCss.member_form} form-text ${myCss.form_scale} ${myCss.form_invitation_input_mail}`
                                        }}
                                        validate={value =>
                                            isRequired(t)(value)
                                        }
                                        validateOnBlur
                                    />
                                </div>
                                <div className={`control ${myCss.form_customize_invite_friend} col-lg-12 col-md-12`}>
                                    <TextInput
                                        id="input-contact-number"
                                        field="contactNumber"
                                        placeholder={t(
                                            'Contact Number'
                                        )}
                                        classes={{
                                            input:
                                            `${myCss.member_form} form-text ${myCss.form_scale} ${myCss.form_invitation_input_mail}`
                                        }}
                                        validate={value =>
                                            isRequired(t)(value)
                                        }
                                        validateOnBlur
                                    />
                                </div>
                                <div className={`control ${myCss.form_customize_invite_friend} col-lg-12 col-md-12`}>
                                    <TextInput
                                        id="input-email"
                                        field="email"
                                        placeholder={t(
                                            'Email address'
                                        )}
                                        classes={{
                                            input:
                                            `${myCss.member_form} form-text ${myCss.form_scale} ${myCss.form_invitation_input_mail}`
                                        }}
                                        validationSchema={emailValidation}
                                        validateOnBlur
                                    />
                                </div>
                                <div className={`control ${myCss.form_customize_invite_friend} col-lg-12 col-md-12`}>
                                    <TextAreaInput
                                        id="textarea-content"
                                        field="message"
                                        placeholder={t(
                                            'Message to your friend'
                                        )}
                                        rows="5"
                                        classes={{
                                            input:
                                                `${myCss.member_form} form-textarea ${myCss.form_scale} ${myCss.form_invitation__input_message }`
                                        }}
                                        validate={value =>
                                            isRequired(t)(value) ||
                                            japanOldCharacterValidation(
                                                t,
                                                value
                                            )
                                        }
                                        validateOnBlur
                                    />
                                </div>
                                <div className={`${myCss.invite_div}`}>
                                    <button
                                        className={`button button--primary ${myCss.invite_btn}`}
                                        type="submit"
                                        disabled={inProgress}
                                    >
                                        {t('Send email')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </Form>
                </div>
                
            </div>
        </div>
    );
};

export default Invitation;

