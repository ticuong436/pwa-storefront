import React, { useEffect } from 'react';
import { func, number, string } from 'prop-types';
import { useQuantity } from './useQuantity';
import TextInput from '@skp/components/TextInput';

const QuantityFields = props => {
    const { initialValue, itemId, min, onChange, updateQuantity } = props;

    const talonProps = useQuantity({
        initialValue,
        min,
        onChange
    });

    const {
        isDecrementDisabled,
        isIncrementDisabled,
        handleBlur,
        handleDecrement,
        handleIncrement,
        maskInput,
        quantity,
        disableChangeQuantity
    } = talonProps;

    useEffect(() => {
        if (quantity) {
            updateQuantity(quantity);
        }
    }, [quantity, updateQuantity]);

    return (
        <div className="quantity-cart__info">
            <button
                type="button"
                className="quantity-cart__action keep-bg-on-disabled"
                disabled={isDecrementDisabled || disableChangeQuantity}
                onClick={e => {
                    e.preventDefault();
                    handleDecrement();
                }}
            >
                –
            </button>
            <span className="quantity-cart__number">{quantity || ''}</span>
            <TextInput
                aria-label="Item Quantity"
                classes={{ input: 'd-none' }}
                field="quantity"
                id={itemId}
                inputMode="numeric"
                mask={maskInput}
                min={min}
                onBlur={handleBlur}
                pattern="[0-9]*"
                initialValue={quantity}
            />
            <button
                type="button"
                className="quantity-cart__action keep-bg-on-disabled"
                disabled={isIncrementDisabled || disableChangeQuantity}
                onClick={e => {
                    e.preventDefault();
                    handleIncrement();
                }}
            >
                +
            </button>
        </div>
    );
};

const ProductQuantity = props => {
    return <QuantityFields {...props} />;
};

ProductQuantity.propTypes = {
    initialValue: number,
    itemId: string,
    min: number,
    onChange: func
};

ProductQuantity.defaultProps = {
    label: 'Quantity',
    min: 0,
    initialValue: 1,
    onChange: () => {}
};

QuantityFields.defaultProps = {
    min: 0,
    initialValue: 1,
    onChange: () => {},
    updateQuantity: () => {}
};

export default ProductQuantity;
