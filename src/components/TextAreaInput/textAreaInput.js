import React, { Component, Fragment } from 'react';
import { number, oneOfType, shape, string } from 'prop-types';
import { BasicTextArea, asField } from 'informed';
import { compose } from 'redux';

class TextAreaInput extends Component {
    static propTypes = {
        classes: shape({
            input: string
        }),
        fieldState: shape({
            value: oneOfType([string, number])
        })
    };

    render() {
        const { classes, fieldState, ...rest } = this.props;

        const { asyncError, error } = fieldState;
        const errorMessage = error || asyncError;

        return (
            <Fragment>
                <BasicTextArea
                    {...rest}
                    fieldState={fieldState}
                    className={classes.input}
                />
                <p className="mage-error">{errorMessage}</p>
            </Fragment>
        );
    }
}

export default compose(asField)(TextAreaInput);
