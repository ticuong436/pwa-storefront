import React from 'react';
import { generateFieldName } from '@skp/screens/Checkout/formHelper';
import { useTranslation } from 'react-i18next';
import TextInput from '@skp/components/TextInput';
import {
    hasLengthAtMost,
    isRequired,
    emailValidation,
    japanOldCharacterValidation
} from '@skp/utils/formValidators';
import TextAreaInput from './textAreaInput';
import { TICKET_TYPE } from '@skp/config';

const TicketDetail = props => {
    const { product, quantity, item } = props;

    const { t } = useTranslation(['checkout', 'validation']);

    const inputContent = [];

    if (product.sky_ticket_type == TICKET_TYPE.public) {
        for (let index = 0; index < quantity; index++) {
            inputContent.push(
                <div className="form-customize" key={index}>
                    <div className="form-input">
                        <TextInput
                            classes={{
                                input: 'form-control'
                            }}
                            placeholder={t('checkout::Mail Address')}
                            field={`${generateFieldName(
                                'emails',
                                `${item.id}`
                            )}[${index}]`}
                            validationSchema={emailValidation(t)}
                        />
                    </div>
                </div>
            );
        }
    }

    if (product.sky_ticket_type == TICKET_TYPE.member_only) {
        for (let index = 0; index < quantity; index++) {
            inputContent.push(
                <div className="row" key={index}>
                    <div className="col-lg-4 col-md-12 form-customize">
                        <div className="form-input">
                            <TextInput
                                classes={{
                                    input: 'form-control'
                                }}
                                placeholder={t('checkout::UID')}
                                field={`${generateFieldName(
                                    'members',
                                    `${item.id}`
                                )}[${index}].uid`}
                                validate={isRequired(t)}
                            />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-12 form-customize">
                        <div className="form-input">
                            <TextInput
                                classes={{
                                    input: 'form-control'
                                }}
                                placeholder={t('checkout::LAST NAME')}
                                field={`${generateFieldName(
                                    'members',
                                    `${item.id}`
                                )}[${index}].last_name`}
                                validate={isRequired(t)}
                            />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-12 form-customize">
                        <div className="form-input">
                            <TextInput
                                classes={{
                                    input: 'form-control'
                                }}
                                placeholder={t('checkout::FIRST NAME')}
                                field={`${generateFieldName(
                                    'members',
                                    `${item.id}`
                                )}[${index}].first_name`}
                                validate={isRequired(t)}
                            />
                        </div>
                    </div>
                </div>
            );
        }
    }

    return (
        <>
            {inputContent}
            {product.order_options &&
                product.order_options.sky_customer_note_flag && (
                    <TextAreaInput
                        allowEmptyString
                        classes={{
                            input: 'form-control'
                        }}
                        placeholder={t('checkout::Customer Note')}
                        field={generateFieldName('customer_note', item.id)}
                        maxLength={50}
                        validate={value =>
                            hasLengthAtMost(t, value, 50) ||
                            japanOldCharacterValidation(t, value)
                        }
                        t={t}
                    />
                )}
        </>
    );
};

export default TicketDetail;
