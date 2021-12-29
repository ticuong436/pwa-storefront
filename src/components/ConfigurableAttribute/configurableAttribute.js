import { array, func, object, string } from 'prop-types';
import React, { useMemo } from 'react';
import SelectInput from '@skp/components/SelectInput';

const ConfigurableAttribute = ({
    product,
    options,
    attributeCode,
    attributeId,
    setSelectedConfigAttr,
    selectedConfigAttr,
    handleSelectionChange
}) => {
    const attrOptions = useMemo(() => {
        var attrOptions = [];
        product.variants.map((prod, key) => {
            const configAttributeValue = prod.attributes.find(attr => {
                return attr.code == attributeCode;
            });
            const attributeName = options.find(configAttr => {
                return (
                    configAttr.value_index == configAttributeValue.value_index
                );
            });
            attrOptions[key] = {
                value: attributeName.value_index,
                label: attributeName.label
            };
        });

        return attrOptions;
    }, [product, options, attributeCode]);

    const initValue = selectedConfigAttr[attributeCode];

    if (!initValue) {
        return '';
    }

    return (
        <div className="form-customize form-product-select">
            <div className="form-select">
                <SelectInput
                    onChange={e => {
                        setSelectedConfigAttr({
                            ...selectedConfigAttr,
                            [attributeCode]: parseInt(e.target.value)
                        });
                        handleSelectionChange(
                            attributeId,
                            parseInt(e.target.value)
                        );
                    }}
                    classes={{
                        input: 'form-control form-scale form-product-detail'
                    }}
                    initialValue={initValue}
                >
                    {attrOptions.map((option, i) => {
                        return (
                            <option value={option.value} key={i}>
                                {option.label}
                            </option>
                        );
                    })}
                    <optgroup disabled />
                </SelectInput>
            </div>
        </div>
    );
};

ConfigurableAttribute.prototype = {
    product: object.isRequired,
    options: array.isRequired,
    attributeCode: string.isRequired,
    setSelectedConfigAttr: func.isRequired,
    selectedConfigAttr: object.isRequired
};

export default ConfigurableAttribute;
