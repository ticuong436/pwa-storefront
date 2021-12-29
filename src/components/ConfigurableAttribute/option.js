import React from 'react';
import { arrayOf, object, string } from 'prop-types';
import ConfigurableAttribute from './configurableAttribute';

const Option = props => {
    const {
        attribute_code,
        attribute_id,
        values,
        product,
        setSelectedConfigAttr,
        selectedConfigAttr,
        handleSelectionChange
    } = props;

    return (
        <div>
            {/* <p className="mt-2">{label}</p> */}
            <p className="mt-2">以下、お選びいただけます。</p>
            <ConfigurableAttribute
                product={product}
                options={values}
                attributeCode={attribute_code}
                attributeId={attribute_id}
                setSelectedConfigAttr={setSelectedConfigAttr}
                selectedConfigAttr={selectedConfigAttr}
                handleSelectionChange={handleSelectionChange}
            />
        </div>
    );
};

Option.propTypes = {
    attribute_code: string.isRequired,
    label: string.isRequired,
    values: arrayOf(object).isRequired,
    product: object.isRequired
};

export default Option;
