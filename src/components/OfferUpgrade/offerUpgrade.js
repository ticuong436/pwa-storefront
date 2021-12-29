import React from 'react';
import OfferChangeGrade from '@skp/components/OfferChangeGrade';
import { Price } from '@skp/components/Price';
import useOfferUpgrade from './useOfferUpgrade';
import { bool, func } from 'prop-types';
import { UPGRADE } from '@skp/utils/changeType';

const OfferUpgrade = ({ setTriggerRecollectTotals, cart }) => {
    const {
        customer,
        newOfferGradeCanUpdate,
        changeType,
        userGroup,
        isChangingType,
        setIsChangingType,
        setChangeType,
        setNewOfferGradeCanUpdate,
        reloadCustomer
    } = useOfferUpgrade();

    if (customer.group !== 'GOLD' || newOfferGradeCanUpdate != UPGRADE) {
        return <></>;
    }

    return (
        <div className="offset-md-9 col-md-3 mt-5">
            <div className="total-cart mt-5">
                <div className="total-cart__top">
                    <p>Save more with upgrades!</p>
                </div>
                <div className="total-cart__middle">
                    <p>
                    If you upgrade to a PLATINUM member, you will get a better deal on this shopping, as well as various limited services and benefits.
                    </p>
                </div>
                <div className="total-cart__last">
                    <p>When you become a PLATINUM member</p>
                    <p className="total-cart__item txt-semibold">
                        <span className="total-cart__name">Total</span>
                        <span className="total-cart__value">
                            <Price
                                value={cart.platinum_cart_infos.sub_total.value}
                                currencyCode={
                                    cart.platinum_cart_infos.sub_total.currency
                                }
                            />
                        </span>
                    </p>
                    <p className="total-cart__item">
                        <span className="total-cart__name">
                            Scheduled to be acquired SKY DOLLARS
                        </span>
                        <span className="total-cart__value">
                            {cart.platinum_cart_infos.sky_point}
                        </span>
                    </p>
                    {customer.new_change_type_can_update !== undefined && (
                        <OfferChangeGrade
                            changeType={changeType}
                            newOfferGradeCanUpdate={newOfferGradeCanUpdate}
                            isChangingType={isChangingType}
                            userGroup={userGroup}
                            setIsChangingType={setIsChangingType}
                            setChangeType={setChangeType}
                            setNewOfferGradeCanUpdate={
                                setNewOfferGradeCanUpdate
                            }
                            reloadCustomer={reloadCustomer}
                            simpleOffer={true}
                            setTriggerRecollectTotals={
                                setTriggerRecollectTotals
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

OfferUpgrade.propTypes = {
    isCartUpdating: bool,
    setForceRender: func
};

export default OfferUpgrade;
