import React, { useState } from 'react';
import SelectInput from '@skp/components/SelectInput';
import { Option, Checkbox } from 'informed';
import { isRequired } from '@skp/utils/formValidators';
import { generateFieldName } from '@skp/screens/Checkout/formHelper';
import { useTranslation } from 'react-i18next';

const GiftWrapping = props => {
    const {
        wrappingStyles,
        wrappingTypeEnable,
        wrappingTypes,
        id,
        tmpSelectedOption,
        removeInitialValue
    } = props;

    const [isSpecifyGiftWrapping, setIsSpecifyGiftWrapping] = useState(
        tmpSelectedOption
    );
    const { t } = useTranslation(['checkout', 'validation']);

    return (
        <>
            {(wrappingTypeEnable || !!wrappingStyles.length) && (
                <>
                    <div className="form-customize">
                        <div className="check-box">
                            <Checkbox
                                id={generateFieldName('gift-wrapping', id)}
                                field={generateFieldName(
                                    'gift_wrapping',
                                    id,
                                    false
                                )}
                                className="check-box__input"
                                initialValue={isSpecifyGiftWrapping}
                                onChange={e => {
                                    setIsSpecifyGiftWrapping(
                                        isSpecifyGiftWrapping =>
                                            !isSpecifyGiftWrapping
                                    );
                                    if (
                                        removeInitialValue &&
                                        !e.target.checked
                                    ) {
                                        removeInitialValue(id, 'gift_wrapping');
                                    }
                                }}
                            />
                            <label
                                className="check-box__label"
                                htmlFor={generateFieldName('gift-wrapping', id)}
                            >
                                {t('checkout::Request for Gift Wrapping')}
                            </label>
                        </div>
                    </div>
                    {isSpecifyGiftWrapping && (
                        <div className="row">
                            {!!wrappingStyles.length && (
                                <div className="col-lg-6 col-md-12 form-customize">
                                    <div className="form-input form-select">
                                        <SelectInput
                                            field={generateFieldName(
                                                'gift_wrapping.style',
                                                id
                                            )}
                                            id={generateFieldName(
                                                'gift-wrapping-style',
                                                id
                                            )}
                                            classes={{
                                                input: 'form-control form-scale'
                                            }}
                                            validate={isRequired(t)}
                                        >
                                            <Option value="" disabled>
                                                {t(
                                                    'checkout::Select Gift Wrapping Style'
                                                )}
                                            </Option>
                                            <Option value={0}>
                                                {t('checkout::Not Requested')}
                                            </Option>
                                            {wrappingStyles.map(
                                                wrappingStyle => (
                                                    <Option
                                                        key={
                                                            wrappingStyle.value
                                                        }
                                                        value={
                                                            wrappingStyle.value
                                                        }
                                                    >
                                                        {wrappingStyle.label}
                                                    </Option>
                                                )
                                            )}
                                            <optgroup disabled />
                                        </SelectInput>
                                    </div>
                                </div>
                            )}
                            {wrappingTypeEnable && (
                                <div className="col-lg-6 col-md-12 form-customize">
                                    <div className="form-input form-select">
                                        <SelectInput
                                            field={generateFieldName(
                                                'gift_wrapping.type',
                                                id
                                            )}
                                            id={generateFieldName(
                                                'gift-wrapping-type',
                                                id
                                            )}
                                            classes={{
                                                input: 'form-control form-scale'
                                            }}
                                            validate={isRequired(t)}
                                        >
                                            <Option value="" disabled>
                                                {t(
                                                    'checkout::Select Gift Wrapping Type'
                                                )}
                                            </Option>
                                            <Option value={0}>
                                                {t('checkout::Not Requested')}
                                            </Option>
                                            {wrappingTypes.map(wrappingType => (
                                                <Option
                                                    key={wrappingType.value}
                                                    value={wrappingType.value}
                                                >
                                                    {wrappingType.label}
                                                </Option>
                                            ))}
                                            <optgroup disabled />
                                        </SelectInput>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default GiftWrapping;
