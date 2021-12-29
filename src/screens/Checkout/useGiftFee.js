import { useMutation } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useCallback, useEffect, useState } from 'react';
import CALCULATE_SKY_GIFT_FEE from './calculateSkyGiftFee.graphql';
import lodash from 'lodash';

const isArrayEqual = (x, y) =>
    lodash(x)
        .xorWith(y, lodash.isEqual)
        .isEmpty();
const isObject = value => typeof value === 'object' && value !== null;

export const useGiftFee = ({ refetchPrice, orderOptions } = {}) => {
    const [{ cartId }] = useCartContext();
    const [giftFeeItems, setGiftFeeItems] = useState([]);

    const [
        calcalculateGiftFeeMutation,
        { data: giftFeeData = {} }
    ] = useMutation(CALCULATE_SKY_GIFT_FEE);

    const calculateGiftFee = useCallback(orderOptions => {
        const options = orderOptions ? Object.values(orderOptions) : [];
        const newGiftFeeItems = [];
        options.forEach(option => {
            if (
                !isObject(option.message_card) &&
                !isObject(option.gift_wrapping)
            ) {
                return;
            }

            newGiftFeeItems.push({
                includingMessageCard: !!option.message_card,
                giftOrnamentType: option.gift_wrapping
                    ? Number(option.gift_wrapping.type || 0)
                    : 0,
                giftBoxStyle: option.gift_wrapping
                    ? Number(option.gift_wrapping.style || 0)
                    : 0
            });
        });

        setGiftFeeItems(giftFeeItems => {
            if (isArrayEqual(newGiftFeeItems, giftFeeItems)) {
                return giftFeeItems;
            }

            return newGiftFeeItems;
        });
    }, []);

    useEffect(() => {
        if (giftFeeItems) {
            const calculate = async () => {
                await calcalculateGiftFeeMutation({
                    variables: {
                        cartId,
                        items: giftFeeItems
                    }
                });

                if (refetchPrice) {
                    refetchPrice();
                }
            };

            calculate();
        }
    }, [calcalculateGiftFeeMutation, cartId, giftFeeItems, refetchPrice]);

    useEffect(() => {
        if (orderOptions) {
            calculateGiftFee(orderOptions);
        }
    }, [calculateGiftFee, orderOptions]);

    return {
        calculateGiftFee,
        giftFee:
            giftFeeItems && giftFeeItems.length ? giftFeeData.giftFee : null
    };
};
