export const getPriceSelling = (product, currentCustomerGroupId) => {
    const price = product.price_range.minimum_price.regular_price.value;
    let specialPrice = price;
    let discountPercent = Math.round(
        product.price_range.minimum_price.discount.percent_off
    );

    if (product.is_the_time) {
        const timePrice = product.price_tiers_the_time.find(
            price => price.group_id == currentCustomerGroupId
        );

        if (timePrice) {
            specialPrice = timePrice.final_price.value;
            discountPercent = Math.round(timePrice.discount.percent_off);
        }
    } else {
        specialPrice = product.price_range.minimum_price.final_price.value;
    }

    return {
        currency: product.price_range.minimum_price.regular_price.currency,
        price,
        price_selling: specialPrice,
        discount_percent: discountPercent
    };
};
