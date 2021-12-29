import React from 'react';
import { string } from 'prop-types';
import { useOfferTerminate } from './useOfferTerminate';
import offerChangeGradeOperations from '@skp/components/OfferChangeGrade/offerChangeGrade.gql';
import PopupConfirm from '@skp/components/PopupConfirm';
import { TERMINATE } from '@skp/utils/changeType';
import OnlyViewOfferTerminate from './onlyViewOfferTerminate';
import { useTranslation } from 'react-i18next';

const OfferTerminate = props => {
    const { t } = useTranslation(['profile']);

    const {
        isChangingType,
        setIsChangingType,
        newOfferTerminateCanUpdate,
        changeType,
        userGroup,
        setChangeType,
        setNewOfferTerminateCanUpdate,
        reloadCustomer
    } = props;

    const talonProps = useOfferTerminate({
        offerChangeGradeOperations,
        newOfferTerminateCanUpdate,
        changeType,
        userGroup,
        setIsChangingType,
        setChangeType,
        setNewOfferTerminateCanUpdate,
        reloadCustomer
    });

    const {
        inProgress,
        isOpenConfirm,
        handleTerminateOffer,
        dispatch
    } = talonProps;

    let offerTerminateBtn = '';
    let contentPopupConfirm = '';

    if (newOfferTerminateCanUpdate === TERMINATE) {
        offerTerminateBtn = (
            <button
                className="member-pay--link keep-bg-on-disabled"
                onClick={() => dispatch({ type: 'show_confirm' })}
                disabled={isChangingType}
            >
                {t('profile::Terminate')}
            </button>
        );

        contentPopupConfirm = (
            <>
                <div className="modal-customize__des">
                    <h1>退会申請</h1>
                </div>
                <p> 【ご注意ください】</p>
                <p>
                    ■退会すると、全てのサービス・コンテンツが利用できなくなります。（他社との提携コンテンツやサービスを含む）
                </p>
                <p>
                    ■次回決済日の前日までは会員資格は継続し、決済日をもって退会完了となります（会費の請求はございません）。
                </p>
                <p>
                    ■退会申請は、次回決済日の前日まではいつでも申請の取消し手続きが可能です。
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
    } else if (newOfferTerminateCanUpdate === '' && changeType === TERMINATE) {
        offerTerminateBtn = (
            <button
                className="member-pay--link keep-bg-on-disabled"
                onClick={() => dispatch({ type: 'show_confirm' })}
                disabled={isChangingType}
            >
                {t('profile::Terminate Cancel')}
            </button>
        );

        contentPopupConfirm = (
            <>
                <div className="modal-customize__des">
                    <h1>退会申請取消し</h1>
                </div>
                <p>退会申請の取消しをおこないます。よろしいですか？</p>
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
    }

    // View Condition
    if (offerTerminateBtn === '') {
        offerTerminateBtn = <OnlyViewOfferTerminate changeType={changeType} />;
    }

    return (
        <React.Fragment>
            <PopupConfirm
                isOpen={isOpenConfirm}
                onCancel={() => {
                    dispatch({ type: 'close_confirm' });
                }}
                onConfirm={() => {
                    handleTerminateOffer(newOfferTerminateCanUpdate);
                }}
                isLoading={inProgress}
                size="large"
                description={contentPopupConfirm}
            />
            {offerTerminateBtn}
        </React.Fragment>
    );
};

OfferTerminate.propTypes = {
    changeType: string
};

export default OfferTerminate;
