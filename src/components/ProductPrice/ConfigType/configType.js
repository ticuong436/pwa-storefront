import React, { useMemo } from 'react';
import ParentServiceName from '@skp/components/ProductPrice/SimpleGroupConfigType/parentServiceName';

const ConfigType = ({ product, options, variantId }) => {
    const childrenProduct = useMemo(() => {
        var childProduct = [];
        if (product.is_shopping_subscription) {
            product.variants.map((value, key) => {
                var attributeName = '';
                value.attributes.map(productAttr => {
                    const attrConfig = options.find(item => {
                        return item.attribute_code == productAttr.code;
                    });

                    attrConfig.values.map(item => {
                        if (item.value_index == productAttr.value_index) {
                            attributeName += ` ${item.label}`;
                        }
                    });
                });

                childProduct[key] = { product: value.product, attributeName };
            });
        } else {
            product.variants.map((value, key) => {
                if (value.product.id == variantId) {
                    var attributeName = '';
                    value.attributes.map(productAttr => {
                        const attrConfig = options.find(item => {
                            return item.attribute_code == productAttr.code;
                        });

                        attrConfig.values.map(item => {
                            if (item.value_index == productAttr.value_index) {
                                attributeName += ` ${item.label}`;
                            }
                        });
                    });

                    childProduct[key] = {
                        product: value.product,
                        attributeName
                    };
                }
            });
        }

        return childProduct;
    }, [
        product.is_shopping_subscription,
        product.variants,
        options,
        variantId
    ]);

    return (
        <>
            {childrenProduct.map((value, key) => {
                return (
                    <ParentServiceName
                        key={key}
                        product={value.product}
                        attributeName={value.attributeName}
                    />
                );
            })}
        </>
    );
};

export default ConfigType;
