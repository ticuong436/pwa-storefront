import React from 'react';
import { useSkyPoint } from './useSkyPoint';
import { Price } from '@skp/components/Price';
import { getErrorMessage } from '@skp/utils/graphqlError';
import { useTranslation } from 'react-i18next';
import MainPageTitle from '@skp/components/MainPageTitle';

const LIST_TYPE_REDEEM = [
    { type: 1, title: 'Use Partial Points', input: true },
    { type: 2, title: 'Use Full Points', input: false },
    { type: 3, title: 'No use', input: false }
];

export default function SkyPoints({
    onClose,
    cartId,
    onSkyPointsRedeemed,
    redeemedSkypoints: initialRedeemedSkypoints
}) {
    const {
        inputSkyPoint,
        setInputSkyPoint,
        skyPoints,
        redeemSkyPoints,
        isLoadingPoints,
        isRedeeming,
        redeemMethod,
        errorWhenRedeem,
        errorValidateInput,
        setRedeemMethod,
        isRedeemSuccess,
        setRedemSuccess
    } = useSkyPoint({ cartId, onSkyPointsRedeemed, initialRedeemedSkypoints });

    let msgError = errorWhenRedeem
        ? getErrorMessage(errorWhenRedeem.message)
        : errorValidateInput;

    const { t } = useTranslation(['checkout', 'common']);

    if (isRedeemSuccess) {
        onClose();
        setRedemSuccess(false);
        msgError = '';
    }

    return (
        <div className="modal-body p-0">
            <div className="modal-customize__block flex-horizontal hide-xs">
                <div className="modal-customize__block-box">
                    <span className="modal-customize__block-box--title">
                        {t('checkout::Total SKY POINTS')}
                    </span>
                    <span className="modal-customize__block-box--price">
                        {isLoadingPoints ? '...' : skyPoints}{' '}
                    </span>
                </div>
                <div className="modal-customize__block-box">
                    <span className="modal-customize__block-box--title">
                        {t('checkout::SKY POINTS Worth')}
                    </span>
                    <span className="modal-customize__block-box--price">
                        {isLoadingPoints ? (
                            '...'
                        ) : (
                            <Price value={skyPoints} currencyCode="SGD" />
                        )}
                    </span>
                </div>
            </div>
            <div className="modal-customize__block flex-virtical hide-pc">
                <div className="modal-customize__block-box">
                    <span className="modal-customize__block-box--title">
                        {t('checkout::Total SKY POINTS')}
                    </span>
                    <span className="modal-customize__block-box--price">
                        {isLoadingPoints ? '...' : skyPoints}{' '}
                    </span>
                </div>
                <div className="modal-customize__block-box">
                    <span className="modal-customize__block-box--title">
                        {t('checkout::SKY POINTS Worth')}
                    </span>
                    <span className="modal-customize__block-box--price">
                        {isLoadingPoints ? (
                            '...'
                        ) : (
                            <Price value={skyPoints} currencyCode="SGD" />
                        )}
                    </span>
                </div>
            </div>
            <div className="modal-customize__block flex-virtical">
                <MainPageTitle title={t('checkout::Redeem Method')} />

                {LIST_TYPE_REDEEM.map(item => (
                    <div
                        className={`modal-customize-box ${
                            item.type == '1' ? '' : ''
                        }`}
                        key={item.type}
                    >
                        <div className="control">
                            <input
                                className="modal-customize-box--checkbox"
                                type="radio"
                                id="mod-box"
                                name="type"
                                placeholder="0"
                                value={item.type}
                                checked={redeemMethod == item.type}
                                onChange={e => {
                                    setRedeemMethod(e.target.value);
                                }}
                            />
                        </div>
                        <div className="modal-customize-box--use">
                            {t(`checkout::${item.title}`)}
                        </div>
                        {item.input && (
                            <div
                                className={`control ${
                                    item.type == '1' ? ' control-bottom' : ''
                                }`}
                            >
                                <input
                                    className="modal-customize-box--input box-border"
                                    type="text"
                                    id=""
                                    value={inputSkyPoint}
                                    onChange={e => {
                                        setRedeemMethod(item.type);
                                        setInputSkyPoint(e.target.value);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="modal-customize__block modal-customize__des txt-left">
                {t('checkout::When using sky dollars')} <br />•
                
                {t('checkout::Please enter point number')} 
                {/*
                <br />•
                {t('checkout::The total amount below is {{price}} SGD ', {
                    price: 0
                })}
                {t('checkout::Or set it to {{min}} yen or more', { min: 100 })}
                {t('checkout::The total amount is')} <br />
                {t('checkout::You cannot order for {{min}} to {{max}} yen.', {
                    min: 1,
                    max: 99
                })}
                */}
            </div>
            {msgError && <p className="text-danger pt-2">{msgError}</p>}
            <div className="modal-confirm">
                <div className="modal-confirm__btn">
                    <button
                        className="button btn-block button--primary"
                        type="button"
                        disabled={isRedeeming}
                        onClick={() =>
                            redeemSkyPoints(inputSkyPoint, redeemMethod)
                        }
                    >
                        {t('common::CONFIRM')}
                    </button>
                </div>
                <div className="modal-confirm__btn">
                    <button
                        className="button btn-block"
                        type="button"
                        data-dismiss="modal"
                        onClick={onClose}
                    >
                        {t('checkout::Cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
}
