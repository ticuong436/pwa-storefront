import React, { useRef } from 'react';
import { Form, Select, Option, Checkbox } from 'informed';
import TextInput from '@skp/components/TextInput';
import {
    phoneValidation,
    postalCodeValidation,
    isRequired,
    inputValidationShippingAddress
} from '@skp/utils/formValidators';
import Button from '@magento/venia-ui/lib/components/Button';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useAddressForm } from './useAddressForm';
import MainPageTitle from '@skp/components/MainPageTitle';
import { usePostCodeSearching } from './usePostCodeSearching';
import AlertMessage from '@skp/components/AlertMessage';
import { getErrorMessage } from '@skp/utils/graphqlError';
import { useTranslation } from 'react-i18next';
import SelectInput from '@skp/components/SelectInput';

export default function AddressForm({
    onAddressAdded,
    onCancel,
    allowChangeDefaultShipping,
    formPopup,
    address = {}
}) {
    const { t } = useTranslation(['validation', 'address']);
    const formApiRef = useRef();
    const {
        regionsJp,
        submitting,
        submitError,
        handleSubmit,
        isGettingUser
    } = useAddressForm({ address, onAddressAdded });

    const { onPostalCodeChanged } = usePostCodeSearching(regionsJp, formApiRef);

    if (isGettingUser) {
        return <LoadingIndicator />;
    }

    return (
        <div className="credit-shipping">
            <MainPageTitle title={address.city ? 'Edit Address' : 'Add Address'}>
            </MainPageTitle>
            <Form
                className="form-login"
                onSubmit={handleSubmit}
                apiRef={formApiRef}
            >
                <div className="row credit-shipping__form">
                    <div
                        className={`col-lg-${
                            formPopup ? 12 : 6
                        } col-md-12 credit-shipping__col ${
                            formPopup ? '' : 'shipping-left'
                        }`}
                    >
                        <h3 className="credit-shipping__sub">Contact Address</h3>
                        <div className="member-file member-file-form row">
                            <div className="control col-lg-12 col-md-12">
                                <TextInput
                                    field="lastname"
                                    id="lastname"
                                    validationSchema={inputValidationShippingAddress(
                                        t,
                                        64
                                    )}
                                    validateOnBlur
                                    initialValue={address.lastname}
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
                                    validationSchema={inputValidationShippingAddress(
                                        t,
                                        64
                                    )}
                                    validateOnBlur
                                    initialValue={address.firstname}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    {t('address::First name')} *
                                </span>
                            </div>
                            <div className="control col-lg-12 col-md-12 member-select">
                                <Select
                                    field="contact_country_code"
                                    id="contact-country-code"
                                    className="member-form form-scale"
                                >
                                    <Option value="+65" readOnly>
                                        {/* Shipping address is only in Singapore */}
                                        Singapore (+65)
                                    </Option>
                                </Select>
                                <span className="member-form--lable">
                                    Country Code *
                                </span>
                            </div>
                            <div className="control col-lg-12 col-md-12">
                                <TextInput
                                    field="contact_phone"
                                    id="contact-phone"
                                    initialValue={address.telephone}
                                    validationSchema={phoneValidation(t)}
                                    validateOnBlur
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    Phone number (no hyphen) *
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`col-lg-${
                            formPopup ? 12 : 6
                        } col-md-12 credit-shipping__col`}
                    >
                        <h3 className="credit-shipping__sub">Address</h3>
                        <div className="member-file member-file-form row">
                            <div className="control col-lg-12 col-md-12 member-select">
                                <Select
                                    field="country"
                                    id="country"
                                    className="member-form form-scale"
                                    initialValue="SG"
                                >
                                    <Option value="SG">Singapore</Option>
                                </Select>
                                <span className="member-form--lable">
                                    Country *
                                </span>
                            </div>
                            <div className="control col-lg-12 col-md-12">
                                <TextInput
                                    field="postal_code"
                                    id="postal-code"
                                    initialValue={address.postcode}
                                    validationSchema={postalCodeValidation(t)}
                                    validateOnBlur
                                    onValueChange={onPostalCodeChanged}
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    Zip code (No hyphen) *
                                </span>
                            </div>

                            <div className="control col-lg-12 col-md-12">
                                <TextInput
                                    field="city"
                                    id="city"
                                    initialValue={address.city}
                                    validationSchema={inputValidationShippingAddress(
                                        t,
                                        256
                                    )}
                                    validateOnBlur
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    Municipalities *
                                </span>
                            </div>
                            <div className="control col-lg-12 col-md-12">
                                <TextInput
                                    field="address_street1"
                                    id="address-street1"
                                    initialValue={
                                        address.street
                                            ? address.street[0]
                                            : null
                                    }
                                    validationSchema={inputValidationShippingAddress(
                                        t,
                                        127
                                    )}
                                    validateOnBlur
                                    classes={{
                                        input: 'member-form form-scale'
                                    }}
                                />
                                <span className="member-form--lable">
                                    Street address *
                                </span>
                            </div>
                            <div className="control col-lg-12 col-md-12">
                                <TextInput
                                    field="address_street2"
                                    id="address-street2"
                                    initialValue={
                                        address.street
                                            ? address.street[1]
                                            : null
                                    }
                                    validationSchema={inputValidationShippingAddress(
                                        t,
                                        127,
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

                            {allowChangeDefaultShipping && (
                                <div className="form-customize col-lg-12 col-md-12">
                                    <div className="check-box">
                                        <Checkbox
                                            id="default-shipping"
                                            field="default_shipping"
                                            className="check-box__input"
                                            initialValue={
                                                address.default_shipping
                                            }
                                            disabled={address.default_shipping}
                                        />
                                        <label
                                            htmlFor="default-shipping"
                                            className="check-box__label default_shipping_label"
                                        >
                                            Use as the default shipping address
                                        </label>
                                    </div>
                                </div>
                            )}
                            {submitError && (
                                <AlertMessage type="error">
                                    {getErrorMessage(submitError)}
                                </AlertMessage>
                            )}
                            {submitting && <LoadingIndicator />}

                            <div className="col-lg-6 col-md-12 credit-shipping__btn">
                                <Button
                                    className="button button--primary w-100"
                                    type="submit"
                                    disabled={submitting}
                                >
                                    Save shipping address
                                </Button>
                            </div>
                            <div className="col-lg-6 col-md-12 credit-shipping__btn">
                                <Button
                                    className="button w-100"
                                    type="button"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
}
