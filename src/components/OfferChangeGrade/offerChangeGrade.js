import React from 'react';
import { string } from 'prop-types';
import { useOfferChangeGrade } from './useOfferChangeGrade';
import offerChangeGradeOperations from './offerChangeGrade.gql';
import PopupConfirm from '@skp/components/PopupConfirm';
import OnlyViewOfferChangeGrade from './onlyViewOfferChangeGrade';
import { UPGRADE, DOWNGRADE, NONE } from '@skp/utils/changeType';
import { useTranslation } from 'react-i18next';

const OfferChangeGrade = props => {
    const { t } = useTranslation(['profile']);
    const {
        changeType,
        newOfferGradeCanUpdate,
        userGroup,
        isChangingType,
        setIsChangingType,
        setChangeType,
        setNewOfferGradeCanUpdate,
        reloadCustomer,
        simpleOffer,
        setTriggerRecollectTotals
    } = props;

    const talonProps = useOfferChangeGrade({
        offerChangeGradeOperations,
        newOfferGradeCanUpdate,
        changeType,
        setIsChangingType,
        setChangeType,
        setNewOfferGradeCanUpdate,
        reloadCustomer,
        setTriggerRecollectTotals
    });

    const {
        inProgress,
        isOpenConfirm,
        handleChangeOfferGrade,
        dispatch
    } = talonProps;

    let offerGradeBtn = '';
    let contentPopupConfirm = '';
    let titlePopupConfirm = '';

    switch (newOfferGradeCanUpdate) {
        case UPGRADE:
            offerGradeBtn = simpleOffer ? (
                <div className="total-cart__btn mb-5">
                    <a
                        className="button button--primary button--full"
                        onClick={() => {
                            if (!isChangingType) {
                                dispatch({ type: 'show_confirm' });
                            }
                        }}
                        href="#"
                    >
                        今すぐPLATINUM会員になる
                    </a>
                </div>
            ) : (
                <button
                    className="member-pay--link keep-bg-on-disabled"
                    onClick={() => dispatch({ type: 'show_confirm' })}
                    disabled={isChangingType}
                >
                    {t('profile::Upgrade')}
                </button>
            );

            contentPopupConfirm = (
                <>
                    <div className="modal-customize__des">
                        <h1>アップグレード申請 </h1>
                    </div>
                    <p>【ご注意ください】</p>
                    <p>■申請完了後すぐに PLATINUM 会員に変更されます。</p>
                    <p>■次回の決済より PLATINUM 会費が請求されます。</p>
                    <p>
                        ■アップグレード完了後、12ヶ月間はダウングレードができません。
                    </p>
                    <p>
                        上記3点をご確認いただいた上で、[はい]をクリックして下さい。
                    </p>
                    <p className="modal-customize__des" />
                    <p>
                        ※[はい]をクリックされますと確認メール（自動配信）が届きます。
                    </p>
                    <p>
                        メールが届かない場合は、大変恐れ入りますがサポートデスクまでご連絡をお願いいたします。
                    </p>
                    <p className="modal-customize__des" />
                </>
            );

            break;
        case DOWNGRADE:
            offerGradeBtn = (
                <button
                    className="member-pay--link keep-bg-on-disabled"
                    onClick={() => dispatch({ type: 'show_confirm' })}
                    disabled={isChangingType}
                >
                    {t('profile::Downgrade')}
                </button>
            );

            contentPopupConfirm = (
                <>
                    <div className="modal-customize__des">
                        <h1>ダウングレード申請 </h1>
                    </div>
                    <p>【ご注意ください】</p>
                    <p>
                        ■次回の決済日より、GOLD 会員に変更され、GOLD
                        会費が請求されます。
                    </p>
                    <p>■次回決済日の前日までは PLATINUM 会員が継続されます。</p>
                    <p>
                        ■ダウングレード申請後、次回決済日の前日まではいつでも申請の取消し手続きが可能です。
                    </p>
                    <p>
                        上記 3
                        点をご確認いただいた上で、[はい]をクリックして下さい。
                    </p>
                    <p className="modal-customize__des" />
                    <p>
                        ※
                        [はい]をクリックされますと確認メール（自動配信）が届きます。
                    </p>
                    <p>
                        メールが届かない場合は、大変恐れ入りますがサポートデスクまでご連絡をお願いいたします。
                    </p>
                    <p className="modal-customize__des" />
                </>
            );

            break;
        case NONE:
            if (changeType === DOWNGRADE) {
                offerGradeBtn = (
                    <button
                        className="member-pay--link keep-bg-on-disabled"
                        onClick={() => dispatch({ type: 'show_confirm' })}
                        disabled={isChangingType}
                    >
                        {t('profile::Downgrade Cancel')}
                    </button>
                );

                contentPopupConfirm = (
                    <>
                        <div className="modal-customize__des">
                            <h1>ダウングレード申請取消し</h1>
                        </div>
                        <p>
                            ダウングレード申請の取消しをおこないます。よろしいですか？
                        </p>
                        <p className="modal-customize__des" />
                        <p>
                            ※
                            [はい]をクリックされますと確認メール（自動配信）が届きます。
                        </p>
                        <p>
                            メールが届かない場合は、大変恐れ入りますがサポートデスクまでご連絡をお願いいたします。
                        </p>
                        <p className="modal-customize__des" />
                    </>
                );
            } else {
                titlePopupConfirm = (
                    <p className="modal-customize__des">
                        {t('profile::Do you want change the offer grade?')}
                    </p>
                );
            }

            break;
    }

    // View Condition
    if (offerGradeBtn === '') {
        offerGradeBtn = (
            <OnlyViewOfferChangeGrade
                userGroup={userGroup}
                changeType={changeType}
            />
        );
    }

    return (
        <React.Fragment>
            <PopupConfirm
                isOpen={isOpenConfirm}
                onCancel={() => {
                    dispatch({ type: 'close_confirm' });
                }}
                onConfirm={() => {
                    handleChangeOfferGrade(newOfferGradeCanUpdate);
                }}
                title={titlePopupConfirm}
                isLoading={inProgress}
                size="large"
                description={contentPopupConfirm}
            />
            {offerGradeBtn}
        </React.Fragment>
    );
};

OfferChangeGrade.propTypes = {
    changeType: string
};

export default OfferChangeGrade;
