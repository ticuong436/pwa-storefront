export const UPGRADE = 'UG';
export const DOWNGRADE = 'DG';
export const TERMINATE = 'TM';
export const NONE = '';

export const getNewChangeTypeCanUpdate = customer => {
    if (customer.new_change_type_can_update !== undefined) {
        const { new_change_type_can_update: newChangeTypeCanUpdate } = customer;

        if (newChangeTypeCanUpdate.indexOf(UPGRADE) !== -1) {
            return UPGRADE;
        } else if (newChangeTypeCanUpdate.indexOf(DOWNGRADE) !== -1) {
            return DOWNGRADE;
        } else if (newChangeTypeCanUpdate.indexOf('') !== -1) {
            return '';
        }
    }

    return null;
};

export const getNewOfferTerminateCanUpdate = customer => {
    if (customer.new_change_type_can_update !== undefined) {
        const { new_change_type_can_update: newChangeTypeCanUpdate } = customer;
        if (newChangeTypeCanUpdate.indexOf(TERMINATE) !== -1) {
            return TERMINATE;
        } else if (newChangeTypeCanUpdate.indexOf('') !== -1) {
            return '';
        }
    }

    return null;
};
