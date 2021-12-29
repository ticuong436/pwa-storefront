import { useCallback, useEffect, useState } from 'react';
import GET_CONFIG_SCRIPT_URL from './goosearch.graphql';
import { useQuery } from '@apollo/react-hooks';
import { useUserContext } from '@skp/layouts/context/user';
import Moment from 'moment';

const GSS_AREA_MAPPING = {
    '1': [
        'HOKKAIDO',
        'AOMORI KEN',
        'IWATE KEN',
        'MIYAGI KEN',
        'AKITA KEN',
        'YAMAGATA KEN',
        'FUKUSHIMA KEN'
    ],
    '2': [
        'IBARAKI KEN',
        'TOCHIGI KEN',
        'GUMMA KEN',
        'SAITAMA KEN',
        'CHIBA KEN',
        'TOKYO TO',
        'KANAGAWA KEN',
        'NIIGATA KEN',
        'TOYAMA KEN',
        'ISHIKAWA KEN',
        'FUKUI KEN',
        'YAMANASHI KEN',
        'NAGANO KEN',
        'GIFU KEN',
        'SHIZUOKA KEN',
        'AICHI KEN',
        'MIE KEN'
    ],
    '3': [
        'SHIGA KEN',
        'KYOTO FU',
        'OSAKA FU',
        'HYOGO KEN',
        'NARA KEN',
        'WAKAYAMA KEN',
        'TOTTORI KEN',
        'SHIMANE KEN',
        'OKAYAMA KEN',
        'HIROSHIMA KEN',
        'YAMAGUCHI KEN',
        'TOKUSHIMA KEN',
        'KAGAWA KEN',
        'EHIME KEN',
        'KOCHI KEN'
    ],
    '4': [
        'FUKUOKA KEN',
        'SAGA KEN',
        'NAGASAKI KEN',
        'KUMAMOTO KEN',
        'OITA KEN',
        'MIYAZAKI KEN',
        'KAGOSHIMA KEN',
        'OKINAWA KEN'
    ]
};

const calculateAgeGroup = age => {
    if (age <= 19) {
        return '1';
    } else if (age <= 24) {
        return '2';
    } else if (age <= 29) {
        return '3';
    } else if (age <= 34) {
        return '4';
    } else if (age <= 39) {
        return '5';
    } else if (age <= 44) {
        return '6';
    } else if (age <= 49) {
        return '7';
    } else if (age <= 54) {
        return '8';
    } else if (age <= 59) {
        return '9';
    } else if (age <= 64) {
        return '10';
    } else if (age <= 69) {
        return '11';
    } else {
        return '12';
    }
};

const calculateArea = (country, state) => {
    if (country != 'JP') {
        return '5';
    }

    for (const key in GSS_AREA_MAPPING) {
        if (GSS_AREA_MAPPING[key].includes(state)) {
            return key;
        }
    }
};

export const useGooSearchScript = () => {
    const { data, loading: goosearchScriptLoading } = useQuery(
        GET_CONFIG_SCRIPT_URL,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const [{ currentUser }] = useUserContext();

    const [isScriptAppended, setIsScriptAppended] = useState(false);

    const setUserInfo = useCallback(() => {
        window.GSSA.set('p_gender', currentUser.gender);
        window.GSSA.set(
            'p_age_group',
            calculateAgeGroup(Moment().diff(currentUser.dob, 'years'))
        );
        window.GSSA.set(
            'p_area',
            calculateArea(
                currentUser.registration_country,
                currentUser.registration_state
            )
        );
    }, [
        currentUser.dob,
        currentUser.gender,
        currentUser.registration_country,
        currentUser.registration_state
    ]);

    const sendSearchResult = useCallback(
        (keyword, page, hits, category = '') => {
            try {
                window.GSSA.set('action', 'search');
                window.GSSA.set('keyword', keyword);
                window.GSSA.set('category', category);
                window.GSSA.set('page', page);
                window.GSSA.set('hits', hits);
                setUserInfo();
                window.GSSA.send();
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(error);
                }
            }
        },
        [setUserInfo]
    );

    const sendProductDetail = useCallback(
        (item, amount) => {
            try {
                window.GSSA.set('action', 'click');
                window.GSSA.set('item', item);
                window.GSSA.set('amount', amount);
                setUserInfo();
                window.GSSA.send();
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(error);
                }
            }
        },
        [setUserInfo]
    );

    const sendProductAddToCart = useCallback(
        (item, amount) => {
            try {
                window.GSSA.set('action', 'cart');
                window.GSSA.set('item', item);
                window.GSSA.set('amount', amount);
                setUserInfo();
                window.GSSA.send();
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(error);
                }
            }
        },
        [setUserInfo]
    );

    const sendOrderInfo = useCallback(
        (item, amount) => {
            try {
                window.GSSA.set('action', 'conversion');
                window.GSSA.set('item', item);
                window.GSSA.set('amount', amount);
                setUserInfo();
                window.GSSA.send();
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(error);
                }
            }
        },
        [setUserInfo]
    );

    useEffect(() => {
        let script = null;
        if (data && data.storeConfig.goosearch_script_url) {
            if (!document.getElementById('goosearch')) {
                script = document.createElement('script');
                script.id = 'goosearch';
                script.src = data.storeConfig.goosearch_script_url;
                script.async = true;
                document.body.appendChild(script);
                script.onload = () => {
                    setIsScriptAppended(true);
                };
            }
        }

        return () => {
            if (script) {
                document.body.removeChild(script);
            }
        };
    }, [data]);

    return {
        sendSearchResult,
        sendProductDetail,
        sendProductAddToCart,
        sendOrderInfo,
        isScriptAppended,
        goosearchScriptLoading
    };
};
