import React, { useState, useRef } from 'react';
import useProfile from './useProfile';
import classes from './myPage.css';
import { Form, Option } from 'informed';
import TextInput from '@skp/components/TextInput';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import OfferChangeGrade from '@skp/components/OfferChangeGrade';
import OfferTerminate from '@skp/components/OfferTerminate';
import UpdateEmailForm from './UpdateEmailForm';
import UpdatePasswordForm from './UpdatePasswordForm';
import SelectInput from '@skp/components/SelectInput';
import DateOfBirth from '@skp/components/DatePickerInput/dateOfBirth';
import {
    isRequired,
    inputValidationAddress,
    phoneValidation,
    postalCodeValidation,
    inputValidationName,
    inputValidationHasComma,
    inputValidationCity
} from '@skp/utils/formValidators';

import { getErrorMessage } from '@skp/utils/graphqlError';
import MainPageTitle from '@skp/components/MainPageTitle';
import { useTranslation } from 'react-i18next';
import AlertMessage from '@skp/components/AlertMessage';
import { usePostCodeSearching } from './usePostCodeSearching';
import { SITE_LINKS } from '@skp/config';
import TargetBlankLink from '@skp/components/TargetBlankLink';

const Profile = () => {
    const { t } = useTranslation(['validation', 'address']);
    const formApiRef = useRef();
    const {
        customer,
        countries,
        isUpdatingCustomer,
        updateCustomerError,
        updateCustomerResponse,
        newOfferGradeCanUpdate,
        newOfferTerminateCanUpdate,
        changeType,
        userGroup,
        loadingCustomer,
        regions,
        contactCountryCodes,
        nationalities,
        occupations,
        isChangingType,
        handleSubmit,
        onCountryChanged,
        setIsChangingType,
        setChangeType,
        setNewOfferGradeCanUpdate,
        setNewOfferTerminateCanUpdate,
        reloadCustomer,
        errorLoadingCustomer,
        genders
    } = useProfile();

    const { onPostalCodeChanged } = usePostCodeSearching(
        regions,
        customer,
        formApiRef
    );

    const [isShowUpdateEmail, setIsShowUpdateEmail] = useState(false);
    const [isShowUpdatePassword, setIsShowUpdatePassword] = useState(false);

    if (loadingCustomer) {
        return <LoadingIndicator />;
    }

    return (
        <>
            {isUpdatingCustomer && (
                <div>
                    <LoadingIndicator global={true} />
                </div>
            )}
            {errorLoadingCustomer && (
                <AlertMessage type="error">
                    {getErrorMessage(errorLoadingCustomer.message)}
                </AlertMessage>
            )}
            <div className="row">
                <div className="mypage member-info col-lg-6 col-md-12">
                    <MainPageTitle title="My Profile" />
                    <p className="member-uid">UID {customer.uid}</p>
                    <div
                        className={
                            customer.group == 'PLATINUM'
                                ? 'side-images-platinum'
                                : 'side-images-gold'
                        }
                    >
                        <span>{customer.group}</span>
                    </div>
                    <div className="control">
                        <input
                            className="member-form form-scale"
                            type="text"
                            readOnly
                            defaultValue={customer.email}
                        />
                        <span className="member-form--lable">
                            Email Address
                        </span>
                    </div>
                    <div className="member-btn">
                        <a
                            className="member-btn--link btn-animation"
                            onClick={e => {
                                e.preventDefault();
                                setIsShowUpdateEmail(!isShowUpdateEmail);
                            }}
                            href="#"
                        >
                            Email Address Change
                        </a>
                    </div>
                    {isShowUpdateEmail && (
                        <UpdateEmailForm user={customer} classes={classes} />
                    )}

                    <div className="member-btn">
                        <a
                            className="member-btn--link btn-animation"
                            onClick={e => {
                                e.preventDefault();
                                setIsShowUpdatePassword(!isShowUpdatePassword);
                            }}
                            href="#"
                        >
                            Change Login Password
                        </a>
                    </div>
                    {isShowUpdatePassword && (
                        <UpdatePasswordForm classes={classes} />
                    )}

                    <div className="member-pay">
                        <span>[Payment of Membership fee]</span>
                        <span>
                            Next payment date:
                            {customer.next_payment_date}
                        </span>
                        <span>
                            Next payment amount：USD {customer.next_payment_amount}
                        </span>
                    </div>
                    <div className="member-pay-btn">
                        {customer.new_change_type_can_update !== undefined && (
                            <OfferChangeGrade
                                changeType={changeType}
                                newOfferGradeCanUpdate={newOfferGradeCanUpdate}
                                isChangingType={isChangingType}
                                userGroup={userGroup}
                                setIsChangingType={setIsChangingType}
                                setChangeType={setChangeType}
                                setNewOfferGradeCanUpdate={
                                    setNewOfferGradeCanUpdate
                                }
                                reloadCustomer={reloadCustomer}
                            />
                        )}
                        {customer.new_change_type_can_update !== undefined && (
                            <OfferTerminate
                                changeType={changeType}
                                newOfferTerminateCanUpdate={
                                    newOfferTerminateCanUpdate
                                }
                                isChangingType={isChangingType}
                                userGroup={userGroup}
                                setIsChangingType={setIsChangingType}
                                setChangeType={setChangeType}
                                setNewOfferTerminateCanUpdate={
                                    setNewOfferTerminateCanUpdate
                                }
                                reloadCustomer={reloadCustomer}
                            />
                        )}
                    </div>
                    <div className="member-des">
                        On the day of settlement, online processing is not possible if the annual membership fee is paid
                        Sorry to trouble you, but
                        <TargetBlankLink
                            href={SITE_LINKS['support']}
                            rel="noopener noreferrer"
                            className="member-des--link"
                        >
                             Inquiry 
                        </TargetBlankLink>
                        Please contact the support desk.
                        Also, if there is a problem with the above profile input items,
                        Please make the change before applying.
                    </div>
                </div>
                <div className="mypage member-file col-lg-6 col-md-12">
                    <MainPageTitle title="profile" />
                    <Form
                        onSubmit={handleSubmit}
                        apiRef={formApiRef}
                        className="row"
                    >
                        <div className="control col-lg-12 col-md-12">
                            <TextInput
                                field="lastname"
                                id="lastname"
                                validationSchema={inputValidationName(t)}
                                validateOnBlur
                                initialValue={customer.lastname}
                                classes={{
                                    input:
                                        'member-form form-scale text-uppercase'
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
                                validateOnBlur
                                initialValue={customer.firstname}
                                classes={{
                                    input:
                                        'member-form form-scale text-uppercase'
                                }}
                            />
                            <span className="member-form--lable">
                                {t('address::First name')} *
                            </span>
                        </div>
                        <div className="control col-lg-6 col-md-12 member-select pc-padding-right">
                            <SelectInput
                                field="gender"
                                id="gender"
                                classes={{
                                    input: 'member-form form-scale'
                                }}
                                initialValue={customer.gender}
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
                            <span className="member-form--lable">Gender *</span>
                        </div>
                        <div className="control col-lg-6 col-md-12 member-select pc-padding-left">
                            <SelectInput
                                field="occupation"
                                id="occupation"
                                initialValue={customer.occupation}
                                classes={{ input: 'member-form form-scale' }}
                                validate={isRequired(t)}
                                validateOnBlur
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
                            <span className="member-form--lable">Job *</span>
                        </div>
                        <div className="control col-lg-6 col-md-12 dob pc-padding-right">
                            <DateOfBirth
                                datePickerClass={
                                    'form-control member-form form-scale'
                                }
                                datePickerPlaceholder={'YYYY/mm/dd'}
                                datePickerFormat={'yyyy/MM/dd'}
                                datePickerField={'dob'}
                                datePickerAutoComplete={'off'}
                                initialValue={customer.dob}
                            />
                            <span className="member-form--lable">
                                Birthday *
                            </span>
                        </div>
                        <div className="control col-lg-6 col-md-12 member-select pc-padding-left">
                            <SelectInput
                                field="nationality"
                                id="nationality"
                                initialValue={customer.nationality}
                                classes={{ input: 'member-form form-scale' }}
                                validate={isRequired(t)}
                                validateOnBlur
                            >
                                <Option value="" disabled>
                                    Select Nationality...
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
                            <span className="member-form--lable">Nation *</span>
                        </div>
                        <div className="control col-lg-6 col-md-12 member-select pc-padding-right">
                            <SelectInput
                                field="registration_country"
                                id="registration_country"
                                initialValue={customer.registration_country}
                                classes={{ input: 'member-form form-scale' }}
                                validate={isRequired(t)}
                                validateOnBlur
                                onValueChange={onCountryChanged}
                            >
                                <Option value="" disabled>
                                    Please select
                                </Option>
                                {countries.map(country => (
                                    <Option key={country.id} value={country.id}>
                                        {country.full_name_english ||
                                            country.full_name_locale ||
                                            country.id}
                                    </Option>
                                ))}
                                <optgroup disabled />
                            </SelectInput>
                            <span className="member-form--lable">Residence *</span>
                        </div>
                        <div className="control col-lg-6 col-md-12 pc-padding-left">
                            <TextInput
                                field="registration_postal_code"
                                id="registration_postal_code"
                                initialValue={customer.registration_postal_code}
                                validationSchema={postalCodeValidation(t)}
                                validateOnBlur
                                classes={{ input: 'member-form form-scale' }}
                                onValueChange={onPostalCodeChanged}
                            />
                            <span className="member-form--lable">
                                Zip Code (No hyphen)*
                            </span>
                        </div>
                        {regions.length === 0 ? (
                            <div className="controlcol-lg-6 col-md-12 pc-padding-right">
                                <TextInput
                                    field="registration_state"
                                    id="registration_state"
                                    validationSchema={inputValidationHasComma(
                                        t,
                                        50
                                    )}
                                    validateOnBlur
                                    initialValue={customer.registration_state}
                                    classes={{
                                        input:
                                            'member-form form-scale text-uppercase'
                                    }}
                                />
                                <span className="member-form--lable">
                                    prefectures *
                                </span>
                            </div>
                        ) : (
                            <div className="control col-lg-6 col-md-12 member-select pc-padding-right">
                                <SelectInput
                                    field="registration_state"
                                    id="registration_state"
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                    validate={isRequired(t)}
                                    validateOnBlur
                                    initialValue={customer.registration_state}
                                >
                                    <Option value="" disabled>
                                        Please select
                                    </Option>
                                    {regions.map(region => (
                                        <Option
                                            key={region.id}
                                            value={region.default_name}
                                        >
                                            {region.default_name}
                                        </Option>
                                    ))}
                                    <optgroup disabled />
                                </SelectInput>
                                <span className="member-form--lable">
                                    prefectures *
                                </span>
                            </div>
                        )}
                        <div className="control col-lg-6 col-md-12 pc-padding-left">
                            <TextInput
                                field="registration_city"
                                id="registration_city"
                                validationSchema={inputValidationCity(t)}
                                validateOnBlur
                                initialValue={customer.registration_city}
                                classes={{
                                    input:
                                        'member-form form-scale text-uppercase'
                                }}
                            />
                            <span className="member-form--lable">
                                municipalities *
                            </span>
                        </div>
                        <div className="control col-lg-12 col-md-12">
                            <TextInput
                                field="registration_address1"
                                id="registration_address1"
                                validationSchema={inputValidationAddress(t)}
                                initialValue={customer.registration_address1}
                                validateOnBlur
                                classes={{
                                    input:
                                        'member-form form-scale text-uppercase'
                                }}
                            />
                            <span className="member-form--lable">
                                Street address *
                            </span>
                        </div>
                        <div className="control col-lg-12 col-md-12 ">
                            <TextInput
                                field="registration_address2"
                                id="registration_address2"
                                initialValue={customer.registration_address2}
                                validationSchema={inputValidationAddress(
                                    t,
                                    false
                                )}
                                classes={{
                                    input:
                                        'member-form form-scale text-uppercase'
                                }}
                            />
                            <span className="member-form--lable">
                                Building name, room number, etc.
                            </span>
                        </div>
                        <div className="control col-lg-6 col-md-12 member-select pc-padding-right">
                            <SelectInput
                                field="registration_country_number"
                                id="registration_country_number"
                                initialValue={
                                    customer.registration_country_number
                                }
                                classes={{ input: 'member-form form-scale' }}
                                validate={isRequired(t)}
                                validateOnBlur
                            >
                                <Option value="" disabled>
                                    Select Country Code...
                                </Option>
                                {contactCountryCodes.map(contactCountryCode => (
                                    <Option
                                        key={contactCountryCode.value}
                                        value={contactCountryCode.value}
                                    >
                                        {contactCountryCode.label}
                                    </Option>
                                ))}
                                <optgroup disabled />
                            </SelectInput>
                            <span className="member-form--lable">Country code *</span>
                        </div>
                        <div className="control col-lg-6 col-md-12 pc-padding-left">
                            <TextInput
                                autoComplete="registration_phone_number"
                                field="registration_phone_number"
                                id="registration_phone_number"
                                validationSchema={phoneValidation(t)}
                                validateOnBlur
                                initialValue={
                                    customer.registration_phone_number
                                }
                                classes={{ input: 'member-form form-scale' }}
                            />
                            <span className="member-form--lable">
                                Phone number *
                            </span>
                        </div>
                        {updateCustomerResponse && (
                            <AlertMessage type="info">
                                Has been updated
                            </AlertMessage>
                        )}

                        {updateCustomerError && (
                            <AlertMessage type="error">
                                {getErrorMessage(updateCustomerError.message)}
                            </AlertMessage>
                        )}
                        <div className="member-submit">
                            <button
                                type="submit"
                                className="member-submit--link"
                                disabled={isUpdatingCustomer}
                            >
                                Save
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default Profile;
