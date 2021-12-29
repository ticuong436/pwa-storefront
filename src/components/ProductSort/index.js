export { default } from './productSort';

export const optionSortValue = sort =>
    sort.attribute ? `${sort.attribute}:${sort.direction}` : '';

export const availableSortMethods = [
    {
        text: 'SKYおすすめ ',
        attribute: '',
        direction: ''
    },
    {
        text: '最新情報',
        attribute: 'sky_enabled_date',
        direction: 'desc'
    },
    {
        text: '価格の安い順',
        attribute: 'price_selling',
        direction: 'asc'
    },
    {
        text: '価格の高い順',
        attribute: 'price_selling',
        direction: 'desc'
    },
    {
        text: '人気ランキング',
        attribute: 'sky_sell_counts',
        direction: 'desc'
    }
];

export const availableTheTimeSortMethods = [
    {
        text: 'SKYおすすめ ',
        attribute: '',
        direction: ''
    },
    {
        text: '価格の安い順',
        attribute: 'price_selling',
        direction: 'asc'
    },
    {
        text: '価格の高い順',
        attribute: 'price_selling',
        direction: 'desc'
    }
];
