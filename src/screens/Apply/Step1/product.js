import React from 'react';
import { Price } from '@skp/components/Price';
import { Link, resourceUrl } from '@skp/drivers';
import SelectInput from '@skp/components/SelectInput';
import { Option } from 'informed';
import TextAreaInput from '@skp/screens/Checkout/Step1/textAreaInput';
import {
    isRequired,
    hasLengthAtMost,
    japanOldCharacterValidation
} from '@skp/utils/formValidators';
import { useTranslation } from 'react-i18next';
import DatePickerInput from '@skp/components/DatePickerInput';

const Product = props => {
    const { item } = props;

    const { t } = useTranslation(['checkout', 'apply', 'validation']);

    const { apply_option: applyOption } = item;
    const productLink = resourceUrl(`/product/${item.id}`);

    let dspPersons = '';
    let dspNote = '';
    switch (item.pillar.code) {
        case 'wine-dine':
            dspPersons =
                '※ 大人3名以上やお子さまのご利用につき、店舗の規定や空き状況等によりご案内できない場合がございます。お子さまのご利用の場合はご連絡事項欄に年齢をご記入ください。';
            dspNote =
                '※ お子さまの年齢、苦手食材やアレルギー等がございましたら、こちらにご記入ください。アレルギーが広範囲に及ぶ場合、対応できないことがございます。';
            break;
        case 'travel':
            dspPersons =
                '※ 大人3名以上やお子さまのご宿泊につき、ご希望の施設・日程・空き状況等によりご案内できない場合がございます。お子さまのご宿泊の場合はご連絡事項欄に年齢をご記入ください。';
            dspNote =
                '※ お子さまの年齢、連泊のご希望（獲得 SKY POINTS 数は固定となります）、お部屋タイプのご指定などがございましたらこちらにご記入ください。';
            break;
    }

    return (
        <div className="box-cart__item row">
            <div className="col-lg-3 col-md-12 hide-xs">
                <div className="box-cart__images">
                    <Link to={productLink}>
                        <img src={item.small_image.url} alt="" />
                    </Link>
                </div>
            </div>
            <div className="col-lg-9 col-md-12 row">
                <div className="col-lg-6 col-md-12 box-cart__left">
                    <div className="box-cart__images hide-pc">
                        <Link to={productLink}>
                            <img src={item.small_image.url} alt="" />
                        </Link>
                    </div>
                    <div className="box-cart__titles">
                        <h5 className="box-cart__name">
                            <Link to={productLink} className="box-cart__link">
                                {item.name}
                            </Link>
                        </h5>
                        <div className="box-cart__detail">
                            {item.service_name.label && (
                                <>
                                    <span className="box-cart__txt">
                                        {item.service_name.label}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-md-12 box-cart__right">
                    <div className="quantity-cart">
                        <div className="quantity-cart__detail">
                            <span className="quantity-cart__price">
                                <Price
                                    currencyCode={
                                        item.price_range.minimum_price
                                            .regular_price.currency
                                    }
                                    value={
                                        item.price_range.minimum_price
                                            .regular_price.value
                                    }
                                />
                            </span>
                            <span className="quantity-cart__name">
                                {t('checkout::SKY POINT')} {item.sky_point}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12 col-md-12 box-cart__form">
                    <div className="row">
                        <p className="box-cart__form_dsp color-gold">
                            一度お申込みを完了されますと変更や再申請ができません。
                            <br />
                            内容にお間違えの無いようご確認をお願いいたします。
                        </p>
                    </div>
                    {applyOption.sky_plan_required_flag && (
                        <div className="form-customize">
                            {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
                            <label className="label-title">
                                {t('apply::Request for Plan')}
                            </label>
                            <p className="box-cart__form_dsp">
                                ※
                                お申込内容や空き状況等により異なるプランでのご案内となる場合がございます
                            </p>
                            <div className="form-select">
                                <SelectInput
                                    field="plan"
                                    id="plan"
                                    classes={{
                                        input: 'form-control form-scale'
                                    }}
                                    validate={isRequired(t)}
                                >
                                    <Option value="" disabled>
                                        {t('apply::Select Plan')}
                                    </Option>
                                    <Option value={0}>
                                        {t('checkout::Not Requested')}
                                    </Option>
                                    {applyOption.plan_resource &&
                                        applyOption.plan_resource.map(plan => (
                                            <Option
                                                key={plan.value}
                                                value={plan.value}
                                            >
                                                {plan.label}
                                            </Option>
                                        ))}
                                    <optgroup disabled />
                                </SelectInput>
                            </div>
                        </div>
                    )}
                    {(applyOption.sky_plan_request_adult_flag ||
                        applyOption.sky_plan_request_child_flag) && (
                        <>
                            <div className="form-customize m-0">
                                {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
                                <label className="label-title">
                                    {t('apply::Request for Person')}
                                </label>
                            </div>
                            <div className="row">
                                <p className="box-cart__form_dsp">
                                    {dspPersons}
                                </p>
                            </div>
                            <div className="row">
                                {applyOption.sky_plan_request_adult_flag && (
                                    <div className="col-lg-6 col-md-12 form-customize">
                                        <div className="form-select">
                                            <SelectInput
                                                field="plan_adult"
                                                id="plan_adult"
                                                validate={isRequired(t)}
                                                classes={{
                                                    input:
                                                        'form-control form-scale'
                                                }}
                                            >
                                                <Option value="" disabled>
                                                    {t(
                                                        'apply::Adult Person Count'
                                                    )}
                                                </Option>
                                                {applyOption.sky_plan_request_adult_resource &&
                                                    applyOption.sky_plan_request_adult_resource.map(
                                                        plan => (
                                                            <Option
                                                                key={plan}
                                                                value={plan}
                                                            >
                                                                (大人){plan}
                                                            </Option>
                                                        )
                                                    )}
                                                <optgroup disabled />
                                            </SelectInput>
                                        </div>
                                    </div>
                                )}
                                {applyOption.sky_plan_request_child_flag && (
                                    <div className="col-lg-6 col-md-12 form-customize">
                                        <div className="form-select">
                                            <SelectInput
                                                field="plan_child"
                                                id="plan_child"
                                                classes={{
                                                    input:
                                                        'form-control form-scale'
                                                }}
                                            >
                                                <Option value="" disabled>
                                                    {t(
                                                        'apply::Child Person Count'
                                                    )}
                                                </Option>
                                                {applyOption.sky_plan_request_child_resource &&
                                                    applyOption.sky_plan_request_child_resource.map(
                                                        plan => (
                                                            <Option
                                                                key={plan}
                                                                value={plan}
                                                            >
                                                                (子ども)
                                                                {plan}
                                                            </Option>
                                                        )
                                                    )}
                                                <optgroup disabled />
                                            </SelectInput>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    {(applyOption.sky_plan_request_date1_flag ||
                        applyOption.sky_plan_request_date2_flag ||
                        applyOption.sky_plan_request_date3_flag) && (
                        <div className="form-customize">
                            {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
                            <label className="label-title">
                                {t('apply::Request for Date')}
                            </label>
                            <p className="box-cart__form_dsp">
                                ※ 対象期間内でのみご選択いただけます。
                            </p>
                            <p className="box-cart__form_dsp">
                                ※
                                空き状況等により、ご希望に添えない場合がございます。
                            </p>
                            {applyOption.sky_plan_request_date1_flag && (
                                <div className="form-customize">
                                    <div className="form-input">
                                        <DatePickerInput
                                            className="form-control form-scale"
                                            placeholderText={t(
                                                'apply::Select First Request Date'
                                            )}
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            scrollableYearDropdown
                                            dateFormat="yyyy/MM/dd"
                                            autoComplete="off"
                                            field="plan_date1"
                                            validate={isRequired(t)}
                                            minDate={
                                                applyOption.sky_tv_stay_start_date
                                                    ? new Date(
                                                          applyOption.sky_tv_stay_start_date
                                                      )
                                                    : null
                                            }
                                            maxDate={
                                                applyOption.sky_tv_stay_end_date
                                                    ? new Date(
                                                          applyOption.sky_tv_stay_end_date
                                                      )
                                                    : null
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                            {applyOption.sky_plan_request_date2_flag && (
                                <div className="form-customize">
                                    <div className="form-input">
                                        <DatePickerInput
                                            className="form-control form-scale"
                                            placeholderText={t(
                                                'apply::Select Second Request Date'
                                            )}
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            scrollableYearDropdown
                                            dateFormat="yyyy/MM/dd"
                                            autoComplete="off"
                                            field="plan_date2"
                                            validate={isRequired(t)}
                                            minDate={
                                                applyOption.sky_tv_stay_start_date
                                                    ? new Date(
                                                          applyOption.sky_tv_stay_start_date
                                                      )
                                                    : null
                                            }
                                            maxDate={
                                                applyOption.sky_tv_stay_end_date
                                                    ? new Date(
                                                          applyOption.sky_tv_stay_end_date
                                                      )
                                                    : null
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                            {applyOption.sky_plan_request_date3_flag && (
                                <div className="form-customize">
                                    <div className="form-input">
                                        <DatePickerInput
                                            className="form-control form-scale"
                                            placeholderText={t(
                                                'apply::Select Third Request Date'
                                            )}
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            scrollableYearDropdown
                                            dateFormat="yyyy/MM/dd"
                                            autoComplete="off"
                                            field="plan_date3"
                                            validate={isRequired(t)}
                                            minDate={
                                                applyOption.sky_tv_stay_start_date
                                                    ? new Date(
                                                          applyOption.sky_tv_stay_start_date
                                                      )
                                                    : null
                                            }
                                            maxDate={
                                                applyOption.sky_tv_stay_end_date
                                                    ? new Date(
                                                          applyOption.sky_tv_stay_end_date
                                                      )
                                                    : null
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {applyOption.sky_customer_note_flag && (
                        <div className="form-customize">
                            {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
                            <label className="label-title">
                                {t('apply::Note')}
                            </label>

                            <p className="box-cart__form_dsp">{dspNote}</p>
                            <div className="control">
                                <TextAreaInput
                                    allowEmptyString
                                    classes={{
                                        input:
                                            'form-control form-scale form-textarea-height'
                                    }}
                                    id="customer_note"
                                    placeholder={t('apply::Note')}
                                    field="customer_note"
                                    maxLength={50}
                                    validate={value =>
                                        hasLengthAtMost(t, value, 50) ||
                                        japanOldCharacterValidation(t, value)
                                    }
                                    t={t}
                                />
                            </div>
                        </div>
                    )}
                    <div className="row">
                        {item.pillar.code && item.pillar.code == 'wine-dine' ? (
                            <>
                                <p className="box-cart__form_dsp color-gold">
                                    ご利用条件
                                </p>
                                <p className="box-cart__form_dsp">
                                    ・各サービス・店舗のご利用上限回数、予約の変更・キャンセルについては、店舗ページの規定をご確認ください。
                                </p>
                                <p className="box-cart__form_dsp">
                                    ・TOP TABLE は抽選となります。
                                </p>
                                <p className="box-cart__form_dsp color-gold">
                                    TOP TABLE の決済および予約について
                                </p>
                                <p className="box-cart__form_dsp">
                                    ・受付期間終了後厳正に抽選を行い、ご当選者様へは弊社指定日に、ご登録のクレジットカードへ利用代金の請求（自動引落し）させていただきます。何らかの事由により引き落としが出来なかった場合、大変恐れ入りますが、落選とさせていただきます。
                                </p>
                                <p className="box-cart__form_dsp">
                                    ・ご当選者様の決済完了後に予約確定とし、メールにてご連絡いたします。
                                </p>
                                <p className="box-cart__form_dsp">
                                    ・
                                    <span className="color-red">
                                        ご当選後のお客様のご都合によるお取消しや変更、返金はお受けいたしかねます。
                                    </span>
                                    予めご都合などを十分にご確認のうえ、お申込みをいただきますようお願い申し上げます。
                                </p>
                            </>
                        ) : null}

                        {item.pillar.code && item.pillar.code == 'travel' ? (
                            <>
                                <p className="box-cart__form_dsp color-gold">
                                    ご利用条件
                                </p>
                                <p className="box-cart__form_dsp">
                                    ・抽選となります。
                                </p>
                                <p className="box-cart__form_dsp">
                                    ・施設のご利用上限回数は、各施設 1
                                    回/年までとなっております。
                                </p>
                                <p className="box-cart__form_dsp color-gold">
                                    抽選結果連絡・当選後の決済および予約について
                                </p>
                                <p className="box-cart__form_dsp">
                                    ・受付期間終了後、厳正に抽選を行い、弊社指定日に抽選結果（ご当選者様へは当選内容を含む）をメールにてご連絡いたします。
                                </p>
                                <p className="box-cart__form_dsp">
                                    ・当選内容をご確認いただいた上、ご宿泊者様情報フォームをご提出いただき、宿泊費のお支払手続きを完了されましたら本予約となります。（本予約完了後は施設のキャンセルポリシーが適用されます。）
                                </p>
                                <p className="box-cart__form_dsp">
                                    ・ご当選後にお取消しされる場合は必ずご連絡をお願いいたします。ご連絡がない場合、当選の権利放棄とみなし
                                    1
                                    年間同施設がご利用いただけなくなる場合がございます。
                                </p>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
