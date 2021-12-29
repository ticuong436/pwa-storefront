import React, { useState, useEffect } from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { useProductFullDetail } from './productFullDetail.talon';
import { useTranslation } from 'react-i18next';

import CREATE_CART_MUTATION from '@magento/venia-ui/lib/queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '@magento/venia-ui/lib/queries/getCartDetails.graphql';
import {
    ADD_CONFIGURABLE_MUTATION,
    ADD_SIMPLE_MUTATION
} from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.gql';
import ProductImageCarousel from './carousel';
import ProductPrice from '@skp/components/ProductPrice';
import AddToCartButton from '@skp/components/AddToCartButton';
import ApplyButton from '@skp/components/ApplyButton';
import platinumIcon from 'design/dest/images/ic-platinum.png';
import HeartWishList from '@skp/components/ProductPrice/heartWishList';
import ProductBadges from '@skp/components/ProductBadges';
import Options from '@skp/components/ConfigurableAttribute';
import ProductDetailRight from './ProductDetailRight';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { trackViewProductDetail } from '@skp/libs/tracking';
import { getPriceSelling } from '@skp/utils/product';
import { useUserContext } from '@skp/layouts/context/user';
import ProductRelation from '@skp/components/ProductRelation';

const ProductFullDetail = props => {
    const { product, refetch, gssAddToCartHandler } = props;
    const TAB_DESCRIPTION = 1;
    const TAB_INFO = 2;

    const { t } = useTranslation(['product']);
    const [, { setError }] = useNotificationContext();
    const [{ currentUser }] = useUserContext();

    const [currentTab, setCurrentTab] = useState(TAB_DESCRIPTION);

    const talonProps = useProductFullDetail({
        addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
        addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
        createCartMutation: CREATE_CART_MUTATION,
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        product,
        refetch,
        gssAddToCartHandler
    });

    const isHide =
        product.saleable_status.type == 'GROUP_RESTRICTION' &&
        !product.saleable_status.is_saleable;

    const {
        handleAddToCart,
        mediaGalleryEntries,
        derivedErrorMessage,
        handleSelectionChange,
        handleSetQuantity,
        quantity,
        isProductInCart,
        handleAddRestockRequest,
        skyPoint,
        selectedConfigAttr,
        setSelectedConfigAttr,
        variantId,
        selectedChildProduct,
        displayedImageIndex
    } = talonProps;

    const { attributeValues } = product;

    const listProductInfo = attributeValues.map((attributeValue, index) => {
        const hrefStyle =
            attributeValue.type == 'email' ? { color: '#ceae57' } : {};
        const hrefPrefix = attributeValue.type == 'email' ? 'mailto:' : '';

        return (
            <li
                className="product-info__item"
                key={index}
                style={{ alignItems: 'flex-start' }}
            >
                <span
                    className="product-info__name"
                    style={{
                        minWidth: 'unset',
                        wordBreak: 'break-word',
                        flex: '0 0 150px'
                    }}
                >
                    {t(attributeValue.label)}
                </span>
                {/* <span
                    className="product-info__value"
                    dangerouslySetInnerHTML={{
                        __html: attributeValue.value
                    }}
                /> */}

                {['url', 'email'].includes(attributeValue.type) ? (
                    <a href={`${hrefPrefix}${attributeValue.value}`}>
                        <span style={hrefStyle}>{attributeValue.value}</span>
                    </a>
                ) : (
                    <span style={{ whiteSpace: 'pre-wrap' }}>
                        {attributeValue.value}
                    </span>
                )}
            </li>
        );
    });

    useEffect(() => {
        if (derivedErrorMessage) {
            if (derivedErrorMessage) {
                setError(derivedErrorMessage);
            }
        }
    }, [derivedErrorMessage, setError]);

    useEffect(() => {
        if (currentUser.group_id) {
            trackViewProductDetail(
                product,
                getPriceSelling(product, currentUser.group_id).price_selling
            );
        }
    }, [currentUser.group_id, product]);

    return (
        <div className="product-detail">
            <div className="row">
                <div className="col-lg-8 col-md-8 product-detail__images">
                    <ProductImageCarousel
                        images={mediaGalleryEntries}
                        default_image={product.image.url}
                        displayedImageIndex={displayedImageIndex}
                    />
                </div>
                {product.__typename === 'VirtualProduct' ? (
                    <ProductDetailRight
                        product={product}
                        handleAddRestockRequest={handleAddRestockRequest}
                        isHide={isHide}
                    />
                ) : (
                    <div className="col-lg-4 col-md-4 product-detail__info">
                        <div
                            id="id-right-enlarged-target"
                            style={{
                                position: 'absolute',
                                zIndex: '100',
                                width: '100%'
                            }}
                        />
                        <div className="product-detail__top">
                            <span className="product-detail__cate">
                                {product.pillar_name}
                            </span>
                            <div className="product-status">
                                {product.is_show_platinum_icon && (
                                    <div className="product-status__item">
                                        <img src={platinumIcon} alt="img" />
                                    </div>
                                )}
                                {product.is_new && (
                                    <div className="product-status__item">
                                        <div className="reg-hexagon-svg">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="35.366"
                                                height="37.925"
                                                viewBox="0 0 35.366 37.925"
                                            >
                                                <g
                                                    id="Icon_New"
                                                    data-name="Icon — New"
                                                    transform="translate(0)"
                                                >
                                                    <path
                                                        id="パス_48"
                                                        data-name="パス 48"
                                                        d="M446.747,426.637l-13.5,7.474a4.344,4.344,0,0,1-4.185,0l-13.5-7.474a3.99,3.99,0,0,1-2.093-3.477V408.212a3.99,3.99,0,0,1,2.093-3.477l13.5-7.474a4.345,4.345,0,0,1,4.185,0l13.5,7.474a3.99,3.99,0,0,1,2.093,3.477V423.16A3.99,3.99,0,0,1,446.747,426.637Z"
                                                        transform="translate(-413.474 -396.724)"
                                                        fill="#baa9ad"
                                                    />
                                                    <text
                                                        id="NEW"
                                                        transform="translate(18.377 23.187)"
                                                        fill="#fff"
                                                        fontSize="12"
                                                        fontFamily="Lato-Regular, Lato"
                                                    >
                                                        <tspan
                                                            x="-14.259"
                                                            y="0"
                                                        >
                                                            NEW
                                                        </tspan>
                                                    </text>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                )}
                                <HeartWishList product={product} />
                            </div>
                        </div>
                        <span className="product-detail__line" />
                        <h2 className="product-detail__title">
                            {product.name}
                        </h2>
                        <span className="product-detail__cate-sub">
                            {product.service_name.label.toUpperCase()}
                        </span>
                        <ProductPrice product={product} variantId={variantId} />
                        <div className="product-wishlist">
                            <span className="product-wishlist__sub">
                                {skyPoint ? `SKY POINTS ${skyPoint}` : ''}
                            </span>
                        </div>

                        {product.__typename === 'ConfigurableProduct' && (
                            <Options
                                setSelectedConfigAttr={setSelectedConfigAttr}
                                handleSelectionChange={handleSelectionChange}
                                selectedConfigAttr={selectedConfigAttr}
                                product={product}
                                options={product.configurable_options}
                            />
                        )}

                        {product.__typename === 'VirtualProduct' ||
                        product.__typename === 'LotteryProduct' ||
                        product.point_mall_flag
                            ? !isHide && (
                                  <ApplyButton
                                      product={product}
                                      handleAddRestockRequest={
                                          handleAddRestockRequest
                                      }
                                  />
                              )
                            : !isHide && (
                                  <AddToCartButton
                                      product={product}
                                      handleAddToCart={handleAddToCart}
                                      setQuantity={handleSetQuantity}
                                      quantity={quantity}
                                      isProductInCart={isProductInCart}
                                      handleAddRestockRequest={
                                          handleAddRestockRequest
                                      }
                                      selectedChildProduct={
                                          selectedChildProduct
                                      }
                                  />
                              )}
                        <div className="product-noti">
                            <h5 className="product-noti__title">Notice</h5>
                            <p
                                className="product-noti__des"
                                dangerouslySetInnerHTML={{
                                    __html: product.short_description
                                }}
                            />
                        </div>
                        <ProductBadges product={product} />
                    </div>
                )}
            </div>

            <div className="product-tab">
                <div className="tabs-pills">
                    <div className="nav tabs-pills__nav" role="tablist">
                        <a
                            className={`tabs-pills__link cursor-pointer ${
                                currentTab === TAB_DESCRIPTION ? 'active' : ''
                            }`}
                            id="nav-profile-tab"
                            onClick={() => setCurrentTab(TAB_DESCRIPTION)}
                        >
                            Description
                        </a>
                        <a
                            className={`tabs-pills__link cursor-pointer ${
                                currentTab === TAB_INFO ? 'active' : ''
                            }`}
                            id="nav-contact-tab"
                            onClick={() => setCurrentTab(TAB_INFO)}
                        >
                            Info
                        </a>
                    </div>
                    <div className="tabs-pills__content tab-content">
                        <div
                            className={`tab-pane fade ${
                                currentTab === TAB_DESCRIPTION
                                    ? 'show active'
                                    : ''
                            }`}
                        >
                            <div className="product-des">
                                <p
                                    className="product-des__txt"
                                    dangerouslySetInnerHTML={{
                                        __html: product.description
                                    }}
                                />
                            </div>
                            {product.set_contents_description && (
                                <div className="mt-5">
                                    <h5 className="product-noti__title product-noti__title-des">
                                        セット内容
                                    </h5>
                                    <p
                                        className="product-des__txt mt-3"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                product.set_contents_description
                                        }}
                                    />
                                </div>
                            )}
                            {product.remark_description && (
                                <div className="mt-5">
                                    <h5 className="product-noti__title product-noti__title-des">
                                        備考
                                    </h5>
                                    <p
                                        className="product-des__txt mt-3"
                                        dangerouslySetInnerHTML={{
                                            __html: product.remark_description
                                        }}
                                    />
                                </div>
                            )}
                            {product.brand_description &&
                                product.brand_description.length > 0 &&
                                product.brand_description.map(
                                    (brand, index) => (
                                        <div className="mt-5" key={index}>
                                            <h5 className="product-noti__title product-noti__title-des">
                                                {`${brand.name}について`}
                                            </h5>
                                            <p
                                                className="product-des__txt mt-3"
                                                dangerouslySetInnerHTML={{
                                                    __html: brand.description
                                                }}
                                            />
                                        </div>
                                    )
                                )}

                            {product.upsell_products.length > 0 && (
                                <div className="mt-4">
                                    <hr />
                                    <h5 className="product-noti__title product-noti__title-guide">
                                        {t('product::Up Sell')}
                                    </h5>
                                    <div className="container">
                                        <div className="recommend-full">
                                            <p className="recommend-title hide-xs" />
                                            <ProductRelation
                                                productListName="Up-Sell Products"
                                                relationProducts={
                                                    product.upsell_products
                                                }
                                                displayType="search"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {product.related_products.length > 0 && (
                                <div className="mt-4">
                                    <hr />
                                    <h5 className="product-noti__title product-noti__title-guide">
                                        {t('product::Related')}
                                    </h5>
                                    <div className="container">
                                        <div className="recommend-full">
                                            <p className="recommend-title hide-xs" />
                                            <ProductRelation
                                                productListName="Related Products"
                                                relationProducts={
                                                    product.related_products
                                                }
                                                displayType="search"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {product.guide_description && (
                                <div className="mt-4">
                                    <hr />
                                    <h5 className="product-noti__title product-noti__title-guide">
                                        {product.guide_description.name}
                                    </h5>
                                    <p
                                        className="product-des__txt mt-3"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                product.guide_description
                                                    .description
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div
                            className={`tab-pane fade ${
                                currentTab === TAB_INFO ? 'show active' : ''
                            }`}
                            id="nav-info"
                        >
                            <div className="product-info">
                                <ul className="product-info__list">
                                    {listProductInfo}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ProductFullDetail.propTypes = {
    classes: shape({
        cartActions: string,
        description: string,
        descriptionTitle: string,
        details: string,
        detailsTitle: string,
        imageCarousel: string,
        options: string,
        productName: string,
        productPrice: string,
        quantity: string,
        quantityTitle: string,
        root: string,
        title: string
    }),
    product: shape({
        __typename: string,
        id: number,
        sku: string.isRequired,
        price_range: shape({
            minimum_price: shape({
                regular_price: shape({
                    amount: shape({
                        currency: string.isRequired,
                        value: number.isRequired
                    })
                }).isRequired
            }).isRequired
        }).isRequired,
        media_gallery_entries: arrayOf(
            shape({
                label: string,
                position: number,
                disabled: bool,
                file: string.isRequired
            })
        ),
        description: string
    }).isRequired
};

export default ProductFullDetail;
