import { string } from 'yup';

// TODO: translate yup?
export const inputValidation = (t, maxLength, required = true) => {
    return string()
        .required(required ? t('validation::Is required') : false)
        .max(
            maxLength,
            t('validation::Must not exceed {{max}} character(s).', {
                max: maxLength
            })
        )
        .matches(
            /^([^!@#$%^&*_+~{}:|<>?,\;'\[\]`=])+$/,
            t(
                'validation::Please input only letters, numbers, hyphen (-) and spaces'
            )
        );
};

export function inputValidationShippingAddress(t, maxLength, required = true) {
    return string()
        .required(required ? t('validation::Is required') : false)
        .max(
            maxLength,
            t('validation::Must not exceed {{max}} character(s).', {
                max: maxLength
            })
        )
        .test({
            name: 'japan-old-character',
            test: function(value) {
                const check = japanOldCharacterValidation(t, value);

                return check !== undefined
                    ? this.createError({
                          message: check
                      })
                    : true;
            }
        });
}

export const inputValidationAddress = (t, required = true) => {
    return string()
        .required(required ? t('validation::Is required') : false)
        .max(
            127,
            t('validation::Must not exceed {{max}} character(s).', { max: 127 })
        )
        // .matches(
        //     /^[a-zA-Z0-9, \(\).<>-]*$/,
        //     t(
        //         'validation::Please input only letters, numbers, hyphen (-), comma (,), spaces, <, >'
        //     )
        // )
        ;
};

export const inputValidationCity = (t, required = true) => {
    return string()
        .required(required ? t('validation::Is required') : false)
        .max(
            256,
            t('validation::Must not exceed {{max}} character(s).', { max: 256 })
        )
        .matches(
            /^[a-zA-Z0-9, \(\).<>-]*$/,
            t(
                'validation::Please input only letters, numbers, hyphen (-), comma (,), spaces, <, >'
            )
        );
};

export const inputValidationName = (t, required = true) => {
    return string()
        .required(required ? t('validation::Is required') : false)
        .max(
            64,
            t('validation::Must not exceed {{max}} character(s).', { max: 64 })
        )
        .matches(
            /^[a-zA-Z0-9, \(\).<>-]*$/,
            t(
                'validation::Please input only letters, numbers, hyphen (-), comma (,), spaces, <, >'
            )
        );
};

export const inputValidationHasComma = (t, maxLength, required = true) => {
    return string()
        .required(required ? t('validation::Is required') : false)
        .max(
            maxLength,
            t('validation::Must not exceed {{max}} character(s).', {
                max: maxLength
            })
        )
        .matches(
            /^[a-zA-Z0-9, -]*$/,
            t(
                'validation::Please input only letters, numbers, hyphen (-), comma (,) and spaces'
            )
        );
};

export const phoneValidation = t =>
    string()
        .required(t('validation::Is required'))
        .max(
            12,
            t('validation::Must not exceed {{max}} character(s).', { max: 12 })
        )
        .matches(/^[0-9]*$/, t('validation::Please input only number'));

export const postalCodeValidation = t =>
    string()
        .transform(value => {
            return value.trim();
        })
        .required(t('validation::Is required'))
        // .length(
        //     7,
        //     t('validation::Must be exactly {{length}} character(s)', {
        //         length: 7
        //     })
        // )
        .matches(/^[0-9]*$/, t('validation::Please input only number'))
        .test('zero-string', t('validation::Invalid input'), value => {
            return Number(value) !== 0;
        });

/**
 * @fileoverview This file houses functions that can be used for
 * validation of form fields.
 *
 * Note that these functions should return a string error message
 * when they fail, and `undefined` when they pass.
 */
const SUCCESS = undefined;

export const hasLengthAtLeast = (t, value, minimumLength) => {
    if (!value || value.length < minimumLength) {
        return t('validation::Must contain at least {{min}} character(s)', {
            min: minimumLength
        });
    }

    return SUCCESS;
};

export const hasLengthAtMost = (t, value, maximumLength) => {
    if (value && value.length > maximumLength) {
        return t('validation::Must not exceed {{max}} character(s).', {
            max: maximumLength
        });
    }

    return SUCCESS;
};

/**
 * isRequired is provided here for convenience but it is inherently ambiguous and therefore we don't recommend using it.
 * Consider using more specific validators such as `hasLengthAtLeast` or `mustBeChecked`.
 */
export const isRequired = t => value => {
    const FAILURE = t('validation::Is required');

    // The field must have a value (no null or undefined) and
    // if it's a boolean, it must be `true`.
    if (!value) return FAILURE;

    // If it is a number or string, it must have at least one character of input (after trim).
    const stringValue = String(value).trim();
    const measureResult = hasLengthAtLeast(t, stringValue, 1);

    if (measureResult) return FAILURE;
    return SUCCESS;
};

export const validatePassword = t => value => {
    const count = {
        lower: 0,
        upper: 0,
        digit: 0,
        special: 0
    };

    if (!value) {
        return false;
    }

    for (const char of value) {
        if (/[a-z]/.test(char)) count.lower++;
        else if (/[A-Z]/.test(char)) count.upper++;
        else if (/\d/.test(char)) count.digit++;
        else if (/\S/.test(char)) count.special++;
    }

    if (Object.values(count).filter(Boolean).length < 3) {
        return t(
            'validation::A password must contain at least 3 of the following: lowercase, uppercase, digits, special characters'
        );
    }

    return SUCCESS;
};

export const validateConfirmPassword = (
    t,
    value,
    values,
    passwordKey = 'password'
) => {
    return value === values[passwordKey]
        ? SUCCESS
        : t('validation::Passwords must match');
};

export const inputCardNumberValidation = t =>
    string()
        .required(t('validation::Is required'))
        .min(
            15,
            t('validation::Must be {{length1}} or {{length2}} character(s)', {
                length1: 15,
                length2: 16
            })
        )
        .max(
            16,
            t('validation::Must be {{length1}} or {{length2}} character(s)', {
                length1: 15,
                length2: 16
            })
        )
        .matches(/^[0-9]*$/, t('validation::Please input only number'));

export const inputCVCNumberValidation = t =>
    string()
        .required(t('validation::Is required'))
        .min(
            3,
            t('validation::Must be {{length1}} or {{length2}} character(s)', {
                length1: 3,
                length2: 4
            })
        )
        .max(
            4,
            t('validation::Must be {{length1}} or {{length2}} character(s)', {
                length1: 3,
                length2: 4
            })
        )
        .matches(/^[0-9]*$/, t('validation::Please input only number'));

export const cartExpiredDateValidation = (t, year, month) => {
    if (!year) {
        return t('validation::Is required');
    }

    return new Date(year, month, 0) <= new Date()
        ? t('validation::This card is expired.')
        : undefined;
};

export const emailValidation = t =>
    string()
        .email(t('validation::Invalid email'))
        .required(t('validation::Is required'));

/**
 * We don't support 4-bytes character because of db charset is utf8
 * Refer to magento validation rule: validate-no-utf8mb4-characters
 */
export const japanOldCharacterValidation = (t, value) => {
    if (!value) return undefined;

    const matches = value.match(/(?:[\uD800-\uDBFF][\uDC00-\uDFFF])/g);

    return !(matches === null)
        ? t(
              'validation::Include the character which is not allowed: {{chars}}.',
              { chars: matches.join() }
          )
        : undefined;
};
