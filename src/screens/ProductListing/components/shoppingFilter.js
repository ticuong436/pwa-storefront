import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ShoppingFilter({
    addFilterParam,
    removeFilterParam,
    searchFilterParams,
    serviceCode
}) {
    const { t } = useTranslation(['home']);
    const isFilterGiftWrapping = !!searchFilterParams.gift_wrapping;

    const filterByGiftWrapping = value => {
        if (value === 'true') {
            addFilterParam('gift_wrapping', {
                value,
                label: t('home::Available for gift wrapping')
            });
        } else {
            removeFilterParam('gift_wrapping');
        }
    };

    const isFilterGoodReview = !!searchFilterParams.good_review;

    const filterByGoodReview = value => {
        if (value === 'true') {
            addFilterParam('good_review', {
                value,
                label: t('home::Have good review')
            });
        } else {
            removeFilterParam('good_review');
        }
    };

    return (
        <>
            <div className="mr-4">
                <input
                    type="checkbox"
                    id="gift-wrapping-enabled"
                    checked={isFilterGiftWrapping}
                    onChange={e =>
                        filterByGiftWrapping(e.target.checked ? 'true' : '')
                    }
                />{' '}
                <label
                    htmlFor="gift-wrapping-enabled"
                    className="gift-wrapping-enabled"
                >
                    {t('home::Available for gift wrapping')}
                </label>
            </div>
            {serviceCode == 'the-time' && (
                <div>
                    <input
                        type="checkbox"
                        id="good-review"
                        checked={isFilterGoodReview}
                        onChange={e =>
                            filterByGoodReview(e.target.checked ? 'true' : '')
                        }
                    />{' '}
                    <label htmlFor="good-review">
                        {t('home::Have good review')}
                    </label>
                </div>
            )}
        </>
    );
}
