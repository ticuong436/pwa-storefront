import React, { useState, useMemo } from 'react';
import SelectInput from '@skp/components/SelectInput';
import { Option, Checkbox } from 'informed';
import { isRequired } from '@skp/utils/formValidators';
import { generateFieldName } from '@skp/screens/Checkout/formHelper';
import { useTranslation } from 'react-i18next';
import DatePickerInput from '@skp/components/DatePickerInput';
import Moment from 'moment';

const DeliveryDateTime = props => {
    const {
        skyShippingDateEnabled,
        skyShippingTimeEnabled,
        shippingDates,
        shippingTimes,
        id = null,
        tmpSelectedOption,
        removeInitialValue
    } = props;

    const [isSpecifyDateTime, setIsSpecifyDateTime] = useState(
        tmpSelectedOption
    );

    const maxShippingDate = useMemo(() => {
        return shippingDates && shippingDates[0]
            ? Moment(shippingDates[0])
                  .add(3, 'M')
                  .toDate()
            : null;
    }, [shippingDates]);

    const { t } = useTranslation(['checkout', 'validation']);

    return (
        <>
            {(skyShippingDateEnabled || skyShippingTimeEnabled) && (
                <>
                    <div className="form-customize">
                        <div className="check-box">
                            <Checkbox
                                id={generateFieldName('delivery-date-time', id)}
                                field={generateFieldName(
                                    'delivery_date_time',
                                    id,
                                    false
                                )}
                                className="check-box__input"
                                initialValue={isSpecifyDateTime}
                                onChange={e => {
                                    setIsSpecifyDateTime(
                                        isSpecifyDateTime => !isSpecifyDateTime
                                    );

                                    if (
                                        removeInitialValue &&
                                        !e.target.checked
                                    ) {
                                        removeInitialValue(
                                            id,
                                            'shipping_request_date',
                                            'shipping_request_time_range'
                                        );
                                    }
                                }}
                            />
                            <label
                                className="check-box__label"
                                htmlFor={generateFieldName(
                                    'delivery-date-time',
                                    id
                                )}
                            >
                                {t(
                                    'checkout::Request for Specify Delivery Date and Time'
                                )}
                            </label>
                        </div>
                    </div>
                    {isSpecifyDateTime && (
                        <div className="row">
                            {skyShippingDateEnabled && isSpecifyDateTime && (
                                <div className="col-lg-6 col-md-12 form-customize">
                                    <div className="form-input form-select custom-date-delivery">
                                        <DatePickerInput
                                            className="form-control form-scale"
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            scrollableYearDropdown
                                            dateFormat="yyyy/MM/dd"
                                            autoComplete="off"
                                            placeholderText={t(
                                                'checkout::Select Shipping Date'
                                            )}
                                            field={generateFieldName(
                                                'shipping_request_date',
                                                id
                                            )}
                                            id={generateFieldName(
                                                'shipping_request_date',
                                                id
                                            )}
                                            validate={isRequired(t)}
                                            minDate={
                                                shippingDates &&
                                                shippingDates[0]
                                                    ? new Date(shippingDates[0])
                                                    : null
                                            }
                                            maxDate={maxShippingDate}
                                        />
                                    </div>
                                </div>
                            )}
                            {skyShippingTimeEnabled && isSpecifyDateTime && (
                                <div className="col-lg-6 col-md-12 form-customize">
                                    <div className="form-input form-select">
                                        <SelectInput
                                            field={generateFieldName(
                                                'shipping_request_time_range',
                                                id
                                            )}
                                            id={generateFieldName(
                                                'shipping_request_time_range',
                                                id
                                            )}
                                            classes={{
                                                input: 'form-control form-scale'
                                            }}
                                            validate={isRequired(t)}
                                        >
                                            <Option value="" disabled>
                                                {t(
                                                    'checkout::Select Shipping Time'
                                                )}
                                            </Option>
                                            <Option value={0}>
                                                {t('checkout::Not Requested')}
                                            </Option>
                                            {shippingTimes.map(shippingTime => (
                                                <Option
                                                    key={shippingTime.value}
                                                    value={shippingTime.value}
                                                >
                                                    {shippingTime.label}
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

export default DeliveryDateTime;
