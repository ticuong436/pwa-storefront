import React from 'react';
import { array, func, object } from 'prop-types';
import Option from './option';

const Options = props => {
    const {
        options,
        product,
        setSelectedConfigAttr,
        selectedConfigAttr,
        handleSelectionChange
    } = props;

    return options.map(option => (
        <Option
            {...option}
            product={product}
            key={option.attribute_id}
            setSelectedConfigAttr={setSelectedConfigAttr}
            selectedConfigAttr={selectedConfigAttr}
            handleSelectionChange={handleSelectionChange}
        />
    ));
};

Options.propTypes = {
    options: array.isRequired,
    product: object.isRequired,
    setSelectedConfigAttr: func
};

export default Options;
