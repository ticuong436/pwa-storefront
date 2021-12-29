import React from 'react';
import { Option } from 'informed';

const MonthDropdownOption = () => {
    var monthDropdownOptions = [];

    for (let index = 1; index <= 12; index++) {
        const value = index < 10 ? `0${index}` : index;
        monthDropdownOptions.push(
            <Option key={index} value={index}>
                {value}
            </Option>
        );
    }

    return monthDropdownOptions;
};

export default MonthDropdownOption;
