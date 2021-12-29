import { getPriceSelling } from '@skp/utils/product';

export const mapProductFromDbToListing = (product, currentUser = {}) => {
    const { price, price_selling } = getPriceSelling(
        product,
        currentUser.group_id
    );
    return {
        id: product.id,
        product_type: product.type_id,
        sales_time: product.sky_time_sales,
        sku: product.sku,
        name: product.name,
        is_new: product.is_new,
        pillar: product.pillar,
        service_name: product.service_name,
        sky_point: product.sky_point,
        short_description: product.short_description.html,
        image: product.small_image.url,
        is_in_wish_list:product.is_in_wish_list,
        price_selling,
        price,
        sky_info_shp_brand: product.sky_info_shp_brand,
        detail_middle_category: product.detail_middle_category,
        attribute_set_name: product.attribute_set_name,
        service_description: product.service_description,
        sky_info_wad_category2: product.sky_info_wad_category2,
        sky_info_wad_state: product.sky_info_wad_state,
        sky_info_wad_city: product.sky_info_wad_city,
        is_sky_special_price: product.is_sky_special_price,
        stock_status: product.stock_status,
        external_detail_url: product.external_detail_url
    };
};
