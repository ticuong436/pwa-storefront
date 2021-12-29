import React from 'react';
import visaIcon from 'design/dest/images/visa-icon.png';
import amexIcon from './america.png';
import discoverIcon from './discover.png';
import masterCardIcon from './mastercard.svg';

const ICONS = {
    amex: amexIcon,
    mastercard: masterCardIcon,
    discover: discoverIcon,
    visa: visaIcon
};

export default function CreditCardIcon({ brand, className }) {
    return <img className={className} src={ICONS[brand]} alt="" />;
}
