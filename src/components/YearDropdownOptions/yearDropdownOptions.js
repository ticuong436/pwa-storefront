import React from 'react';
import { Option } from 'informed';

const YearDropdownOptions = ({ limitYear = 10, card = {} }) => {
    var yearDropdownOptions = [];
    const date = new Date();
    const thisYear = date.getFullYear();

    const year = date.getFullYear();

    if (card.exp_year && card.exp_year < year) {
        yearDropdownOptions.unshift(
            <Option key={card.exp_year} value={card.exp_year}>
                {card.exp_year}
            </Option>
        );
    }

    for (let index = 0; index <= limitYear; index++) {
        const value = thisYear + index;
        yearDropdownOptions.push(
            <Option key={index} value={value}>
                {value}
            </Option>
        );
    }

    return yearDropdownOptions;
};

export default YearDropdownOptions;
