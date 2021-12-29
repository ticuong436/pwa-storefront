import { useCallback, useMemo, useState, useEffect } from 'react';
import debounce from 'lodash.debounce';

/**
 *  Quantity Component talon.
 *
 * @param {Number}      props.initialValue the initial quantity value
 * @param {min}         props.min the minimum allowed quantity value
 * @param {Function}    props.onChange change handler to invoke when quantity value changes
 */
export const useQuantity = props => {
    const { initialValue, min, onChange } = props;

    const [prevQuantity, setPrevQuantity] = useState(initialValue);

    const [quantity, setQuantity] = useState(initialValue);

    const isIncrementDisabled = useMemo(() => !quantity, [quantity]);

    // "min: 0" lets a user delete the value and enter a new one, but "1" is
    // actually the minimum value we allow to be set through decrement button.
    const isDecrementDisabled = useMemo(() => !quantity || quantity <= 0, [
        quantity
    ]);

    const [disableChangeQuantity, setDisableChangeQuantity] = useState(false);

    // Fire the onChange after some wait time. We calculate the current delay
    // as enough time for a user to spam inc/dec quantity but not enough time
    // for a user to click inc/dec on Product A and then click Product B.
    const debouncedOnChange = useMemo(
        () =>
            debounce(async val => {
                try {
                    await onChange(val);

                    setPrevQuantity(val);
                } catch (err) {
                    console.log(err);

                    setQuantity(prevQuantity);
                } finally {
                    setDisableChangeQuantity(false);
                }
            }, 350),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onChange, prevQuantity]
    );

    const handleDecrement = useCallback(() => {
        setDisableChangeQuantity(true);
        const newQuantity = quantity - 1;
        setQuantity(newQuantity);
        debouncedOnChange(newQuantity);
    }, [debouncedOnChange, quantity, setQuantity]);

    const handleIncrement = useCallback(() => {
        setDisableChangeQuantity(true);
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        debouncedOnChange(newQuantity);
    }, [debouncedOnChange, quantity, setQuantity]);

    const handleBlur = useCallback(() => {
        setDisableChangeQuantity(true);
        // Only submit the value change if it has changed.
        if (typeof quantity === 'number' && quantity != prevQuantity) {
            debouncedOnChange(quantity);
        }
    }, [debouncedOnChange, prevQuantity, quantity]);

    const maskInput = useCallback(
        value => {
            try {
                // For some storefronts decimal values are allowed.
                const nextVal = parseFloat(value);
                if (nextVal < min) {
                    return min;
                }

                return nextVal;
            } catch (err) {
                console.error(err);
                return prevQuantity;
            }
        },
        [min, prevQuantity]
    );

    /**
     * Everytime initialValue changes, update the quantity field state.
     */
    useEffect(() => {
        setQuantity(initialValue);
    }, [initialValue, setQuantity]);

    return {
        isDecrementDisabled,
        isIncrementDisabled,
        handleBlur,
        handleDecrement,
        handleIncrement,
        maskInput,
        quantity,
        disableChangeQuantity
    };
};
