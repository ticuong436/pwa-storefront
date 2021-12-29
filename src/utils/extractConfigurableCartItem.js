const extractConfigurableCartItem = item => {
    const { configurable_options: options = [], product } = item;
    let variant = undefined;
    if (item.__typename == 'ConfigurableCartItem') {
        const selectedAttr = {};
        for (const iterator of options) {
            const attr = product.configurable_options.find(
                configurableOption => {
                    return configurableOption.attribute_id == iterator.id;
                }
            );
            const value = attr.values.find(value => {
                return value.value_index == iterator.value_id;
            });
            selectedAttr[attr.attribute_code] = value.value_index;
        }

        const prod = product.variants.find(item => {
            var isMatch = true;
            item.attributes.map(attr => {
                isMatch &= Object.values(selectedAttr).includes(
                    attr.value_index
                );
            });
            return isMatch;
        });
        variant = prod.product;
    }

    return { variant };
};

export default extractConfigurableCartItem;
