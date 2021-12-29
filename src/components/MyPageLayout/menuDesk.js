import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, resourceUrl, useLocation } from '@skp/drivers';
import classNames from 'classnames';

const MenuDesk = () => {
    const { t } = useTranslation(['navigation']);
    const location = useLocation();

    const MENU_ITEMS = useMemo(
        () => ({
            profile: {
                title: t('navigation::My Profile'),
                url: resourceUrl('/customer/account')
            },
            invitation: {
                title: t('navigation::Invitation'),
                url: resourceUrl('/customer/invitation')
            },
            favorite_list: {
                title: t('navigation::My Favourites'),
                url: resourceUrl('/customer/wishlist')
            },
            restock_request: {
                title: t('navigation::Restock Request List'),
                url: resourceUrl('/mypage/restock-request')
            },
            shopping_subscription: {
                title: t('navigation::Shopping Subscription'),
                url: resourceUrl('/mypage/shopping-subscription')
            },
            order_history: {
                title: t('navigation::My Orders'),
                url: resourceUrl('/customer/sales/history')
            },
            booking_history: {
                title: t('navigation::My Bookings'),
                url: resourceUrl('/customer/booking/history')
            },
            service_history: {
                title: t('navigation::My Services'),
                url: resourceUrl('/customer/services')
            },
            credit_card: {
                title: t('navigation::Manage Credit Card'),
                url: resourceUrl('/customer/stripe/cards')
            },
            shipping_address: {
                title: t('navigation::Manage Shipping Address'),
                url: resourceUrl('/customer/address')
            },
            register_platinum_partner: {
                title: t('navigation::Register Platinum Partner'),
                url: resourceUrl('/customer/register/partner')
            },
            // billing_address: {
            //     title: t('navigation::Manage Billing Address'),
            //     url: resourceUrl('/customer/billing-address')
            // },
            sky_points: {
                title: t('navigation::SKY DOLLARS'),
                url: resourceUrl('/customer/account/loyalty')
            },
            unpaid_payment: {
                title: t('navigation::Payment History'),
                url: resourceUrl('/customer/payment/history')
            }
            // user_purchase: {
            //     title: t('navigation::User Purchase'),
            //     url: resourceUrl('/mypage/user-purchase')
            // }
            // restock_request: {
            //     title: t('navigation::Restock Request List'),
            //     url: resourceUrl('/mypage/restock-request')
            // },
            // shopping_subscription: {
            //     title: t('navigation::Shopping Subscription'),
            //     url: resourceUrl('/mypage/shopping-subscription')
            // },
            // register_platinum_partner: {
            //     title: t('navigation::Register Platinum Partner'),
            //     url: resourceUrl('/mypage/register-platinum-partner')
            // },
        }),
        [t]
    );

    const [currentMenuItemKey, currentMenuItem] = useMemo(() => {
        const pathname = location.pathname;
        if (pathname.indexOf('shipping-address') !== -1) {
            return ['shipping_address', MENU_ITEMS.shipping_address];
        }
        // if (pathname.indexOf('shipping-address') !== -1) {
        //     return ['shipping_address', MENU_ITEMS.billing_address];
        // }

        if (pathname.indexOf('credit-card') !== -1) {
            return ['credit_card', MENU_ITEMS.credit_card];
        }

        if (pathname.indexOf('unpaid-payment') !== -1) {
            return ['unpaid_payment', MENU_ITEMS.unpaid_payment];
        }

        if (pathname.indexOf('order-history') !== -1) {
            return ['order_history', MENU_ITEMS.order_history];
        }

        if (pathname.indexOf('service-history') !== -1) {
            return ['service_history', MENU_ITEMS.service_history];
        }

        if (pathname.indexOf('booking-history') !== -1) {
            return ['booking_history', MENU_ITEMS.booking_history];
        }

        const returnValue = Object.entries(MENU_ITEMS).find(
            ([, menuItem]) => menuItem.url == pathname
        );
        return returnValue ? returnValue : [null, null];
    }, [location, MENU_ITEMS]);

    const isOpenMenu =
        location.state && location.state.isOpenMenu
            ? location.state.isOpenMenu
            : false;
    const [isShowDropDown, setIsShowDropDown] = useState(isOpenMenu);
    useEffect(() => {
        setIsShowDropDown(isOpenMenu);
    }, [isOpenMenu, setIsShowDropDown]);
    const collapseClass = classNames('collapse', {
        ['show']: isShowDropDown
    });

    const menuLinkClass = classNames('side-toggle__link', {
        ['collapsed']: isShowDropDown
    });

    return (
        <div className="side-mobile">
            <div className="side-toggle dropdown-toggle">
                <a
                    className={menuLinkClass}
                    data-toggle="collapse"
                    href="#multi-collapse"
                    role="button"
                    aria-expanded="false"
                    onClick={e => {
                        e.preventDefault();
                        setIsShowDropDown(isShowDropDown => !isShowDropDown);
                    }}
                >
                    {currentMenuItem ? currentMenuItem.title : null}
                </a>
            </div>
            <div className={collapseClass} id="multi-collapse">
                <ul className="side-menu">
                    {Object.keys(MENU_ITEMS).map(menuItemKey => (
                        <li className="side-menu__item" key={menuItemKey}>
                            <Link
                                className={
                                    'side-menu__link' +
                                    (currentMenuItemKey === menuItemKey
                                        ? ' side-menu__link--active'
                                        : '')
                                }
                                to={MENU_ITEMS[menuItemKey].url}
                            >
                                {MENU_ITEMS[menuItemKey].title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MenuDesk;
