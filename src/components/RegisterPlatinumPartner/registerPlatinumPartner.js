import React from 'react';
import TextInput from '@skp/components/TextInput';
import SelectInput from '@skp/components/SelectInput';
import { Form, Option } from 'informed';
import useRegisterPlatinumPartner from './useRegisterPlatinumPartner';
import { string } from 'yup';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import {
    isRequired,
    inputValidationHasComma,
    inputCardNumberValidation,
    inputCVCNumberValidation,
    postalCodeValidation,
    phoneValidation,
    inputValidationAddress,
    inputValidationCity,
    inputValidationName,
    validateConfirmPassword
} from '@skp/utils/formValidators';
import MainPageTitle from '@skp/components/MainPageTitle';
import { useUserContext } from '@skp/layouts/context/user';
import { useUserContextQuery } from '@skp/layouts/context/user/context';
import { useTranslation } from 'react-i18next';
import AlertMessage from '@skp/components/AlertMessage';
import DateOfBirth from '@skp/components/DatePickerInput/dateOfBirth';
import Moment from 'moment';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { getErrorMessage } from '@skp/utils/graphqlError';
import { resourceUrl } from '@skp/drivers';
import TargetBlankLink from '@skp/components/TargetBlankLink';
import { SITE_LINKS } from '@skp/config';

const RegisterPlatinumPartner = () => {
    const {
        genders,
        contactCountryCodes,
        nationalities,
        occupations,
        handleSubmit,
        isCreatingCustomer,
        createCustomerError,
        createCustomerResponse,
        customer,
        countries,
        onCountryChanged,
        regions,
        skyMemberShipPage,
        termOfUsePage,
        privacyPolicyPage,
        skyPointsRegulationPage
    } = useRegisterPlatinumPartner();

    const { t } = useTranslation([
        'navigation',
        'mypage',
        'validation',
        'address'
    ]);

    const [{ currentUser, isGettingDetails }] = useUserContext();
    const { userContextFetchDetails } = useUserContextQuery();
    const [, { setInfo, setError }] = useNotificationContext();

    if (isGettingDetails) {
        return <LoadingIndicator />;
    }

    if (
        createCustomerResponse &&
        createCustomerResponse.createPlatinumPartnerCustomer
    ) {
        setInfo('PLATINUM PARTNER会員登録が完了しました。');
        userContextFetchDetails();
    }

    if (
        !currentUser.can_register_platinum_partner ||
        (createCustomerResponse &&
            createCustomerResponse.createPlatinumPartnerCustomer)
    ) {
        return (
            <>
                <MainPageTitle
                    title={t('navigation::Register Platinum Partner')}
                />
                <AlertMessage type="warning">
                    {t(
                        'mypage::Please upgrade to Platinum plan to use this feature'
                    )}
                </AlertMessage>
            </>
        );
    }

    if (createCustomerError) {
        setError(getErrorMessage(createCustomerError.message));
    }

    if (
        createCustomerResponse &&
        !createCustomerResponse.createPlatinumPartnerCustomer
    ) {
        setError(
            '失敗しました。カスタマーサポートセンターにお問合せください。'
        );
    }

    const expiredMontValidation = string()
        .required(t('validation::Is required'))
        .matches(
            /^(0?[1-9]|1[012])\/\d{2}$/,
            'mm/yy フォーマットで入力ください'
        )
        .test(
            'gt-current',
            t('validation::Expired date must greater than current'),
            value => {
                if (value) {
                    const d = new Date();
                    const [month, year] = value.split('/');
                    if (year < ('' + d.getFullYear()).slice(-2)) {
                        return false;
                    }
                    if (year > ('' + d.getFullYear()).slice(-2)) {
                        return true;
                    }
                    return month > d.getMonth() + 1;
                }
            }
        );

    return (
        <>
            {isCreatingCustomer && (
                <div>
                    <LoadingIndicator global={true} />
                </div>
            )}
            <Form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="mypage member-info col-xl-6 col-lg-6 col-md-12 col-xs-12">
                        <MainPageTitle
                            title={t(
                                'navigation::Register Platinum Partner Page Title'
                            )}
                        />
                        <div className="platinum">
                            <div className="platinum-box">
                                <p className="platinum--title">
                                    Half price for your partner's platinum membership fee!
                                </p>
                                <ul className="platinum-disc">
                                    <li>Service: Equivalent to Platinum members</li>
                                    <li>Membership fee: USD50 (monthly membership fee payment)</li>
                                    <li>Others: Couples living apart can also apply.</li>
                                </ul>
                            </div>
                            <div className="platinum-box">
                                <p>＜Usage qualifications, conditions, etc.＞</p>
                                <ul className="platinum-decimal">
                                    <li>
                                        <span>Platinum Partner Members often refer to the
                                        <TargetBlankLink
                                            className="platinum--link"
                                            href={resourceUrl(
                                                `/page/${
                                                    skyMemberShipPage.url_key
                                                }.html`
                                            )}
                                        >
                                             "SKY PREMIUM Membership Terms"
                                        </TargetBlankLink>
                                        , </span>
                                        <span><TargetBlankLink
                                            className="platinum--link"
                                            href={resourceUrl(
                                                `/page/${
                                                    termOfUsePage.url_key
                                                }.html`
                                            )}
                                        >
                                            "Membership Site Terms of Use"
                                        </TargetBlankLink>
                                        , </span>
                                        <span><TargetBlankLink
                                            className="platinum--link"
                                            href="https://res.cloudinary.com/sky-premium-jpmktg/image/upload/v1562661047/PDF/platinum-partner-membership-agreement_2018.pdf"
                                        >
                                            "Platinum Partner Membership Terms"
                                        </TargetBlankLink>
                                        , </span>
                                        <span><TargetBlankLink
                                            className="platinum--link"
                                            href={resourceUrl(
                                                `/page/${
                                                    privacyPolicyPage.url_key
                                                }.html`
                                            )}
                                        >
                                            "Privacy Policy"
                                        </TargetBlankLink>
                                        , and </span>
                                        <span><TargetBlankLink
                                            className="platinum--link"
                                            href={resourceUrl(
                                                `/page/${
                                                    skyPointsRegulationPage.url_key
                                                }.html`
                                            )}
                                        >
                                            "SKY DOLLARS Terms of Use"
                                        </TargetBlankLink> </span>
                                        in the application method prescribed by the Society.
                                        A Platinum Partner member is a person who has read, agreed,
                                        and registered, and the Society has reviewed and approved
                                        the registration. The spouse of a Platinum Partner member
                                        must be a primary member, a Platinum member, and one person.
                                    </li>
                                    <li>
                                        The definition of spouse is governed by the laws of the
                                        country or region in which the primary member lives.
                                    </li>
                                    <li>
                                        The socity will not be held responsible for any disadvantages cuased
                                        to members dur to false or incorrect application details.
                                        If necessary, you may be asked to submit a certificate of spouse.
                                    </li>
                                    <li>
                                        After pressing the "Register" button on this page, the membership
                                        fee for the first month will be charged to the card you entered.
                                        Membership fees will be billed individually.
                                    </li>
                                </ul>
                            </div>
                            <div className="platinum-box">
                                <p>
                                    * This page is
                                    {/* <span className="platinum--bold"> */}
                                    <label htmlFor="new-enrollment">
                                        New Enrollment.
                                    </label>
                                    {/* </span> */}
                                    This is the registration form when you recieve it.
                                    If your partner is already a member, you will need to change the grade.
                                    Sorry for your inconvenience, but please download the
                                    <TargetBlankLink
                                        className="platinum--link"
                                        href="https://res.cloudinary.com/sky-premium-jpmktg/image/upload/v1562658337/PDF/%E3%83%97%E3%83%A9%E3%83%81%E3%83%8A%E3%83%91%E3%83%BC%E3%83%88%E3%83%8A%E3%83%BC%E4%BC%9A%E5%93%A1%E7%99%BB%E9%8C%B2%E7%94%B3%E8%BE%BC%E6%9B%B8.pdf"
                                    >
                                        Platinum Partner Membership Application Form (PDF file)
                                    </TargetBlankLink>
                                    and fill in the necessary information.
                                    <label htmlFor="new-enrollment">
                                        <TargetBlankLink
                                            href={SITE_LINKS['support']}
                                            rel="noopener noreferrer"
                                        >
                                            Support Desk
                                        </TargetBlankLink>
                                    </label>
                                    Please contact us.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mypage member-file col-xl-6 col-lg-6 col-md-12 col-xs-12">
                        <MainPageTitle title={t('mypage::Profile')} />
                        <div className="row w-100p">
                            <div className="control col-lg-12 col-md-12">
                                <TextInput
                                    field="email"
                                    id="email"
                                    validate={isRequired(t)}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    Email Address *
                                </span>
                            </div>
                            <div className="control col-lg-12 col-md-12">
                                <TextInput
                                    autoComplete="lastname"
                                    field="lastname"
                                    id="lastname"
                                    validationSchema={inputValidationName(t)}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    {t('address::Last name')} *
                                </span>
                            </div>
                            <div className="control col-lg-12 col-md-12">
                                <TextInput
                                    field="firstname"
                                    id="firstname"
                                    validationSchema={inputValidationName(t)}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    {t('address::First name')} *
                                </span>
                            </div>
                            <div className="control col-lg-12 col-md-12">
                                <TextInput
                                    type="password"
                                    field="password"
                                    validate={value => isRequired(t)(value)}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    Password
                                </span>
                            </div>
                            <div className="control col-lg-12 col-md-12">
                                <TextInput
                                    type="password"
                                    field="passwordConfirm"
                                    validate={(value, values) =>
                                        validateConfirmPassword(
                                            t,
                                            value,
                                            values,
                                            'password'
                                        )
                                    }
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    Password (confirmation)
                                </span>
                            </div>
                            <div className="control col-lg-6 col-md-12 member-select pc-padding-right">
                                <SelectInput
                                    field="gender"
                                    id="gender"
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                    validate={isRequired(t)}
                                >
                                    <Option value="" disabled>
                                        Please select
                                    </Option>
                                    {genders.map(gender => (
                                        <Option
                                            key={gender.value}
                                            value={gender.value}
                                        >
                                            {gender.label}
                                        </Option>
                                    ))}
                                    <optgroup disabled />
                                </SelectInput>
                                <span className="member-form--lable">
                                    Sex *
                                </span>
                            </div>
                            <div className="control col-lg-6 col-md-12 dob dob-right pc-padding-left">
                                <DateOfBirth
                                    datePickerClass={'member-form form-scale'}
                                    datePickerPlaceholder={'yyyy/mm/dd'}
                                    datePickerFormat={'yyyy/MM/dd'}
                                    datePickerField={'dob'}
                                    datePickerAutoComplete={'dob'}
                                />
                                <span className="member-form--lable">
                                    Date of Birth *
                                </span>
                            </div>
                            <div className="control col-lg-6 col-md-12 member-select pc-padding-right">
                                <SelectInput
                                    field="registration_country_number"
                                    id="registration_country_number"
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                    validate={isRequired(t)}
                                    initialValue="81"
                                >
                                    <Option value="" disabled>
                                        Please select
                                    </Option>
                                    {contactCountryCodes.map(
                                        contactCountryCode => (
                                            <Option
                                                key={contactCountryCode.value}
                                                value={contactCountryCode.value}
                                            >
                                                {contactCountryCode.label}
                                            </Option>
                                        )
                                    )}
                                    <optgroup disabled />
                                </SelectInput>
                                <span className="member-form--lable">
                                    Country Code *
                                </span>
                            </div>
                            <div className="control col-lg-6 col-md-12 pc-padding-left">
                                <TextInput
                                    autoComplete="registration_phone_number"
                                    field="registration_phone_number"
                                    id="registration_phone_number"
                                    validationSchema={phoneValidation(t)}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    Mobile phone number (without hyphen) *
                                </span>
                            </div>
                            <div className="control col-lg-6 col-md-12 member-select pc-padding-right">
                                <SelectInput
                                    field="nationality"
                                    id="nationality"
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                    validate={isRequired(t)}
                                    initialValue="JP"
                                >
                                    <Option value="" disabled>
                                        Please select
                                    </Option>
                                    {nationalities.map(nationality => (
                                        <Option
                                            key={nationality.value}
                                            value={nationality.value}
                                        >
                                            {nationality.label}
                                        </Option>
                                    ))}
                                    <optgroup disabled />
                                </SelectInput>
                                <span className="member-form--lable">
                                    Country of Citizenship *
                                </span>
                            </div>
                            <div className="control col-lg-6 col-md-12 member-select pc-padding-left">
                                <SelectInput
                                    field="occupation"
                                    id="occupation"
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                    validate={isRequired(t)}
                                >
                                    <Option value="" disabled>
                                        Please select
                                    </Option>
                                    {occupations.map(occupation => (
                                        <Option
                                            key={occupation.value}
                                            value={occupation.value}
                                        >
                                            {occupation.label}
                                        </Option>
                                    ))}
                                    <optgroup disabled />
                                </SelectInput>
                                <span className="member-form--lable">
                                    Profession *
                                </span>
                            </div>
                        </div>
                        <MainPageTitle title={t('mypage::Credit Card')} />
                        <div className="row w-100p">
                            <div className="control col-lg-6 col-md-12 pc-padding-right">
                                <TextInput
                                    field="card_number"
                                    id="card_number"
                                    validationSchema={inputCardNumberValidation(
                                        t
                                    )}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    Card Number *
                                </span>
                            </div>
                            <div className="control col-lg-6 col-md-12 pc-padding-left">
                                <TextInput
                                    field="card_name"
                                    id="card_name"
                                    validationSchema={inputValidationName(t)}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    Card Holder *
                                </span>
                            </div>
                            <div className="control col-lg-6 col-md-12 pc-padding-right">
                                <TextInput
                                    field="expired_month"
                                    id="expired_month"
                                    validationSchema={expiredMontValidation}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                    placeholder="mm/yy"
                                />
                                <span className="member-form--lable">
                                    Date of Expiry *
                                </span>
                            </div>
                            <div className="control col-lg-6 col-md-12 pc-padding-left">
                                <TextInput
                                    field="cvc"
                                    id="cvc"
                                    validationSchema={inputCVCNumberValidation(
                                        t
                                    )}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    CVC *
                                </span>
                            </div>
                            <div className="control col-lg-6 col-md-12 member-select pc-padding-right">
                                <SelectInput
                                    field="country"
                                    id="country"
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                    validate={isRequired(t)}
                                    onValueChange={onCountryChanged}
                                    initialValue="JP"
                                >
                                    <Option value="" disabled>
                                        Please select
                                    </Option>
                                    {countries.map(country => (
                                        <Option
                                            key={country.id}
                                            value={country.id}
                                        >
                                            {country.full_name_english ||
                                            country.full_name_locale ||
                                            country.id}
                                        </Option>
                                    ))}
                                    <optgroup disabled />
                                </SelectInput>
                                <span className="member-form--lable">
                                    Country of Residence *
                                </span>
                            </div>
                            <div className="control col-lg-6 col-md-12 pc-padding-left">
                                <TextInput
                                    field="postal_code"
                                    id="postal_code"
                                    validationSchema={postalCodeValidation(t)}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    Zip Code (without hyphen) *
                                </span>
                            </div>
                            <div
                                className={`control col-lg-6 col-md-12 pc-padding-right ${
                                    regions.length ? 'member-select' : ''
                                }`}
                            >
                                {regions.length === 0 ? (
                                    <TextInput
                                        field="state"
                                        id="state"
                                        validate={isRequired(t)}
                                        classes={{
                                            input: 'member-form form-scale'
                                        }}
                                    />
                                ) : (
                                    <SelectInput
                                        field="state_region_id"
                                        id="state"
                                        classes={{
                                            input: 'member-form form-scale'
                                        }}
                                        validationSchema={inputValidationHasComma(
                                            t,
                                            50
                                        )}
                                    >
                                        <Option value="" disabled>
                                            Please select
                                        </Option>
                                        {regions.map(region => (
                                            <Option
                                                key={region.id}
                                                value={region.id}
                                            >
                                                {region.default_name}
                                            </Option>
                                        ))}
                                        <optgroup disabled />
                                    </SelectInput>
                                )}
                                <span className="member-form--lable">
                                    Prefectures *
                                </span>
                            </div>
                            <div className="control col-lg-6 col-md-12 pc-padding-left">
                                <TextInput
                                    field="city"
                                    id="city"
                                    validationSchema={inputValidationCity(t)}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    Municipalities *
                                </span>
                            </div>
                            <div className="control col-lg-12 col-md-12 ">
                                <TextInput
                                    field="line1"
                                    id="line1"
                                    validationSchema={inputValidationAddress(t)}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    Street Address *
                                </span>
                            </div>
                            <div className="control col-lg-12 col-md-12 ">
                                <TextInput
                                    field="line2"
                                    id="line2"
                                    validationSchema={inputValidationAddress(
                                        t,
                                        false
                                    )}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    Building name, room number, etc.
                                </span>
                            </div>
                        </div>
                        <div className="member-pay partner-box">
                            <span>"Payment of membership fee"</span>
                            <span>
                                Next payment date ： {Moment().format('YYYY/MM/DD')}
                            </span>
                            <span>
                                Billing amount ： USD{customer.partner_payment_amount}
                            </span>
                        </div>
                        <div className="member-submit">
                            <button
                                type="submit"
                                className="member-submit--link"
                                disabled={
                                    isCreatingCustomer ||
                                    !customer.can_register_platinum_partner
                                }
                            >
                                {t('mypage::REGISTER')}
                            </button>
                        </div>
                    </div>
                </div>
            </Form>
        </>
    );
};

export default RegisterPlatinumPartner;
