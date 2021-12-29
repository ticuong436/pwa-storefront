import React, { Component, Fragment } from 'react';
import { number, oneOfType, shape, string, bool } from 'prop-types';
import { BasicTextArea, asField } from 'informed';
import { compose } from 'redux';
import classNames from 'classnames';

class TextAreaInput extends Component {
    static propTypes = {
        classes: shape({
            input: string
        }),
        fieldState: shape({
            value: oneOfType([string, number])
        }),
        maxLength: number,
        label: string,
        exceptBreakLine: bool
    };

    state = { length: 0 };

    render() {
        const {
            classes,
            fieldState,
            maxLength,
            exceptBreakLine = false,
            t,
            ...rest
        } = this.props;
        const { state } = this;
        const setState = state => this.setState(state);
        const { asyncError, error } = fieldState;
        const errorMessage = error || asyncError;
        const containClass = classNames('form-customize', {
            ['form-customize--error']: state.length > maxLength,
            ['mb-1']: !!errorMessage
        });

        return (
            <Fragment>
                <div className={containClass}>
                    <div className="form-textarea">
                        <BasicTextArea
                            {...rest}
                            fieldState={fieldState}
                            className={classes.input}
                            onChange={e => {
                                if (e.target.value) {
                                    const inputValue = exceptBreakLine
                                        ? e.target.value.replace(
                                              /(\r\n|\n|\r)/gm,
                                              ''
                                          )
                                        : e.target.value;

                                    setState({
                                        length: [...inputValue].length
                                    });
                                }
                            }}
                        />
                        <p
                            className={`form-textarea__note ${
                                state.length > maxLength
                                    ? 'form-textarea__note--danger'
                                    : ''
                            }`}
                        >
                            {state.length}/{maxLength}{' '}
                            {t('checkout::Characters')}
                        </p>
                    </div>
                </div>
                <p className="text-left text-danger">{errorMessage}</p>
            </Fragment>
        );
    }
}

export default compose(asField)(TextAreaInput);
