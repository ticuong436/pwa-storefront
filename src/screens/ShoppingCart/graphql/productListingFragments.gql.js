import gql from 'graphql-tag';

export const ProductListingFragment = gql`
    fragment ProductListingFragment on Cart {
        id
        items {
            id
            product {
                id
                name
                sku
                small_image {
                    url
                }
                crosssell_products {
                    __typename
                    type_id
                    id
                    name
                    new_from_date
                    sku
                    small_image {
                        url
                    }
                    service_name {
                        value
                        label
                    }
                    pillar {
                        code
                        name
                    }
                    is_new
                    is_in_wish_list
                    stock_status
                    is_in_stock_request
                    sky_is_product_set
                    sky_point
                    is_sky_special_price
                    price_range {
                        minimum_price {
                            regular_price {
                                currency
                                value
                            }
                            discount {
                                amount_off
                                percent_off
                            }
                            final_price {
                                currency
                                value
                            }
                        }
                    }
                    short_description {
                        html
                    }
                    sky_info_shp_brand
                    detail_middle_category
                    attribute_set_name
                }
                stock_status
                ... on ConfigurableProduct {
                    configurable_options {
                        attribute_code
                        attribute_id
                        id
                        label
                        values {
                            default_label
                            label
                            store_label
                            use_default_value
                            value_index
                        }
                    }
                    variants {
                        attributes {
                            code
                            value_index
                        }
                        product {
                            id
                            media_gallery_entries {
                                id
                                disabled
                                file
                                label
                                position
                            }
                            name
                            sky_point
                            sku
                            stock_status
                            special_price
                            price_range {
                                minimum_price {
                                    regular_price {
                                        currency
                                        value
                                    }
                                    discount {
                                        amount_off
                                        percent_off
                                    }
                                    final_price {
                                        currency
                                        value
                                    }
                                }
                            }
                        }
                    }
                }
                pillar {
                    code
                    name
                }
                service_name {
                    value
                    label
                }
                sky_point
                saleable_status {
                    is_saleable
                    type
                    description
                }
            }
            prices {
                price {
                    currency
                    value
                }
            }
            quantity
            ... on ConfigurableCartItem {
                configurable_options {
                    id
                    option_label
                    value_id
                    value_label
                }
            }
        }
    }
`;
