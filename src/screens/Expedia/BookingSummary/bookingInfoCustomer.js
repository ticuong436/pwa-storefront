import React from 'react';
// import { isRequired, inputValidationName } from '@skp/utils/formValidators';
import {
    inputValidationName,
    japanOldCharacterValidation
} from '@skp/utils/formValidators';
// import SelectInput from '@skp/components/SelectInput';
import TextInput from '@skp/components/TextInput';
import TextAreaInput from '@skp/components/TextAreaInput';
// import { Option, Checkbox } from 'informed';
import { useTranslation } from 'react-i18next';

const BookingInfoCustomer = ({ room, roomInput, customer, index }) => {
    const { t } = useTranslation(['validation', 'address']);

    return (
        <>
            <div className="guest-info-box">
                <p className="exguest-form--sub">
                    部屋 {index + 1}: 大人{roomInput.adults}名様、
                    {room.name}
                </p>
                {/* <div className="exguest-block">
                <div className="row">
                    <div className="col-lg-12 col-md-12">
                        <div className="control member-select">
                            <SelectInput
                                field="gender"
                                id="gender"
                                classes={{
                                    input: 'member-form'
                                }}
                                initialValue={customer.gender}
                                validate={isRequired(t)}
                            >
                                <Option value="" disabled>
                                    選択してください
                                </Option>
                                {genders &&
                                    genders.map(gender => (
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
                                Salutation*
                            </span>
                        </div>
                    </div>
                </div>
            </div> */}

                <div className="exguest-block">
                    <div className="row">
                        <div className="col-lg-6 col-md-12">
                            <div className="control">
                                <TextInput
                                    field={`customer_family_name[${index}]`}
                                    id="customer_family_name"
                                    validationSchema={inputValidationName(t)}
                                    validateOnBlur
                                    initialValue={customer.lastname}
                                    placeholder={t('address::Last name')}
                                    classes={{
                                        input: 'exguest--input'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12">
                            <div className="control">
                                <TextInput
                                    field={`customer_given_name[${index}]`}
                                    id="customer_given_name"
                                    validationSchema={inputValidationName(t)}
                                    validateOnBlur
                                    initialValue={customer.firstname}
                                    placeholder={t('address::First name')}
                                    classes={{
                                        input: 'exguest--input'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="exguest-block">
                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <div className="control exguest-textarea">
                                <div className="exguest-textarea--title">
                                    追加のリクエスト (オプション - 最大000文字)
                                </div>
                                <TextAreaInput
                                    classes={{
                                        input: ''
                                    }}
                                    id="description"
                                    field={`description[${index}]`}
                                    rows="3"
                                    validate={value =>
                                        japanOldCharacterValidation(t, value)
                                    }
                                />
                                <div className="exguest--des">
                                    アーリーチェックインやレイトチェックアウトなどのリクエストには、ホテルでの追加支払いが必要な場合があります。
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingInfoCustomer;
