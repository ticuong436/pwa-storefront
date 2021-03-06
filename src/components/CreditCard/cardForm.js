import React, { useRef } from 'react';
import { Form, Option, Checkbox, Select } from 'informed';
import TextInput from '@skp/components/TextInput';
import Button from '@magento/venia-ui/lib/components/Button';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useCardForm } from './useCardForm';
import { useTranslation } from 'react-i18next';
import { usePostCodeSearching } from './usePostCodeSearching';
import SelectInput from '@skp/components/SelectInput';
import {
    isRequired,
    inputCardNumberValidation,
    inputCVCNumberValidation,
    cartExpiredDateValidation,
    postalCodeValidation,
    inputValidationName,
    inputValidationAddress,
    inputValidationCity
} from '@skp/utils/formValidators';
import MainPageTitle from '@skp/components/MainPageTitle';
import AlertMessage from '@skp/components/AlertMessage';
import { getErrorMessage } from '@skp/utils/graphqlError';
import { BRAND_CARD } from '@skp/config';
import MonthDropdownOption from '@skp/components/MonthDropdownOption';
import YearDropdownOptions from '@skp/components/YearDropdownOptions';

export default function CardForm({
    onCardAdded,
    onCancel,
    card = { country: 'SG' },
    defaultChangeable = false,
    formInMyPage = true,
    forUnpaidScreen = false,
    shouldDisableSubmit = false
}) {
    const { t } = useTranslation(['validation']);
    const formApiRef = useRef();

    const {
        submitting,
        submitError,
        handleSubmit,
        isGettingUser
    } = useCardForm({ card, onCardAdded });

    const {
        countries,
        onCountryChanged,
        onPostalCodeChanged,
        regions
    } = usePostCodeSearching(card, formApiRef);

    if (isGettingUser) {
        return <LoadingIndicator />;
    }

    if (forUnpaidScreen && (submitting || shouldDisableSubmit)) {
        return <LoadingIndicator isDisplay={true} />;
    }

    return (
        <div className="credit-shipping">
            <MainPageTitle
                title={
                    card.id
                        ? '?????????????????????????????????'
                        : forUnpaidScreen
                        ? '??????????????????????????????????????????????????????'
                        : '?????????????????????????????????'
                }
            />
            {card.id ? (
                <p className="credit-shipping__des">
                    Editing Card: ???XXXXXXXX-{card.last4}
                </p>
            ) : (
                ''
            )}
            <Form onSubmit={handleSubmit} apiRef={formApiRef}>
                <div className="row credit-shipping__form">
                    <div
                        className={`col-lg-${
                            formInMyPage ? 6 : 12
                        } col-md-12 credit-shipping__col ${
                            formInMyPage ? 'shipping-left' : ''
                        }`}
                    >
                        <h3 className="credit-shipping__sub">
                            ???????????????
                            <div className="credit-shipping__required">
                                ??????????????????????????????????????????????????????
                            </div>
                        </h3>
                        <div className="member-file member-file-form row">
                            <div className="control col-lg-12 col-md-12 member-select">
                                <SelectInput
                                    field="brand"
                                    id="brand"
                                    validate={isRequired(t)}
                                    initialValue={card.brand}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                    validateOnBlur
                                    disabled={!!card.id}
                                >
                                    <Option value="" disabled>
                                        ????????????????????????
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
                                    ??????????????? *
                                </span>
                            </div>
                            <div className="control col-lg-12 col-md-12">
                                <TextInput
                                    field="name"
                                    id="name"
                                    validationSchema={inputValidationName(t)}
                                    validateOnBlur
                                    initialValue={card.name}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    ?????????????????? *
                                </span>
                            </div>
                            <div className="control col-lg-12 col-md-12">
                                <TextInput
                                    field="card_number"
                                    id="card-number"
                                    validationSchema={
                                        !card.id
                                            ? inputCardNumberValidation(t)
                                            : null
                                    }
                                    validateOnBlur
                                    initialValue={
                                        card.id
                                            ? '**** **** **** ' + card.last4
                                            : null
                                    }
                                    disabled={!!card.id}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    ??????????????? *
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
                                    initialValue={
                                        card.id ? card.exp_month : null
                                    }
                                >
                                    <Option value="" disabled>
                                        ????????????????????????
                                    </Option>
                                    <MonthDropdownOption />
                                    <optgroup disabled />
                                </SelectInput>
                                <span className="member-form--lable">
                                    ?????????????????????*
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
                                    initialValue={
                                        card.id ? card.exp_year : null
                                    }
                                >
                                    <Option value="" disabled>
                                        ????????????????????????
                                    </Option>
                                    <YearDropdownOptions card={card} />
                                    <optgroup disabled />
                                </SelectInput>
                                <span className="member-form--lable">
                                    ?????????????????????*
                                </span>
                            </div>
                            {!card.id && (
                                <div className="control col-lg-12 col-md-12">
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
                                        ??????????????????????????? *
                                    </span>
                                </div>
                            )}
                            {card.id && (
                                <div className="credit-shipping__required">
                                    <p>
                                        ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div
                        className={`col-lg-${
                            formInMyPage ? 6 : 12
                        } col-md-12 credit-shipping__col`}
                    >
                        <h3 className="credit-shipping__sub">?????????</h3>
                        <div className="member-file member-file-form row">
                            <div className="control col-lg-12 col-md-12 member-select">
                                <SelectInput
                                    field="country"
                                    id="country"
                                    validate={isRequired(t)}
                                    initialValue={card.country}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                    validateOnBlur
                                    onValueChange={onCountryChanged}
                                >
                                    <Option value="" disabled>
                                        Select country...
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
                                    ????????? *
                                </span>
                            </div>
                            <div className="control col-lg-12 col-md-12">
                                <TextInput
                                    field="postal_code"
                                    id="postal-code"
                                    validationSchema={postalCodeValidation(t)}
                                    initialValue={card.postal_code}
                                    validateOnBlur
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                    onValueChange={onPostalCodeChanged}
                                />
                                <span className="member-form--lable">
                                    ???????????????????????????????????? *
                                </span>
                            </div>
                            <div
                                className={`control col-lg-12 col-md-12 ${
                                    regions.length !== 0 ? 'member-select' : ''
                                }`}
                            >
                                {regions.length === 0 ? (
                                    <TextInput
                                        field="state"
                                        id="state"
                                        validate={isRequired(t)}
                                        validateOnBlur
                                        initialValue={card.state}
                                        classes={{
                                            input: 'member-form form-scale'
                                        }}
                                    />
                                ) : (
                                    <Select
                                        field="state_region_id"
                                        id="state"
                                        className="member-form form-scale"
                                        validate={isRequired(t)}
                                        validateOnBlur
                                    >
                                        <Option value="" disabled>
                                            ????????????????????????
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
                                    </Select>
                                )}
                                <span className="member-form--lable">
                                    ???????????? *
                                </span>
                            </div>
                            <div className="control col-lg-12 col-md-12">
                                <TextInput
                                    field="city"
                                    id="city"
                                    validationSchema={inputValidationCity(t)}
                                    initialValue={card.city}
                                    validateOnBlur
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    ???????????? *
                                </span>
                            </div>
                            <div className="control col-lg-12 col-md-12">
                                <TextInput
                                    field="address_street1"
                                    id="address-street1"
                                    validationSchema={inputValidationAddress(t)}
                                    initialValue={card.address_street1}
                                    validateOnBlur
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    ???????????? *
                                </span>
                            </div>
                            <div className="control col-lg-12 col-md-12">
                                <TextInput
                                    field="address_street2"
                                    id="address-street2"
                                    initialValue={card.address_street2}
                                    validationSchema={inputValidationAddress(
                                        t,
                                        false
                                    )}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />

                                <span className="member-form--lable">
                                    ?????????????????????
                                </span>
                            </div>
                            {defaultChangeable && (
                                <div className="form-customize col-lg-12 col-md-12">
                                    <Checkbox
                                        id="is_default"
                                        field="is_default"
                                        className="check-box__input"
                                        initialValue={card.is_default}
                                        disabled={card.is_default}
                                    />
                                    <label
                                        htmlFor="is_default"
                                        className="check-box__label default_shipping_label"
                                    >
                                        ?????????????????????????????????????????????????????????
                                    </label>
                                </div>
                            )}

                            {submitError && (
                                <AlertMessage type="error">
                                    {getErrorMessage(submitError)}
                                </AlertMessage>
                            )}
                            {(submitting || shouldDisableSubmit) && (
                                <LoadingIndicator />
                            )}

                            {forUnpaidScreen && (
                                <div className="col-lg-6 col-md-12" />
                            )}
                            <div className="col-lg-6 col-md-12 credit-shipping__btn">
                                <Button
                                    priority="normal"
                                    className="button button--primary w-100"
                                    type="submit"
                                    disabled={submitting || shouldDisableSubmit}
                                >
                                    {forUnpaidScreen
                                        ? '??????????????????????????????'
                                        : '??????????????????'}
                                </Button>
                            </div>
                            {!forUnpaidScreen && (
                                <div className="col-lg-6 col-md-12 credit-shipping__btn">
                                    <Button
                                        className="button w-100"
                                        type="button"
                                        onClick={onCancel}
                                    >
                                        ???????????????
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
}
