export const generateItemKey = productId => `p${productId}`;

export const generateFieldName = (field, productId = null, toSubmit = true) => {
    const prefix = toSubmit ? 'orderOptions' : 'orderOptionsTmp';
    return productId
        ? `${prefix}.${generateItemKey(productId)}.${field}`
        : field;
};

export const extractItemId = productKeyName => productKeyName.replace('p', '');
