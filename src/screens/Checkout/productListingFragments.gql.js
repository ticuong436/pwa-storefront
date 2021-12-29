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
                stock_status
                url_key
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
                sky_point
                pillar {
                    code
                    name
                }
                service_name {
                    value
                    label
                }
                saleable_status {
                    is_saleable
                    type
                    description
                }
                order_options {
                    sky_shipping_date_enabled
                    sky_shipping_time_enabled
                    sky_customer_note_flag
                    sky_gift_ornament_enabled
                    sky_gift_message_enabled
                    shipping_time {
                        value
                        label
                    }
                    japanese_gift_ornament {
                        value
                        label
                    }
                    shipping_dates
                    gift_wrapping_style {
                        value
                        label
                    }
                }
                small_image {
                    url
                    label
                }
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
                    }
                }
                sky_ticket_type
                sky_info_shp_brand
                detail_middle_category
                attribute_set_name
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
