import React, { useRef } from 'react';
import TextInput from '@skp/components/TextInput';
import SelectInput from '@skp/components/SelectInput';
import { Form, Option } from 'informed';
import {
    isRequired,
    phoneValidation,
    validateConfirmPassword,
    inputValidationAddress,
    inputValidationName,
    inputValidationCity,
    inputValidationShippingAddress,
    postalCodeValidation
} from '@skp/utils/formValidators';
import { useSignUpStep1 } from './useSignUpStep1';
import createAccountOperations from './signUpStep1.gql';
import DateOfBirth from '@skp/components/DatePickerInput/dateOfBirth';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { usePostCodeSearching } from './usePostCodeSearching';
import { Redirect, resourceUrl } from '@skp/drivers';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '@skp/utils/graphqlError';

const SignUpStep1 = ({ stepList }) => {
    const { t } = useTranslation(['validation', 'address']);
    const formApiRef = useRef();
    const talonProps = useSignUpStep1({
        createAccountOperations
    });

    const {
        email,
        firstName,
        lastName,
        countries,
        genders,
        contact_country_codes,
        nationalities,
        occupations,
        inProgress,
        errorMessage,
        isRedirectFromStep0,
        handleRegisterCustomer,
        getStatesOfCountry
    } = talonProps;

    const {
        onCountryRegisterChanged,
        onPostalCodeChangedRegisterAddress,
        onChangedPhoneNumberShipping,
        registerRegions,
        onPostalCodeChangedShippingAddress,
        shippingRegions
    } = usePostCodeSearching(getStatesOfCountry, formApiRef);

    if (!isRedirectFromStep0) {
        return <Redirect to={resourceUrl('/login')} />;
    }

    return (
        <div className="container">
            <div className="main-content">
                <div className="reg-block--step2">
                    <div className="regstep1">
                        {stepList}
                        <div className="reg-welcome">
                            Welcome to SKY PREMIUM <br />
                            You’re two steps away to discover life’s treasures.
                        </div>
                        <Form
                            className="reg-form"
                            onSubmit={handleRegisterCustomer}
                            apiRef={formApiRef}
                        >
                            <div className="reg-block">
                                <div className="reg-join">
                                    <h2 className="reg-subtitle row">
                                        ログインパスワードの設定
                                    </h2>
                                    <div className="reg-form reg-confirm row">
                                        <div className="control col-xl-12 col-lg-12 col-md-12 col-xs-12">
                                            <TextInput
                                                field="email"
                                                id="email"
                                                initialValue={email}
                                                disabled={true}
                                                classes={{
                                                    input: 'form-control'
                                                }}
                                            />
                                            <span className="input-lable">
                                                メールアドレス
                                            </span>
                                        </div>
                                        <div className="control col-xl-6 col-lg-6 col-md-6 col-xs-12 reg-pass-left">
                                            <TextInput
                                                type="password"
                                                field="password"
                                                id="password"
                                                validate={isRequired(t)}
                                                classes={{
                                                    input: 'form-control'
                                                }}
                                                autoComplete="new-password"
                                            />
                                            <span className="input-lable">
                                                パスワード
                                            </span>
                                        </div>
                                        <div className="control col-xl-6 col-lg-6 col-md-6 col-xs-12 reg-pass-right">
                                            <TextInput
                                                type="password"
                                                id="password_confirm"
                                                field="passwordConfirm"
                                                validate={
                                                    (isRequired(t),
                                                    (value, values) =>
                                                        validateConfirmPassword(
                                                            t,
                                                            value,
                                                            values,
                                                            'password'
                                                        ))
                                                }
                                                classes={{
                                                    input: 'form-control'
                                                }}
                                                autoComplete="new-password"
                                            />
                                            <span className="input-lable">
                                                パスワード（確認）
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="reg-join">
                                    <div className="reg-subtitle-caution">
                                        <h2 className="reg-subtitle row">
                                            会員情報
                                        </h2>
                                        <div className="reg-caution">
                                            ※全て半角英数字でご入力ください。
                                        </div>
                                    </div>
                                    <div className="reg-form reg-confirm row">
                                        <div className="control col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <TextInput
                                                field="lastname"
                                                id="lastname"
                                                initialValue={lastName}
                                                disabled={true}
                                                classes={{
                                                    input:
                                                        'form-control text-uppercase'
                                                }}
                                                validationSchema={inputValidationName(
                                                    t
                                                )}
                                            />
                                            <span className="input-lable">
                                                {t('address::Last name')}
                                            </span>
                                        </div>
                                        <div className="control col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <TextInput
                                                field="firstname"
                                                id="firstname"
                                                initialValue={firstName}
                                                disabled={true}
                                                classes={{
                                                    input:
                                                        'form-control text-uppercase'
                                                }}
                                                validationSchema={inputValidationName(
                                                    t
                                                )}
                                                autoComplete="none"
                                            />
                                            <span className="input-lable">
                                                {t('address::First name')}
                                            </span>
                                        </div>
                                        <div className="control control-down col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <SelectInput
                                                field="gender"
                                                id="gender"
                                                classes={{
                                                    input: 'reg-select'
                                                }}
                                                validate={isRequired(t)}
                                            >
                                                <Option value="" disabled>
                                                    選択してください
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
                                            <span className="input-lable">
                                                性別
                                            </span>
                                        </div>
                                        <div className="control dob col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <DateOfBirth
                                                datePickerClass={'form-control'}
                                                datePickerPlaceholder={
                                                    'yyyy/mm/dd'
                                                }
                                                datePickerFormat={'yyyy/MM/dd'}
                                                datePickerField={'dob'}
                                                datePickerAutoComplete={'off'}
                                            />
                                            <span className="input-lable">
                                                生年月日
                                            </span>
                                        </div>
                                        <div className="control control-down col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <SelectInput
                                                field="nationality"
                                                id="nationality"
                                                classes={{
                                                    input: 'reg-select'
                                                }}
                                                validate={isRequired(t)}
                                                initialValue="JP"
                                            >
                                                <Option value="" disabled>
                                                    選択してください
                                                </Option>
                                                {nationalities.map(n => (
                                                    <Option
                                                        key={n.value}
                                                        value={n.value}
                                                    >
                                                        {n.label}
                                                    </Option>
                                                ))}
                                                <optgroup disabled />
                                            </SelectInput>
                                            <span className="input-lable">
                                                国籍
                                            </span>
                                        </div>
                                        <div className="control control-down col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <SelectInput
                                                field="occupation"
                                                id="occupation"
                                                classes={{
                                                    input: 'reg-select'
                                                }}
                                                validate={isRequired(t)}
                                            >
                                                <Option value="" disabled>
                                                    選択してください
                                                </Option>
                                                {occupations.map(o => (
                                                    <Option
                                                        key={o.value}
                                                        value={o.value}
                                                    >
                                                        {o.label}
                                                    </Option>
                                                ))}
                                                <optgroup disabled />
                                            </SelectInput>
                                            <span className="input-lable">
                                                職業
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="reg-join reg-cus">
                                    <div className="reg-subtitle-caution">
                                        <h2 className="reg-subtitle row">
                                            ご自宅住所
                                        </h2>
                                        <div className="reg-caution">
                                            ※全て半角英数字でご入力ください。
                                        </div>
                                    </div>
                                    <div className="reg-form reg-confirm row">
                                        <div className="control control-down col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <SelectInput
                                                field="registration_country"
                                                id="registration_country"
                                                classes={{
                                                    input: 'reg-select'
                                                }}
                                                validate={isRequired(t)}
                                                onValueChange={
                                                    onCountryRegisterChanged
                                                }
                                                initialValue="JP"
                                            >
                                                <Option value="" disabled>
                                                    選択してください
                                                </Option>
                                                {countries.map(country => (
                                                    <Option
                                                        key={country.id}
                                                        value={country.id}
                                                    >
                                                        {country.full_name_english ||
                                                            country.id}
                                                    </Option>
                                                ))}
                                                <optgroup disabled />
                                            </SelectInput>
                                            <span className="input-lable">
                                                居住国
                                            </span>
                                        </div>
                                        <div className="control col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <TextInput
                                                field="registration_postal_code"
                                                id="registration_postal_code"
                                                classes={{
                                                    input: 'form-control'
                                                }}
                                                validationSchema={postalCodeValidation(
                                                    t
                                                )}
                                                onValueChange={
                                                    onPostalCodeChangedRegisterAddress
                                                }
                                                autoComplete="none"
                                            />
                                            <span className="input-lable">
                                                郵便番号（ハイフン無し）
                                            </span>
                                        </div>
                                        <div
                                            className={`control col-xl-6 col-lg-6 col-md-6 col-xs-12 ${
                                                registerRegions.length === 0
                                                    ? ''
                                                    : 'control-down'
                                            }`}
                                        >
                                            {registerRegions.length === 0 ? (
                                                <TextInput
                                                    field="registration_state"
                                                    id="registration_state"
                                                    validate={isRequired(t)}
                                                    classes={{
                                                        input: 'form-control'
                                                    }}
                                                    autoComplete="none"
                                                />
                                            ) : (
                                                <SelectInput
                                                    field="registration_state"
                                                    id="registration_state"
                                                    classes={{
                                                        input: 'reg-select'
                                                    }}
                                                    validate={isRequired(t)}
                                                >
                                                    <Option value="" disabled>
                                                        選択してください
                                                    </Option>
                                                    {registerRegions.map(
                                                        region => (
                                                            <Option
                                                                key={region.id}
                                                                value={
                                                                    region.default_name
                                                                }
                                                            >
                                                                {
                                                                    region.default_name
                                                                }
                                                            </Option>
                                                        )
                                                    )}
                                                    <optgroup disabled />
                                                </SelectInput>
                                            )}
                                            <span className="input-lable">
                                                都道府県
                                            </span>
                                        </div>
                                        <div className="control col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <TextInput
                                                field="registration_city"
                                                id="registration_city"
                                                validationSchema={inputValidationCity(
                                                    t
                                                )}
                                                classes={{
                                                    input:
                                                        'form-control text-uppercase'
                                                }}
                                                autoComplete="none"
                                            />
                                            <span className="input-lable">
                                                市区町村
                                            </span>
                                        </div>
                                        <div className="control col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <TextInput
                                                field="registration_address1"
                                                id="registration_address1"
                                                validationSchema={inputValidationAddress(
                                                    t
                                                )}
                                                classes={{
                                                    input:
                                                        'form-control text-uppercase'
                                                }}
                                                autoComplete="none"
                                            />
                                            <span className="input-lable">
                                                番地以下
                                            </span>
                                        </div>
                                        <div className="control col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <TextInput
                                                field="registration_address2"
                                                id="registration_address2"
                                                initialValue={''}
                                                classes={{
                                                    input:
                                                        'form-control text-uppercase'
                                                }}
                                                validationSchema={inputValidationAddress(
                                                    t,
                                                    false
                                                )}
                                                autoComplete="none"
                                            />
                                            <span className="input-lable">
                                                建物名・号室等
                                            </span>
                                        </div>
                                        <div className="control control-down col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <SelectInput
                                                field="registration_country_number"
                                                id="registration_country_number"
                                                classes={{
                                                    input: 'reg-select'
                                                }}
                                                validate={isRequired(t)}
                                                initialValue="81"
                                            >
                                                <Option value="" disabled>
                                                    選択してください
                                                </Option>
                                                {contact_country_codes.map(
                                                    code => (
                                                        <Option
                                                            key={code.value}
                                                            value={code.value}
                                                        >
                                                            {code.label}
                                                        </Option>
                                                    )
                                                )}
                                                <optgroup disabled />
                                            </SelectInput>
                                            <span className="input-lable">
                                                国番号
                                            </span>
                                        </div>
                                        <div className="control col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <TextInput
                                                field="registration_phone_number"
                                                id="registration_phone_number"
                                                validationSchema={phoneValidation(
                                                    t
                                                )}
                                                classes={{
                                                    input: 'form-control'
                                                }}
                                                onValueChange={
                                                    onChangedPhoneNumberShipping
                                                }
                                                autoComplete="none"
                                            />
                                            <span className="input-lable">
                                                電話番号（ハイフン無し）
                                            </span>
                                        </div>
                                    </div>
                                    <div className="reg-subtitle-caution">
                                        <h2 className="reg-subtitle row">
                                            ご自宅住所（配送先住所）
                                        </h2>
                                        <div className="reg-caution">
                                            ※日本語でご入力ください。
                                        </div>
                                    </div>
                                    <div className="reg-form reg-confirm row">
                                        <div className="control col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <TextInput
                                                field="shipping_address_lastname"
                                                id="shipping_address_lastname"
                                                initialValue={''}
                                                classes={{
                                                    input: 'form-control'
                                                }}
                                                validate={isRequired(t)}
                                                validationSchema={inputValidationShippingAddress(
                                                    t,
                                                    64
                                                )}
                                                autoComplete="none"
                                            />
                                            <span className="input-lable">
                                                {t('address::Last name')} *
                                            </span>
                                        </div>
                                        <div className="control col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <TextInput
                                                field="shipping_address_firstname"
                                                id="shipping_address_firstname"
                                                initialValue={''}
                                                classes={{
                                                    input: 'form-control'
                                                }}
                                                validate={isRequired(t)}
                                                validationSchema={inputValidationShippingAddress(
                                                    t,
                                                    64
                                                )}
                                                autoComplete="none"
                                            />
                                            <span className="input-lable">
                                                {t('address::First name')} *
                                            </span>
                                        </div>
                                        <div className="control col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <span className="form-control text-left">
                                                日本
                                            </span>
                                            <span className="input-lable">
                                                居住国
                                            </span>
                                            <TextInput
                                                type="hidden"
                                                field="shipping_address_country"
                                                id="shipping_address_country"
                                                classes={{
                                                    input: 'reg-select'
                                                }}
                                                validate={isRequired(t)}
                                                initialValue="JP"
                                            />
                                        </div>
                                        <div className="control col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <TextInput
                                                field="shipping_address_postal_code"
                                                id="shipping_address_postal_code"
                                                classes={{
                                                    input: 'form-control'
                                                }}
                                                validationSchema={postalCodeValidation(
                                                    t
                                                )}
                                                onValueChange={
                                                    onPostalCodeChangedShippingAddress
                                                }
                                                autoComplete="none"
                                            />
                                            <span className="input-lable">
                                                郵便番号（ハイフン無し） *
                                            </span>
                                        </div>
                                        <div
                                            className={`control col-xl-6 col-lg-6 col-md-6 col-xs-12 ${
                                                shippingRegions.length === 0
                                                    ? ''
                                                    : 'control-down'
                                            }`}
                                        >
                                            <SelectInput
                                                field="shipping_address_state"
                                                id="shipping_address_state"
                                                classes={{
                                                    input: 'reg-select'
                                                }}
                                                validate={isRequired(t)}
                                            >
                                                <Option value="" disabled>
                                                    選択してください
                                                </Option>
                                                {shippingRegions.map(region => (
                                                    <Option
                                                        key={region.id}
                                                        value={region.id}
                                                    >
                                                        {region.name}
                                                    </Option>
                                                ))}
                                                <optgroup disabled />
                                            </SelectInput>
                                            <span className="input-lable">
                                                都道府県
                                            </span>
                                        </div>
                                        <div className="control col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <TextInput
                                                field="shipping_address_city"
                                                id="shipping_address_city"
                                                validationSchema={inputValidationShippingAddress(
                                                    t,
                                                    256
                                                )}
                                                classes={{
                                                    input: 'form-control'
                                                }}
                                                autoComplete="none"
                                            />
                                            <span className="input-lable">
                                                市区町村
                                            </span>
                                        </div>
                                        <div className="control col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <TextInput
                                                field="shipping_address1"
                                                id="shipping_address1"
                                                validationSchema={inputValidationShippingAddress(
                                                    t,
                                                    127
                                                )}
                                                classes={{
                                                    input: 'form-control'
                                                }}
                                                autoComplete="none"
                                            />
                                            <span className="input-lable">
                                                番地以下
                                            </span>
                                        </div>
                                        <div className="control col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <TextInput
                                                field="shipping_address2"
                                                id="shipping_address2"
                                                initialValue={''}
                                                classes={{
                                                    input: 'form-control'
                                                }}
                                                validationSchema={inputValidationShippingAddress(
                                                    t,
                                                    127,
                                                    false
                                                )}
                                                autoComplete="none"
                                            />
                                            <span className="input-lable">
                                                建物名・号室等
                                            </span>
                                        </div>
                                        <div className="control control-down col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <SelectInput
                                                field="shipping_address_country_number"
                                                id="shipping_address_country_number"
                                                classes={{
                                                    input: 'reg-select'
                                                }}
                                                validate={isRequired(t)}
                                                initialValue="81"
                                            >
                                                <option value="81">
                                                    Japan ( +81 )
                                                </option>
                                                <optgroup disabled />
                                            </SelectInput>
                                            <span className="input-lable">
                                                国番号
                                            </span>
                                        </div>
                                        <div className="control col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <TextInput
                                                field="shipping_address_phone_number"
                                                id="shipping_address_phone_number"
                                                validationSchema={phoneValidation(
                                                    t
                                                )}
                                                classes={{
                                                    input: 'form-control'
                                                }}
                                                autoComplete="none"
                                            />
                                            <span className="input-lable">
                                                電話番号（ハイフン無し）
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {errorMessage && (
                                <p className="text-left text-danger pt-1">
                                    {getErrorMessage(errorMessage)}
                                </p>
                            )}
                            {inProgress ? (
                                <LoadingIndicator />
                            ) : (
                                <div className="reg-bottom">
                                    <button className="reg-btn" type="submit">
                                        次へ
                                    </button>
                                </div>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpStep1;
