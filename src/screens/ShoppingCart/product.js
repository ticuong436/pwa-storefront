import React from 'react';
import { useProduct } from '@skp/components/ProductQuantity/useProduct';
import { Price } from '@skp/components/Price';
import { ProductQuantity } from '@skp/components/ProductQuantity';
import { Link, resourceUrl } from '@skp/drivers';
import PopupConfirm from '@skp/components/PopupConfirm';
import AlertMessage from '@skp/components/AlertMessage';
import REMOVE_ITEM_MUTATION from './graphql/removeItemFromCart.graphql';
import UPDATE_QUANTITY_MUTATION from './graphql/updateItemQuantity.graphql';
import extractConfigurableCartItem from '@skp/utils/extractConfigurableCartItem';

const Product = props => {
    const { item, setIsCartUpdating, fetchProductListing } = props;

    const talonProps = useProduct({
        item,
        mutations: {
            removeItemMutation: REMOVE_ITEM_MUTATION,
            updateItemQuantityMutation: UPDATE_QUANTITY_MUTATION
        },
        setIsCartUpdating,
        fetchProductListing
    });

    const {
        handleRemoveFromCart,
        handleUpdateItemQuantity,
        product,
        errorMessage: updateItemErrorMessage,
        isShowPopupConfirm,
        setShowPopupConfirm
    } = talonProps;

    const {
        currency,
        image,
        name,
        quantity,
        unitPrice,
        service_name,
        skyPoint,
        productSaleableStatus
    } = product;

    const { variant } = extractConfigurableCartItem(item);

    const productLink = resourceUrl(`/product/${item.product.id}`);

    const titlePopupConfirm = (
        <p className="modal-customize__des">カートから削除しますか？</p>
    );

    return (
        <>
            <PopupConfirm
                isOpen={isShowPopupConfirm}
                title={titlePopupConfirm}
                onCancel={() => setShowPopupConfirm(false)}
                onConfirm={() => handleRemoveFromCart()}
            />
            <div className="box-cart__item row">
                <div className="col-lg-3 col-md-12 hide-xs">
                    <div className="box-cart__images">
                        <Link to={productLink}>
                            <img src={image} alt="" />
                        </Link>
                    </div>
                </div>
                <div className="col-lg-9 col-md-12 row">
                    <div className="col-lg-6 col-md-12 box-cart__left">
                        <div className="box-cart__images hide-pc">
                            <Link to={productLink}>
                                <img src={image} alt="" />
                            </Link>
                        </div>
                        <div className="box-cart__titles">
                            <h5 className="box-cart__name">
                                {' '}
                                <Link
                                    className="box-cart__link"
                                    to={productLink}
                                >
                                    {variant ? variant.name : name}
                                </Link>
                            </h5>
                            <div className="box-cart__detail hide-xs">
                                {service_name.label && (
                                    <>
                                        <span className="box-cart__txt">
                                            {service_name.label.toUpperCase()}
                                        </span>
                                        <span className="box-cart__dots">
                                            •
                                        </span>
                                    </>
                                )}
                                <span className="box-cart__txt">
                                    <Price
                                        currencyCode={currency}
                                        value={unitPrice}
                                    />
                                </span>
                                <span className="box-cart__dots">•</span>
                                <span className="box-cart__txt">
                                    SKY POINT{' '}
                                    {variant ? variant.sky_point : skyPoint}
                                </span>
                            </div>
                        </div>
                        <button
                            className="box-cart__remove hide-pc"
                            onClick={() => setShowPopupConfirm(true)}
                        >
                            ｘ
                        </button>
                    </div>
                    <div className="col-lg-6 col-md-12 box-cart__right">
                        <div className="quantity-cart">
                            <span className="quantity-cart__text">数量</span>
                            <ProductQuantity
                                itemId={item.id}
                                initialValue={quantity}
                                onChange={handleUpdateItemQuantity}
                            />
                            <div className="quantity-cart__detail">
                                <span className="quantity-cart__price">
                                    <Price
                                        currencyCode={currency}
                                        value={unitPrice}
                                    />
                                </span>
                                <span className="quantity-cart__name">
                                    SKY POINT{' '}
                                    {variant ? variant.sky_point : skyPoint}
                                </span>
                            </div>
                            <button
                                className="box-cart__remove hide-xs"
                                onClick={() => setShowPopupConfirm(true)}
                            >
                                削除
                            </button>
                        </div>
                        <span className="box-cart__price">
                            {' '}
                            <Price
                                currencyCode={currency}
                                value={unitPrice * item.quantity}
                            />
                        </span>
                    </div>
                </div>
                {updateItemErrorMessage && (
                    <div className="col-lg-12 col-md-12 mt-3">
                        <AlertMessage type="error">
                            {updateItemErrorMessage}
                        </AlertMessage>
                    </div>
                )}
                {productSaleableStatus &&
                    !productSaleableStatus['is_saleable'] && (
                        <div className="col-lg-12 col-md-12 mt-3">
                            <AlertMessage type="error">
                                {productSaleableStatus['description']}
                            </AlertMessage>
                        </div>
                    )}
            </div>
        </>
    );
};

export default Product;
