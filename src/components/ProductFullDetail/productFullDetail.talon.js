import { useCallback, useState, useMemo, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { appendOptionsToPayload } from '@magento/peregrine/lib/util/appendOptionsToPayload';
import { findMatchingVariant } from '@magento/peregrine/lib/util/findMatchingProductVariant';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import CREATE_RESTOCK_REQUEST from './createRestockRequest.graphql';
import { PILLAR_CODE } from '@skp/config';
import { useUserContext } from '@skp/layouts/context/user';
import { getPriceSelling } from '@skp/utils/product';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { trackAddProductToCart } from '@skp/libs/tracking';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

const INITIAL_OPTION_CODES = new Map();
const INITIAL_OPTION_SELECTIONS = new Map();
const INITIAL_QUANTITY = 1;

const deriveOptionCodesFromProduct = product => {
    // If this is a simple product it has no option codes.
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_CODES;
    }

    // Initialize optionCodes based on the options of the product.
    const initialOptionCodes = new Map();
    for (const {
        attribute_id,
        attribute_code
    } of product.configurable_options) {
        initialOptionCodes.set(attribute_id, attribute_code);
    }

    return initialOptionCodes;
};

// Similar to deriving the initial codes for each option.
const deriveOptionSelectionsFromProduct = product => {
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_SELECTIONS;
    }

    const initialOptionSelections = new Map();
    for (const {
        attribute_id,
        attribute_code
    } of product.configurable_options) {
        const initAttribute = product.variants[0].attributes.find(item => {
            return item.code == attribute_code;
        });
        initialOptionSelections.set(attribute_id, initAttribute.value_index);
    }

    return initialOptionSelections;
};

const getIsMissingOptions = (product, optionSelections) => {
    // Non-configurable products can't be missing options.
    if (!isProductConfigurable(product)) {
        return false;
    }

    // Configurable products are missing options if we have fewer
    // option selections than the product has options.
    const { configurable_options } = product;
    const numProductOptions = configurable_options.length;
    const numProductSelections = Array.from(optionSelections.values()).filter(
        value => !!value
    ).length;

    return numProductSelections < numProductOptions;
};

const getMediaGalleryEntries = (product, optionCodes, optionSelections) => {
    let value = [];

    const { media_gallery_entries } = product;
    const isConfigurable = isProductConfigurable(product);

    // Selections are initialized to "code => undefined". Once we select a value, like color, the selections change. This filters out unselected options.
    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (
        !isConfigurable ||
        !optionsSelected ||
        product.is_shopping_subscription
    ) {
        value = media_gallery_entries;
    } else {
        // If any of the possible variants matches the selection add that
        // variant's image to the media gallery. NOTE: This _can_, and does,
        // include variants such as size. If Magento is configured to display
        // an image for a size attribute, it will render that image.
        // Temp comment to make config product show only parent images.
        // const item = findMatchingVariant({
        //     optionCodes,
        //     optionSelections,
        //     variants
        // });

        const item = null;

        value = item
            ? [...item.product.media_gallery_entries, ...media_gallery_entries]
            : media_gallery_entries;
    }

    return value;
};

const getSelectedChildProduct = (product, optionCodes, optionSelections) => {
    const isConfigurable = isProductConfigurable(product);

    if (!isConfigurable) {
        return null;
    }

    // Selections are initialized to "code => undefined". Once we select a value, like color, the selections change. This filters out unselected options.
    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (!optionsSelected) {
        return null;
    }

    const { variants } = product;

    return findMatchingVariant({
        optionCodes,
        optionSelections,
        variants
    });
};

// We only want to display breadcrumbs for one category on a PDP even if a
// product has multiple related categories. This function filters and selects
// one category id for that purpose.
const getBreadcrumbCategoryId = categories => {
    // Exit if there are no categories for this product.
    if (!categories || !categories.length) {
        return;
    }
    const breadcrumbSet = new Set();
    categories.forEach(({ breadcrumbs }) => {
        // breadcrumbs can be `null`...
        (breadcrumbs || []).forEach(({ category_id }) =>
            breadcrumbSet.add(category_id)
        );
    });

    // Until we can get the single canonical breadcrumb path to a product we
    // will just return the first category id of the potential leaf categories.
    const leafCategory = categories.find(
        category => !breadcrumbSet.has(category.id)
    );

    // If we couldn't find a leaf category then just use the first category
    // in the list for this product.
    return leafCategory.id || categories[0].id;
};

const getConfigPrice = (product, optionCodes, optionSelections) => {
    let value;

    const { variants } = product;
    const isConfigurable = isProductConfigurable(product);

    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (!isConfigurable || !optionsSelected) {
        value = product.price_range.minimum_price.regular_price.value;
    } else {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = item
            ? item.product.price_range.minimum_price.regular_price.value
            : product.price_range.minimum_price.regular_price.value;
    }

    return value;
};

const SUPPORTED_PRODUCT_TYPES = [
    'SimpleProduct',
    'ConfigurableProduct',
    'TicketProduct'
];

export const useProductFullDetail = props => {
    const [, { setInfo, setError }] = useNotificationContext();

    const {
        addConfigurableProductToCartMutation,
        addSimpleProductToCartMutation,
        createCartMutation,
        getCartDetailsQuery,
        product,
        refetch,
        gssAddToCartHandler
    } = props;
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);
    const [{ isAddingItem, details }, { addItemToCart }] = useCartContext();
    const [{ currentUser }] = useUserContext();
    const { t } = useTranslation(['product', 'common']);

    const { items = [] } = details;

    const productType = product.__typename;

    const isSupportedProductType = SUPPORTED_PRODUCT_TYPES.includes(
        productType
    );

    const [
        addConfigurableProductToCart,
        { error: addConfigurableError }
    ] = useMutation(addConfigurableProductToCartMutation);

    const [addSimpleProductToCart, { error: addSimpleError }] = useMutation(
        addSimpleProductToCartMutation
    );

    const [skyPoint, setSkyPoint] = useState('');
    const [variantId, setVariantId] = useState(null);
    const [selectedConfigAttr, setSelectedConfigAttr] = useState(false);
    const [displayedImageIndex, setDisplayedImageIndex] = useState(null);

    const isProductInCart = useMemo(() => {
        if (
            product.is_shopping_subscription ||
            !isProductConfigurable(product)
        ) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].product.id === product.id) {
                    return true;
                }
            }
        } else {
            /**
             * Case config product detail.
             * Only config product items has configurable_options property.
             * configurable_options property contain attributes of child product was added to cart.
             * Loop through cart items collect all attributes of child product in cart of each item.
             * Compare those attributes with current product attributes.
             * If equal mean product in cart, otherwise can add product to cart.
             */
            for (let i = 0; i < items.length; i++) {
                if (
                    items[i].product.id === product.id &&
                    items[i].configurable_options
                ) {
                    const itemSelectedAttr = {};
                    for (
                        let index = 0;
                        index < items[i].configurable_options.length;
                        index++
                    ) {
                        const selectedAttr =
                            items[i].configurable_options[index];
                        const attr = product.configurable_options.find(v => {
                            return v.attribute_id == selectedAttr.id;
                        });

                        if (attr) {
                            itemSelectedAttr[attr.attribute_code] =
                                selectedAttr.value_id;
                        }
                    }

                    if (
                        !_.isEmpty(itemSelectedAttr) &&
                        _.isEqual(itemSelectedAttr, selectedConfigAttr)
                    ) {
                        return true;
                    }
                }
            }
        }

        return false;
    }, [items, product, selectedConfigAttr]);

    const [fetchCartId] = useMutation(createCartMutation);

    const [createRestockRequest] = useMutation(CREATE_RESTOCK_REQUEST);

    const [quantity, setQuantity] = useState(INITIAL_QUANTITY);

    const breadcrumbCategoryId = useMemo(
        () => getBreadcrumbCategoryId(product.categories),
        [product.categories]
    );

    const derivedOptionSelections = useMemo(
        () => deriveOptionSelectionsFromProduct(product),
        [product]
    );

    const [optionSelections, setOptionSelections] = useState(
        derivedOptionSelections
    );

    const derivedOptionCodes = useMemo(
        () => deriveOptionCodesFromProduct(product),
        [product]
    );
    const [optionCodes] = useState(derivedOptionCodes);

    const isMissingOptions = useMemo(
        () => getIsMissingOptions(product, optionSelections),
        [product, optionSelections]
    );
    const mediaGalleryEntries = useMemo(
        () => getMediaGalleryEntries(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    const selectedChildProduct = useMemo(
        () => getSelectedChildProduct(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    const handleAddToCart = useCallback(async () => {
        const payload = {
            item: product,
            productType,
            quantity
        };

        if (isProductConfigurable(product)) {
            appendOptionsToPayload(payload, optionSelections, optionCodes);
        }

        if (isSupportedProductType) {
            let addItemMutation;
            // Use the proper mutation for the type.
            if (
                productType === 'SimpleProduct' ||
                productType === 'TicketProduct'
            ) {
                addItemMutation = addSimpleProductToCart;
            } else if (productType === 'ConfigurableProduct') {
                addItemMutation = addConfigurableProductToCart;
            }

            await addItemToCart({
                ...payload,
                addItemMutation,
                fetchCartDetails,
                fetchCartId
            });

            const { price_selling: amount } = getPriceSelling(
                product,
                currentUser.group_id
            );
            const item = `${product.id},${quantity},${amount * quantity}`;
            try {
                gssAddToCartHandler(item, amount * quantity);
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(error);
                }
            }

            trackAddProductToCart(product, quantity, amount);

            window.scrollTo(0, 0);
        } else {
            console.error('Unsupported product type. Cannot add to cart.');
        }
    }, [
        addConfigurableProductToCart,
        addItemToCart,
        addSimpleProductToCart,
        fetchCartDetails,
        fetchCartId,
        isSupportedProductType,
        optionCodes,
        optionSelections,
        product,
        productType,
        quantity,
        gssAddToCartHandler,
        currentUser
    ]);

    const handleAddRestockRequest = async productId => {
        const { data } = await createRestockRequest({
            variables: { productId }
        });

        if (data.isSuccess) {
            refetch();
            setInfo(
                t('product::Add product to Restock request list successfully.')
            );
        } else {
            setError(t('common::Something went wrong!'));
        }
    };
    // Get derivedErrorMessage if addition to cart failed
    // Reference: https://github.com/magento/pwa-studio/pull/2505/commits/ae72580b91086efddfea0ea7ef73a1ce1ed13ef0
    const derivedErrorMessage = useMemo(() => {
        const errorTarget = addSimpleError || addConfigurableError;
        if (!errorTarget) return null;
        if (errorTarget.graphQLErrors) {
            // Apollo prepends "GraphQL Error:" onto the message,
            // which we don't want to show to an end user.
            // Build up the error message manually without the prepended text.
            return errorTarget.graphQLErrors
                .map(({ message }) => message)
                .join(', ');
        }
        return errorTarget.message;
    }, [addConfigurableError, addSimpleError]);

    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            // We must create a new Map here so that React knows that the value
            // of optionSelections has changed.
            const nextOptionSelections = new Map([...optionSelections]);
            nextOptionSelections.set(optionId, selection);
            setOptionSelections(nextOptionSelections);
        },
        [optionSelections]
    );

    const handleSetQuantity = useCallback(
        value => {
            setQuantity(value);
        },
        [setQuantity]
    );
    useEffect(() => {
        if (!product.pillar || product.pillar.code !== PILLAR_CODE.pointmall) {
            if (product.__typename != 'ConfigurableProduct') {
                setSkyPoint(product.sky_point);
            } else {
                if (selectedConfigAttr) {
                    const prod = product.variants.find(item => {
                        var isMatch = true;
                        item.attributes.map(attr => {
                            isMatch &= Object.values(
                                selectedConfigAttr
                            ).includes(attr.value_index);
                        });
                        return isMatch;
                    });

                    const productIndex = product.variants.findIndex(item => {
                        var isMatch = true;
                        item.attributes.map(attr => {
                            isMatch &= Object.values(
                                selectedConfigAttr
                            ).includes(attr.value_index);
                        });
                        return isMatch;
                    });

                    setSkyPoint(prod.product.sky_point);
                    setVariantId(prod.product.id);
                    setDisplayedImageIndex(productIndex);
                } else {
                    const selectedAttr = {};
                    product.variants[0].attributes.forEach(element => {
                        selectedAttr[element.code] = element.value_index;
                    });
                    setSelectedConfigAttr(selectedAttr);
                    setVariantId(product.variants[0].product.id);
                    setDisplayedImageIndex(0);
                }
            }
        } else {
            setSkyPoint('');
        }
    }, [product, selectedConfigAttr]);

    const productPrice = useMemo(
        () => getConfigPrice(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    // Normalization object for product details we need for rendering.
    const productDetails = {
        description: product.description,
        name: product.name,
        price: productPrice,
        sku: product.sku
    };

    return {
        breadcrumbCategoryId,
        handleAddToCart,
        handleSelectionChange,
        handleSetQuantity,
        isAddToCartDisabled:
            !isSupportedProductType || isAddingItem || isMissingOptions,
        mediaGalleryEntries,
        productDetails,
        quantity,
        derivedErrorMessage,
        isProductInCart,
        handleAddRestockRequest,
        skyPoint,
        selectedConfigAttr,
        setSelectedConfigAttr,
        variantId,
        selectedChildProduct,
        displayedImageIndex
    };
};
