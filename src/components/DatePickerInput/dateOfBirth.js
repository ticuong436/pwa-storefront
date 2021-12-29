import React from 'react';
import DatePickerInput from './datePickerInput';
import { isRequired } from '@skp/utils/formValidators';
import { useTranslation } from 'react-i18next';

const DateOfBirth = props => {
    const {
        datePickerClass,
        datePickerPlaceholder,
        datePickerFormat,
        datePickerField,
        datePickerAutoComplete,
        initialValue
    } = props;

    const { t } = useTranslation(['validation']);
    // Get this date 20 years before
    const maxBirthday = () => {
        const d = new Date();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const year = d.getFullYear();
        const date = ('0' + d.getDate()).slice(-2);

        return new Date(year - 20 + '-' + month + '-' + date);
    };

    return (
        <DatePickerInput
            maxDate={maxBirthday()}
            className={datePickerClass}
            placeholderText={datePickerPlaceholder}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            yearDropdownItemNumber={30}
            scrollableYearDropdown
            field={datePickerField}
            dateFormat={datePickerFormat}
            autoComplete={datePickerAutoComplete}
            validate={isRequired(t)}
            initialValue={initialValue ? new Date(initialValue) : ''}
        />
    );
};

export default DateOfBirth;
