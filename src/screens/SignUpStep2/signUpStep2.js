import React from 'react';
import { useSignUpStep2 } from './useSignUpStep2';
import signUpStep2 from './signUpStep2.gql';
import { Form, Option } from 'informed';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@skp/components/TextInput';
import {
    isRequired,
    inputCardNumberValidation,
    inputCVCNumberValidation,
    inputValidationName
} from '@skp/utils/formValidators';
import SelectInput from '@skp/components/SelectInput';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '@skp/utils/graphqlError';
import MonthDropdownOption from '@skp/components/MonthDropdownOption';
import YearDropdownOptions from '@skp/components/YearDropdownOptions';
import Moment from 'moment';
import AlertMessage from '@skp/components/AlertMessage';

const SignUpStep2 = ({ stepList }) => {
    const {
        grade,
        paymentCycle,
        paymentAmount,
        handleClickGrade,
        handleClickPaymentCycle,
        memberSubscriptionPlans,
        handleFormSubmit,
        inProgress,
        error,
        handleCancel,
        isTerminatedUserWithInYear,
        registrationCampain,
        checkingUser
    } = useSignUpStep2({
        ...signUpStep2
    });

    const { t } = useTranslation(['common', 'validation']);

    const now = new Date();
    const nextPaymentDate = new Date(
        now.setMonth(
            now.getMonth() +
                (registrationCampain.registration_free_period_enable
                    ? parseInt(registrationCampain.registration_free_period)
                    : 0)
        )
    );

    const membershipGradeHTML = memberSubscriptionPlans.map(plan => {
        return (
            <a
                key={plan.code}
                className={
                    (grade == plan.code ? 'reg-grade--active' : '') +
                    ' reg-grade--link'
                }
                onClick={e => {
                    e.preventDefault();
                    handleClickGrade(plan.code);
                }}
                href="#"
            >
                <span>{plan.code}</span>
            </a>
        );
    });

    const paymentCycleHTML =
        memberSubscriptionPlans.length > 0
            ? memberSubscriptionPlans[0].payment_cycles.map(cycle => {
                  return (
                      <a
                          key={cycle.label}
                          className={
                              (paymentCycle == cycle.interval
                                  ? 'reg-grade--active'
                                  : '') + ' reg-grade--link'
                          }
                          onClick={e => {
                              e.preventDefault();
                              handleClickPaymentCycle(cycle.interval);
                          }}
                          href="#"
                      >
                          <span>{cycle.label}</span>
                      </a>
                  );
              })
            : '';

    const validateCardExpDate = (value, values) => {
        if (!value) {
            return t('validation::Is required');
        }

        if (value.length != 4) {
            return t('validation::Must be exactly {{length}} character(s)', {
                length: 4
            });
        }

        if (!value.match(/^[0-9]*$/)) {
            return t('validation::Please input only number');
        }

        return new Date(value, values.card_exp_month, 0) < new Date()
            ? t(
                  'validation::Card Expired Date must be greater than Current Date.'
              )
            : undefined;
    };

    return (
        <div className="container">
            <div className="main-content">
                <div className="reg-block--step2">
                    <div className="regstep1">
                        {stepList}
                        <div className="reg-welcome">
                            Welcome to SKY PREMIUM <br /> Please select your
                            membership tier.
                        </div>
                        <Form onSubmit={handleFormSubmit}>
                            <>
                                {!checkingUser &&
                                    isTerminatedUserWithInYear && (
                                        <AlertMessage type="error">
                                            {t(
                                                'validation::You can not register for SKY PREMIUM. Please call us.'
                                            )}
                                        </AlertMessage>
                                    )}
                                <div className="reg-block">
                                    <div className="reg2-box row">
                                        <div className="reg2-box-left col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <div className="reg-join reg-grade">
                                                <h2 className="reg-subtitle">
                                                    会員グレード
                                                </h2>

                                                <div className="reg-grade-item">
                                                    {membershipGradeHTML}
                                                </div>
                                            </div>

                                            <div className="reg-join reg-grade">
                                                <h2 className="reg-subtitle">
                                                    会費支払方法
                                                </h2>
                                                <div className="reg-grade-item">
                                                    {paymentCycleHTML}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="reg2-box-right col-xl-6 col-lg-6 col-md-6 col-xs-12">
                                            <div className="reg-join reg-grade">
                                                <h2 className="reg-subtitle">
                                                    決済内容
                                                </h2>
                                            </div>
                                            <div className="reg-payment-block">
                                                <div className="reg-payment">
                                                    <span className="reg-payment--text">
                                                        次回決済予定日
                                                    </span>
                                                    <span className="reg-payment--text">
                                                        {Moment(
                                                            nextPaymentDate
                                                        ).format('YYYY/MM/DD')}
                                                    </span>
                                                </div>
                                                <div className="reg-payment reg-payment-color">
                                                    <span className="reg-payment--text">
                                                        決済金額
                                                    </span>
                                                    <span className="reg-payment--text reg-payment--usd">
                                                        USD {paymentAmount}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="reg-join reg-cus">
                                        <div className="reg-subtitle-caution">
                                            <h2 className="reg-subtitle">
                                                クレジットカード情報
                                            </h2>
                                            <div className="reg-caution">
                                                ※全て半角英数字でご入力ください。
                                            </div>
                                        </div>
                                        <TextInput
                                            type="hidden"
                                            field="grade"
                                            classes={{ input: 'form-control' }}
                                            initialValue={grade}
                                        />
                                        <TextInput
                                            type="hidden"
                                            field="payment_cycle"
                                            classes={{ input: 'form-control' }}
                                            initialValue={paymentCycle}
                                        />
                                        <div className="reg-form reg-confirm row">
                                            <Field
                                                label="カード名義人"
                                                id="cardholder_name"
                                                classes={{
                                                    root:
                                                        'control col-xl-6 col-lg-6 col-md-6 col-xs-12',
                                                    label: 'input-lable'
                                                }}
                                            >
                                                <TextInput
                                                    field="cardholder_name"
                                                    id="cardholder_name"
                                                    validationSchema={inputValidationName(
                                                        t
                                                    )}
                                                    classes={{
                                                        input: 'form-control'
                                                    }}
                                                />
                                            </Field>
                                            <Field
                                                label="カード番号"
                                                id="card_number"
                                                classes={{
                                                    root:
                                                        'control col-xl-6 col-lg-6 col-md-6 col-xs-12',
                                                    label: 'input-lable'
                                                }}
                                            >
                                                <TextInput
                                                    field="card_number"
                                                    id="card_number"
                                                    validationSchema={inputCardNumberValidation(
                                                        t
                                                    )}
                                                    classes={{
                                                        input: 'form-control'
                                                    }}
                                                />
                                            </Field>
                                            <div className="control control-down col-xl-3 col-lg-3 col-md-3 col-xs-12 reg-pay-month">
                                                <SelectInput
                                                    field="card_exp_month"
                                                    id="card_exp_month"
                                                    classes={{
                                                        input: 'reg-select'
                                                    }}
                                                    validate={isRequired(t)}
                                                >
                                                    <Option value="" disabled>
                                                        選択してください
                                                    </Option>
                                                    <MonthDropdownOption />
                                                    <optgroup disabled />
                                                </SelectInput>
                                                <span className="input-lable">
                                                    有効期限（月）
                                                </span>
                                            </div>
                                            <div className="control control-down col-xl-3 col-lg-3 col-md-3 col-xs-12 reg-pay-year">
                                                <SelectInput
                                                    field="card_exp_year"
                                                    id="card_exp_year"
                                                    classes={{
                                                        input: 'reg-select'
                                                    }}
                                                    validate={
                                                        validateCardExpDate
                                                    }
                                                >
                                                    <Option value="" disabled>
                                                        選択してください
                                                    </Option>
                                                    <YearDropdownOptions />
                                                    <optgroup disabled />
                                                </SelectInput>
                                                <span className="input-lable">
                                                    有効期限（年）
                                                </span>
                                            </div>
                                            <Field
                                                label="セキュリティコード"
                                                id="cvc"
                                                classes={{
                                                    root:
                                                        'control col-xl-6 col-lg-6 col-md-6 col-xs-12 reg-pay-cvc',
                                                    label: 'input-lable'
                                                }}
                                            >
                                                <TextInput
                                                    field="card_cvc"
                                                    id="cvc"
                                                    validationSchema={inputCVCNumberValidation(
                                                        t
                                                    )}
                                                    classes={{
                                                        input: 'form-control'
                                                    }}
                                                />
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                                {error && (
                                    <p className="text-left text-danger pt-1">
                                        {getErrorMessage(error.message)}
                                    </p>
                                )}
                                {inProgress ? (
                                    <LoadingIndicator />
                                ) : (
                                    <>
                                        <div className="reg-bottom">
                                            <button
                                                type="submit"
                                                className="reg-btn"
                                                disabled={
                                                    inProgress ||
                                                    checkingUser ||
                                                    isTerminatedUserWithInYear
                                                }
                                            >
                                                次へ
                                            </button>
                                        </div>
                                        <div className="reg-cancel">
                                            <a
                                                className="reg-cancel--link"
                                                href="#"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    handleCancel();
                                                }}
                                            >
                                                {t('common::Cancel')}
                                            </a>
                                        </div>
                                    </>
                                )}
                            </>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpStep2;
