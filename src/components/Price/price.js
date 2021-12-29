import React, { PureComponent, Fragment } from 'react';
import { number, string } from 'prop-types';
import patches from '@skp/utils/intlPatches';

/**
 * The **Price** component is used anywhere a price needs to be displayed.
 *
 * Formatting of prices and currency symbol selection is handled entirely by the ECMAScript Internationalization API available in modern browsers.
 *
 * A [polyfill][] is required for any JavaScript runtime that does not have [Intl.NumberFormat.prototype.formatToParts][].
 *
 * [polyfill]: https://www.npmjs.com/package/intl
 * [Intl.NumberFormat.prototype.formatToParts]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts
 */
export default class Price extends PureComponent {
    static propTypes = {
        /**
         * The numeric price
         */
        value: number.isRequired,
        /**
         * A string with any of the currency code supported by Intl.NumberFormat
         */
        currencyCode: string.isRequired
    };

    render() {
        const { value, currencyCode } = this.props;

        const parts = patches.toParts.call(
            Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: currencyCode
            }),
            value
        );

        const children = parts.map((part, i) => {
            const key = `${i}-${part.value}`;

            return <Fragment key={key}>{part.value}</Fragment>;
        });

        return <span>{children}</span>;
    }
}
