import { resourceUrl } from './drivers';

export const PILLAR_CODE = {
    shopping: 'shopping',
    winedine: 'wine-dine',
    travel: 'travel',
    wellness: 'wellness',
    pointmall: 'point-mall',
    estore: 'estore'
};

export const SERVICE_THE_TIME = 'the-time';

export const PRODUCT_SHOPPING_ATTRIBUTE_NAME = 'Shopping Product Set';

export const PRODUCT_SHIPPING_METHOD = {
    1: 'normal',
    2: 'cool',
    3: 'freeze'
};

export const BUZZ_CATEGORY = {
    news: 'news',
    media: 'media',
    gallery: 'gallery'
};

export const PRODUCTS_LIST_DEFAULT_PAGE_SIZE = 30;
export const PRODUCTS_LIST_PAGE_SIZES = [18, 30, 42, 60];

export const TICKET_TYPE = {
    public: 1,
    member_only: 2
};

export const SITE_LINKS = {
    'about-us': 'https://www.skypremium.com.sg/sg/about',
    'sky-point': resourceUrl('mypage/sky-point'),
    buzz: 'https://www.skypremium.com.sg/sg/buzz',
    news: resourceUrl('buzz/news'),
    faq: 'https://www.skypremium.com.sg/sg/faq',
    legal: 'https://www.skypremium.com.sg/sg/legal',
    facebook: 'https://www.facebook.com/SkyPremiumSG/',
    instagram: 'https://www.instagram.com/skypremiumsg/',
    'about-line': resourceUrl('page/contents/about-line.html'),
    'the-community': resourceUrl('page/contents/community.html'),
    youtube: 'https://www.youtube.com/channel/UCiDzkaf6vUu4dyz5S9ouzOA',
    support: 'https://www.skypremium.com.sg/sg/contact',
    'store-apple': 'https://apps.apple.com/sg/app/sky-premium-sg/id1323942044',
    'store-google':
    'https://play.google.com/store/apps/details?id=com.skypremiuminternational.app'
};

export const BRAND_CARD = [
    {
        brand: 'visa',
        name: 'VISA'
    },
    {
        brand: 'amex',
        name: 'AMERICA EXPRESS'
    },
    {
        brand: 'mastercard',
        name: 'MASTER CARD'
    }
];

export const DAY_OF_WEEK_LONG = [
    '日曜日',
    '月曜日',
    '火曜日',
    '水曜日',
    '木曜日',
    '金曜日',
    '土曜日'
];

export const SERVICE_CODE = {
    the_community: 'the-community',
    hotels: 'hotels',
    the_multiplay_travel: 'the-multiplay-travel',
    the_multiplay_wellness: 'the-multiplay-wellness'
};

export const SPECIAL_FONT_SIZE_BY_NAME_XS = [
    '東山ニセコビレッジ・リッツ・カールトン・リザーブ'
];

export const SPECIAL_FONT_SIZE_BY_NAME_SM = [
    'ザ・リッツ・カールトン沖縄',
    'ザ・リッツ・カールトン日光'
];

export const GMAP_KEY = process.env.SKY_GMAP_KEY;

export const COMMUNITY_PORTAL_URL = process.env.SKY_COMMUNITY_PORTAL_URL;

export const MIN_DISCOUNT_PERCENT_TO_SHOW = 5;
