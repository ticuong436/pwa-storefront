import React from 'react';
import { useTranslation } from 'react-i18next';
import defaultClasses from './addToCartButton.module.css';

const AddToCartButton = props => {
    const {
        product,
        handleAddToCart,
        setQuantity,
        quantity,
        isProductInCart,
        handleAddRestockRequest,
        selectedChildProduct,
        isShopingCart = false
    } = props;
    const { t } = useTranslation(['product']);

    if (
        product.sky_time_sales.status === 'ENDED' ||
        product.sky_time_sales.status === 'INVALID'
    ) {
        return (
            <div className="product-cart">
                <div className="product-cart__btn">
                    <a className="button button--none">
                        {t('product::Time sale is ended')}
                    </a>
                </div>
            </div>
        );
    }

    if (product.sky_time_sales.status === 'NOT_STARTED_YET') {
        return (
            <div className="product-cart">
                <div className="product-cart__btn">
                    <a className={`button ${defaultClasses.existInCartBtn}`}>
                        {t('product::Coming soon')}
                    </a>
                </div>
            </div>
        );
    }

    if (
        product.sky_is_product_set &&
        product.saleable_status.type == 'STOCK_STATUS' &&
        !product.saleable_status.is_saleable
    ) {
        return (
            <div className="product-cart">
                <div className="product-cart__btn">
                    <a className="button button--none">
                        {t('product::Out of stock')}
                    </a>
                </div>
            </div>
        );
    }

    if (product.stock_status === 'OUT_OF_STOCK' && product.is_the_time) {
        return (
            <div className="product-cart">
                <div className="product-cart__btn">
                    <a className="button button--none">
                        {t('product::Out of stock')}
                    </a>
                </div>
            </div>
        );
    }

    if (
        product.stock_status === 'OUT_OF_STOCK' &&
        product.__typename === 'TicketProduct'
    ) {
        return (
            <div className="product-cart">
                <div className="product-cart__btn">
                    <a className="button button--none">
                        {t('product::Out of stock')}
                    </a>
                </div>
            </div>
        );
    }

    if (
        selectedChildProduct &&
        selectedChildProduct.product.stock_status === 'OUT_OF_STOCK'
    ) {
        return (
            <div className="product-cart">
                <div className="product-cart__btn">
                    <a className="button button--none">
                        {t('product::Out of stock')}
                    </a>
                </div>
            </div>
        );
    }

    if (
        product.stock_status === 'OUT_OF_STOCK' &&
        !product.is_in_stock_request
    ) {
        return (
            <div className="product-cart">
                <div className="product-cart__btn">
                    <a
                        href="#"
                        className="button button--primary"
                        onClick={e => {
                            e.preventDefault();
                            handleAddRestockRequest(product.id);
                        }}
                    >
                        {t('product::Add restock request')}
                    </a>
                </div>
            </div>
        );
    }

    if (
        product.stock_status === 'OUT_OF_STOCK' &&
        product.is_in_stock_request
    ) {
        return (
            <div className="product-cart">
                <div className="product-cart__btn">
                    <a className="button button--none">
                        {t('product::Existed In Restock Request')}
                    </a>
                </div>
            </div>
        );
    }

    if (isProductInCart) {
        return (
            <div className="product-cart">
                <div className="product-cart__btn">
                    <a className={`button ${defaultClasses.existInCartBtn}`}>
                        {t('product::Exist In Shopping Cart')}
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="product-cart">
            <div className="quantity-cart">
                <div className="quantity-cart__info">
                    <button
                        className="quantity-cart__action keep-bg-on-disabled"
                        onClick={() => setQuantity(quantity - 1)}
                        disabled={quantity < 2}
                    >
                        –
                    </button>

                    <span className="quantity-cart__number">{quantity}</span>
                    <button
                        className="quantity-cart__action keep-bg-on-disabled"
                        onClick={() => setQuantity(quantity + 1)}
                    >
                        +
                    </button>
                </div>
            </div>
            <div className="product-cart__btn">
                <a
                    className="button button--primary"
                    href="#"
                    onMouseDown={e => {
                        // clear focus state.
                        e.preventDefault();
                    }}
                    onClick={e => {
                        e.preventDefault();
                        isShopingCart
                            ? handleAddToCart(product, quantity)
                            : handleAddToCart(quantity);
                    }}
                >
                    {t('product::ADD TO CART')}
                </a>
            </div>
        </div>
    );
};

export default AddToCartButton;
