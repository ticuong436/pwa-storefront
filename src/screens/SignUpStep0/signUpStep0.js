import React from 'react';
import { Form } from 'informed';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@skp/components/TextInput';
import { Redirect, resourceUrl } from '@skp/drivers';
import { string } from 'yup';
import { useSignUpStep0 } from './useSignUpStep0';
import ImageBox01 from 'design/dest/images/reg-signup0-1.png';
import ImageBox02 from 'design/dest/images/reg-signup0-2.png';
import ImageBox03 from 'design/dest/images/reg-signup0-3.png';
import ImageBox04 from 'design/dest/images/reg-signup0-4.png';
import ImageBox05 from 'design/dest/images/reg-signup0-5.png';
import ImageBox06 from 'design/dest/images/reg-signup0-6.png';

import HeroImage from 'design/dest/images/hero1.png';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { inputValidationName } from '@skp/utils/formValidators';
import { useTranslation } from 'react-i18next';
import AlertMessage from '@skp/components/AlertMessage';

const SignUpStep0 = ({ stepList }) => {
    const { t } = useTranslation(['validation']);
    const emailValidation = string()
        .email(t('validation::Invalid email'))
        .required(t('validation::Is required'));

    const talonProps = useSignUpStep0();

    const {
        handleFormSubmit,
        skyMemberShipPage,
        termOfUsePage,
        privacyPolicyPage,
        skyPointsRegulationPage,
        loadingInvitationInfo,
        invitationInfo
    } = talonProps;

    if (loadingInvitationInfo) {
        return <LoadingIndicator global={true} />;
    }

    if (invitationInfo && invitationInfo.isValid === null) {
        return (
            <Redirect
                to={{
                    pathname: resourceUrl('/login')
                }}
            />
        );
    }

    return (
        <React.Fragment>
            {invitationInfo && !invitationInfo.isValid ? (
                <AlertMessage type="error" marginBottom={false}>
                    {invitationInfo.message}
                </AlertMessage>
            ) : (
                <div className="main-content">
                    <div className="reg-helo">
                        <img src={HeroImage} alt="" />
                        <div className="reg-helo-text">
                            <p className="reg-helo--title">
                                Discover a World of Boundless Privileges
                            </p>
                            <p className="reg-helo--des">
                                ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????-SKY-?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                            </p>
                        </div>
                    </div>
                    <div className="container reg-container">
                        {stepList}
                        <div className="reg-box row">
                            <div className="reg-item col-xl-4 col-lg-4 col-md-4 col-xs-12">
                                <img src={ImageBox01} alt="" />
                                <div className="reg-item-info">
                                    <h3 className="reg-item--title">Travel</h3>
                                    <p className="reg-item--text">
                                        ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                                    </p>
                                </div>
                            </div>
                            <div className="reg-item col-xl-4 col-lg-4 col-md-4 col-xs-12">
                                <img src={ImageBox02} alt="" />
                                <div className="reg-item-info">
                                    <h3 className="reg-item--title">
                                        Wine & Dine
                                    </h3>
                                    <p className="reg-item--text">
                                        ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                                    </p>
                                </div>
                            </div>
                            <div className="reg-item col-xl-4 col-lg-4 col-md-4 col-xs-12">
                                <img src={ImageBox03} alt="" />
                                <div className="reg-item-info">
                                    <h3 className="reg-item--title">
                                        Wellness
                                    </h3>
                                    <p className="reg-item--text">
                                        SKY
                                        PREMIUM?????????????????????????????????????????????????????????????????????????????????????????????????????????
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="reg-box row">
                            <div className="reg-item col-xl-4 col-lg-4 col-md-4 col-xs-12">
                                <img src={ImageBox04} alt="" />
                                <div className="reg-item-info">
                                    <h3 className="reg-item--title">
                                        Shopping
                                    </h3>
                                    <p className="reg-item--text">
                                        ?????????????????????????????????????????????????????????????????????????????????????????????????????????
                                    </p>
                                </div>
                            </div>
                            <div className="reg-item col-xl-4 col-lg-4 col-md-4 col-xs-12">
                                <img src={ImageBox05} alt="" />
                                <div className="reg-item-info">
                                    <h3 className="reg-item--title">
                                        Sky Points
                                    </h3>
                                    <p className="reg-item--text">
                                        ????????????????????????????????????????????????????????????????????????????????????????????????????????????
                                    </p>
                                </div>
                            </div>
                            <div className="reg-item col-xl-4 col-lg-4 col-md-4 col-xs-12">
                                <img src={ImageBox06} alt="" />
                                <div className="reg-item-info">
                                    <h3 className="reg-item--title">
                                        The Events
                                    </h3>
                                    <p className="reg-item--text">
                                        ????????????????????????????????????????????????????????????????????????
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="reg-join--block">
                        <div className="reg-block--step2">
                            <div className="container">
                                <h1 className="reg-join--title">
                                    Join Sky Premium
                                </h1>
                                <Form onSubmit={handleFormSubmit}>
                                    <div className="reg-form row">
                                        <Field
                                            label="Last Name?????? / ????????????????????????"
                                            id="last_name"
                                            classes={{
                                                root:
                                                    'control col-xl-6 col-lg-6 col-md-6 col-xs-12',
                                                label: 'input-lable'
                                            }}
                                        >
                                            <TextInput
                                                field="lastName"
                                                id="last_name"
                                                validationSchema={inputValidationName(
                                                    t
                                                )}
                                                classes={{
                                                    input:
                                                        'form-control text-uppercase'
                                                }}
                                            />
                                        </Field>
                                        <Field
                                            label="First Name?????? / ????????????????????????"
                                            id="first_name"
                                            classes={{
                                                root:
                                                    'control control col-xl-6 col-lg-6 col-md-6 col-xs-12',
                                                label: 'input-lable'
                                            }}
                                        >
                                            <TextInput
                                                field="firstName"
                                                id="first_name"
                                                validationSchema={inputValidationName(
                                                    t
                                                )}
                                                classes={{
                                                    input:
                                                        'form-control text-uppercase'
                                                }}
                                            />
                                        </Field>
                                        <Field
                                            label="Mail Address"
                                            id="email"
                                            classes={{
                                                root:
                                                    'control col-xl-12 col-lg-12 col-md-12 col-xs-12',
                                                label: 'input-lable'
                                            }}
                                        >
                                            <TextInput
                                                field="email"
                                                id="email"
                                                validationSchema={
                                                    emailValidation
                                                }
                                                classes={{
                                                    input: 'form-control'
                                                }}
                                                initialValue={
                                                    invitationInfo.email
                                                }
                                                disabled={true}
                                            />
                                        </Field>
                                    </div>
                                    <div className="row">
                                        <div className="reg-des col-xl-9 col-lg-9 col-md-9 col-xs-12">
                                            <p>
                                                ??????????????????????????????
                                                <a
                                                    target="_blank"
                                                    href={resourceUrl(
                                                        `/page/${
                                                            skyMemberShipPage.url_key
                                                        }.html`
                                                    )}
                                                >
                                                    <span>
                                                        {' '}
                                                        ???SKY PREMIUM???????????????{' '}
                                                    </span>
                                                </a>
                                                ???
                                                <a
                                                    target="_blank"
                                                    href={resourceUrl(
                                                        `/page/${
                                                            termOfUsePage.url_key
                                                        }.html`
                                                    )}
                                                >
                                                    <span>
                                                        {' '}
                                                        ?????????????????????????????????{' '}
                                                    </span>
                                                </a>
                                                ???
                                                <a
                                                    target="_blank"
                                                    href={resourceUrl(
                                                        `/page/${
                                                            privacyPolicyPage.url_key
                                                        }.html`
                                                    )}
                                                >
                                                    <span>
                                                        {' '}
                                                        ????????????????????????????????????{' '}
                                                    </span>
                                                </a>
                                                ????????????
                                                <a
                                                    target="_blank"
                                                    href={resourceUrl(
                                                        `/page/${
                                                            skyPointsRegulationPage.url_key
                                                        }.html`
                                                    )}
                                                >
                                                    <span>
                                                        {' '}
                                                        "SKY DOLLARS Terms of Service"{' '}
                                                    </span>
                                                </a>
                                                ??????????????????????????????????????????????????????SIGN
                                                UP????????????????????????????????????????????????
                                            </p>
                                        </div>
                                        <div className="reg-bottom reg-bottom--step0 col-xl-3 col-lg-3 col-md-3 col-xs-12">
                                            <button
                                                disabled={
                                                    invitationInfo &&
                                                    !invitationInfo.isValid
                                                }
                                                type="submit"
                                                className="reg-btn action-login"
                                            >
                                                Sign Up
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default SignUpStep0;
