import React, { useState } from 'react';
import TextInput from '@skp/components/TextInput';
import TextAreaInput from './textAreaInput';
import { generateFieldName } from '@skp/screens/Checkout/formHelper';
import { Checkbox } from 'informed';
import { useTranslation } from 'react-i18next';
import {
    hasLengthAtMost,
    isRequired,
    japanOldCharacterValidation
} from '@skp/utils/formValidators';

const MessageCards = props => {
    const {
        skyGiftMessageEnabled,
        id,
        tmpSelectedOption,
        removeInitialValue
    } = props;

    const [isSpecifyMessageCard, setIsSpecifyMessageCard] = useState(
        tmpSelectedOption
    );

    const { t } = useTranslation(['checkout', 'validation']);

    const onInputMesageCard = e => {
        const value = e.target.value;
        const lines = (value.match(/\n/g) || []).length + 1;

        if (e.which === 13 && lines >= 3) {
            e.preventDefault();
        }
    };

    const yourMessageValidation = value => {
        if (!value || !String(value).trim()) {
            return t('validation::Is required');
        }

        const lines = (value.match(/\n/g) || []).length + 1;
        const valueWithoutNewLine = value.replace(/(\r\n|\n|\r)/gm, '');

        if (lines > 3 || valueWithoutNewLine.length > 50) {
            return t(
                'validation::Must not exceed {{character}} character(s) and {{line}} lines',
                {
                    character: 50,
                    line: 3
                }
            );
        }
    };

    return (
        <>
            {skyGiftMessageEnabled && (
                <>
                    <div className="form-customize">
                        <div className="check-box">
                            <Checkbox
                                id={generateFieldName(
                                    'message-card-enable',
                                    id,
                                    false
                                )}
                                field={generateFieldName(
                                    'message_card',
                                    id,
                                    false
                                )}
                                className="check-box__input"
                                initialValue={isSpecifyMessageCard}
                                onChange={e => {
                                    setIsSpecifyMessageCard(
                                        isSpecifyMessageCard =>
                                            !isSpecifyMessageCard
                                    );
                                    if (
                                        removeInitialValue &&
                                        !e.target.checked
                                    ) {
                                        removeInitialValue(id, 'message_card');
                                    }
                                }}
                            />
                            <label
                                className="check-box__label"
                                htmlFor={generateFieldName(
                                    'message-card-enable',
                                    id,
                                    false
                                )}
                            >
                                {t('checkout::Request for Message Card')}
                            </label>
                        </div>
                    </div>
                    {isSpecifyMessageCard && (
                        <>
                            <div className="form-customize">
                                <div className="form-input">
                                    <TextInput
                                        classes={{
                                            input: 'form-control form-scale'
                                        }}
                                        id={generateFieldName(
                                            'message-card-receiver-name',
                                            id
                                        )}
                                        placeholder={t(
                                            'checkout::Receiver Name'
                                        )}
                                        field={generateFieldName(
                                            'message_card.receiver_name',
                                            id
                                        )}
                                        validate={value =>
                                            isRequired(t)(value) ||
                                            hasLengthAtMost(t, value, 15) ||
                                            japanOldCharacterValidation(
                                                t,
                                                value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <TextAreaInput
                                classes={{
                                    input:
                                        'form-control form-scale form-textarea-height'
                                }}
                                id={generateFieldName(
                                    'message-card-message',
                                    id
                                )}
                                placeholder={t('checkout::Your Message')}
                                field={generateFieldName(
                                    'message_card.message',
                                    id
                                )}
                                validate={value =>
                                    yourMessageValidation(value) ||
                                    japanOldCharacterValidation(t, value)
                                }
                                rows="3"
                                maxLength={50}
                                onKeyPress={onInputMesageCard}
                                exceptBreakLine={true}
                                t={t}
                            />
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default MessageCards;
