import React from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from '@skp/components/TextInput';
import SelectInput from '@skp/components/SelectInput';
import MonthDropdownOption from '@skp/components/MonthDropdownOption';
import YearDropdownOptions from '@skp/components/YearDropdownOptions';

import { Option } from 'informed';
import {
    isRequired,
    inputCardNumberValidation,
    inputCVCNumberValidation,
    cartExpiredDateValidation,
    inputValidationName,
    inputValidationAddress,
    phoneValidation,
    emailValidation
} from '@skp/utils/formValidators';

import { BRAND_CARD } from '@skp/config';

export default function BillingAddressInput({
    customer,
    countries,
    contactCountryCodes,
    onCountryChanged,
    regions
}) {
    const { t } = useTranslation(['validation', 'address']);

    const regAddress2 =
        customer.registration_address2 != null
            ? customer.registration_address2
            : '';

    return (
        <div className="exguest-pay member-file" style={{ paddingLeft: '0px' }}>
            <h3 className="exguest-pay--name">支払詳細</h3>
            <div className="row">
                <div className="col-lg-6 col-md-6 exguest-pay-left">
                    <h4 className="exguest-pay--title">カード情報</h4>
                    <div className="exguest-block">
                        <div className="col-md-12 row">
                            <div className="control col-lg-6 col-md-12 member-select pc-padding-right">
                                <SelectInput
                                    field="card_brand"
                                    id="brand"
                                    validate={isRequired(t)}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                    validateOnBlur
                                    validateOnChange
                                >
                                    <Option value="" disabled>
                                        いずれかをお選びください
                                    </Option>
                                    {BRAND_CARD.map(brand => (
                                        <Option
                                            key={brand.brand}
                                            value={brand.brand}
                                        >
                                            {brand.name}
                                        </Option>
                                    ))}
                                    <optgroup disabled />
                                </SelectInput>
                                <span className="member-form--lable">
                                    カードタイプ *
                                </span>
                            </div>
                            <div className="control col-lg-6 col-md-12 pc-padding-left">
                                <TextInput
                                    field="card_number"
                                    id="card-number"
                                    validationSchema={inputCardNumberValidation(
                                        t
                                    )}
                                    validateOnBlur
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    カード番号 *
                                </span>
                            </div>
                            <div className="control col-lg-6 col-md-12 member-select pc-padding-right">
                                <SelectInput
                                    field="card_exp_month"
                                    id="card_exp_month"
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                    validate={isRequired(t)}
                                    validateOnBlur
                                    validateOnChange
                                >
                                    <Option value="" disabled>
                                        選択してください
                                    </Option>
                                    <MonthDropdownOption />
                                    <optgroup disabled />
                                </SelectInput>

                                <span className="member-form--lable">
                                    カード有効期限（月）*
                                </span>
                            </div>
                            <div className="control col-lg-6 col-md-12 member-select pc-padding-left">
                                <SelectInput
                                    field="card_exp_year"
                                    id="card_exp_year"
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                    validate={(value, values) =>
                                        cartExpiredDateValidation(
                                            t,
                                            value,
                                            values.card_exp_month
                                        )
                                    }
                                    validateOnBlur
                                    validateOnChange
                                >
                                    <Option value="" disabled>
                                        選択してください
                                    </Option>
                                    <YearDropdownOptions />
                                    <optgroup disabled />
                                </SelectInput>
                                <span className="member-form--lable">
                                    カード有効期限（年）*
                                </span>
                            </div>
                            <div className="control col-lg-6 col-md-12 pc-padding-right">
                                <TextInput
                                    field="card_cvc"
                                    id="card-cvc"
                                    validationSchema={inputCVCNumberValidation(
                                        t
                                    )}
                                    validateOnBlur
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    セキュリティコード *
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 exguest-pay-right">
                    <h4 className="exguest-pay--title">請求先住所</h4>
                    <div className="exguest-block row">
                        <div className="control col-lg-6 col-md-12 pc-padding-right">
                            <TextInput
                                field="card_family_name"
                                id="card_family_name"
                                validationSchema={inputValidationName(t)}
                                validateOnBlur
                                initialValue={customer.lastname}
                                placeholder={t('address::Last name')}
                                classes={{
                                    input: 'member-form form-scale'
                                }}
                            />
                            <span className="member-form--lable">
                                名前（{t('address::Last name')}） *
                            </span>
                        </div>
                        <div className="control col-lg-6 col-md-12 pc-padding-left">
                            <TextInput
                                field="card_given_name"
                                id="card_given_name"
                                validationSchema={inputValidationName(t)}
                                validateOnBlur
                                initialValue={customer.firstname}
                                placeholder={t('address::First name')}
                                classes={{
                                    input: 'member-form form-scale'
                                }}
                            />
                            <span className="member-form--lable">
                                名前（{t('address::First name')}） *
                            </span>
                        </div>
                        <div className="control col-lg-12 col-md-12">
                            <TextInput
                                field="email"
                                id="email"
                                validationSchema={emailValidation(t)}
                                validateOnBlur
                                initialValue={customer.email}
                                placeholder="Eメールアドレス"
                                classes={{
                                    input: 'member-form form-scale'
                                }}
                            />
                            <span className="member-form--lable">
                                Eメールアドレス *
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
                                validateOnChange
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
                            <span className="member-form--lable">
                                連絡先国番号 *
                            </span>
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
                                classes={{
                                    input: 'member-form form-scale'
                                }}
                            />
                            <span className="member-form--lable">
                                電話番号 *
                            </span>
                        </div>
                        <div className="control col-lg-6 col-md-12 member-select pc-padding-right">
                            <SelectInput
                                field="registration_country"
                                id="registration_country"
                                initialValue={customer.registration_country}
                                classes={{ input: 'member-form form-scale' }}
                                validate={isRequired(t)}
                                validateOnBlur
                                validateOnChange
                                onValueChange={onCountryChanged}
                            >
                                <Option value="" disabled>
                                    選択してください
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
                            <span className="member-form--lable">居住国 *</span>
                        </div>
                        <div
                            className={`${
                                regions.length ? 'member-select' : null
                            } control col-lg-6 col-md-12 pc-padding-left`}
                        >
                            {regions.length === 0 ? (
                                <TextInput
                                    field="registration_state"
                                    id="registration_state"
                                    validate={isRequired(t)}
                                    validateOnBlur
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                            ) : (
                                <SelectInput
                                    field="registration_state"
                                    id="registration_state"
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                    validate={isRequired(t)}
                                    validateOnBlur
                                    validateOnChange
                                    initialValue={customer.registration_state}
                                >
                                    <Option value="" disabled>
                                        選択してください
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
                            )}
                            <span className="member-form--lable">
                                都道府県 *
                            </span>
                        </div>
                        <div className="control col-lg-12 col-md-12">
                            <TextInput
                                autoComplete="address"
                                field="address"
                                id="address"
                                validationSchema={inputValidationAddress(t)}
                                validateOnBlur
                                initialValue={
                                    customer.registration_city +
                                    ' ' +
                                    customer.registration_address1 +
                                    ' ' +
                                    regAddress2
                                }
                                classes={{ input: 'member-form form-scale' }}
                            />
                            <span className="member-form--lable">住所 *</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
