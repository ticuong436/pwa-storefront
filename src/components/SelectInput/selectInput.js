import React, { Component, Fragment } from 'react';
import { number, oneOfType, shape, string } from 'prop-types';
import { asField, BasicSelect } from 'informed';
import { compose } from 'redux';

class SelectInput extends Component {
    static propTypes = {
        classes: shape({
            input: string
        }),
        fieldState: shape({
            value: oneOfType([string, number])
        })
    };

    render() {
        const { classes = {}, fieldState, ...rest } = this.props;

        const { asyncError, error } = fieldState;
        const errorMessage = error || asyncError;

        return (
            <Fragment>
                <BasicSelect
                    {...rest}
                    fieldState={fieldState}
                    className={classes.input}
                />
                {errorMessage && <p className="mage-error">{errorMessage}</p>}
            </Fragment>
        );
    }
}

export default compose(asField)(SelectInput);
