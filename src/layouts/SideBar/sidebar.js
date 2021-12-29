import React, { useState, useEffect } from 'react';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import classNames from 'classnames';
import { Link, resourceUrl } from '@skp/drivers';
import sideStyle from './sidebar.css';
import {
    BUZZ_CATEGORY,
    PILLAR_CODE,
    SERVICE_THE_TIME,
    SITE_LINKS,
    COMMUNITY_PORTAL_URL
} from '@skp/config';
import { useSiteContext } from '@skp/layouts/context/site';
import { X } from 'react-feather';
import Moment from 'moment';
import { useSideBar } from './useSideBar';
import TargetBlankLink from '@skp/components/TargetBlankLink';
import ExternalSupportLink from '@skp/components/ExternalSupportLink';

function LoginLink({ children, className, toggleSidebar }) {
    return (
        <Link
            to={resourceUrl('/login')}
            className={className}
            onClick={toggleSidebar}
        >
            {children}
        </Link>
    );
}

const MENU_ITEMS = {
    home: {
        main: [
            { key: 'home', title: 'HOME', link: resourceUrl('/') },
            { key: PILLAR_CODE.travel, title: 'TRAVEL', link: '#' },
            { key: PILLAR_CODE.winedine, title: 'WINE & DINE', link: '#' },
            { key: PILLAR_CODE.wellness, title: 'WELLNESS', link: '#' },
            { key: PILLAR_CODE.shopping, title: 'SHOPPING', link: '#' },
            {
                key: 'favorite',
                title: 'お気に入り',
                link: resourceUrl('/customer/wishlist')
            },
            { key: PILLAR_CODE.estore, title: 'ESTORE', link: '#' },
            { key: 'buzz', title: 'BUZZ', link: '#' },
            { key: 'membership', title: 'Membership', link: '#' },
            { key: 'stayInTouch', title: 'Stay in touch', link: '#' }
        ]
    },
    [PILLAR_CODE.travel]: {
        title: 'TRAVEL',
        link: resourceUrl(PILLAR_CODE.travel),
        children: [
            {
                key: 'top',
                title: 'TOP',
                link: resourceUrl(PILLAR_CODE.travel)
            },
            {
                key: 'all',
                title: 'すべて',
                link: resourceUrl(PILLAR_CODE.travel + '/listing')
            },
            {
                key: 'hotels',
                title: 'HOTELS',
                link: resourceUrl(PILLAR_CODE.travel + '/service/hotels')
            },
            {
                key: 'hotels-plus',
                title: 'HOTELS＋',
                link: resourceUrl(PILLAR_CODE.travel + '/service/hotels-plus')
            },
            {
                key: 'platinum-vacations',
                title: 'PLATINUM VACATIONS',
                link: resourceUrl(
                    PILLAR_CODE.travel + '/service/platinum-vacations'
                )
            },
            {
                key: 'platinum-vacations-plus',
                title: 'PLATINUM VACATIONS＋',
                link: resourceUrl(
                    PILLAR_CODE.travel + '/service/platinum-vacations-plus'
                )
            },
            {
                key: 'the-multiplay',
                title: 'THE MULTIPLAY',
                link: resourceUrl(
                    PILLAR_CODE.travel + '/service/the-multiplay-travel'
                )
            },
            {
                key: 'by-feature',
                title: '特集から探す',
                link: resourceUrl(PILLAR_CODE.travel + '/features')
            }
            // {
            //     key: 'by-area',
            //     title: 'エリアから探す',
            //     link: resourceUrl(PILLAR_CODE.travel + '/categories')
            // }
        ]
    },
    [PILLAR_CODE.winedine]: {
        title: 'WINE & DINE',
        link: resourceUrl(PILLAR_CODE.winedine),
        children: [
            {
                key: 'top',
                title: 'TOP',
                link: resourceUrl(PILLAR_CODE.winedine)
            },
            {
                key: 'all',
                title: 'すべて',
                link: resourceUrl(PILLAR_CODE.winedine + '/listing')
            },
            {
                key: 'top-table',
                title: 'Top Table',
                link: resourceUrl(PILLAR_CODE.winedine + '/service/top-table')
            },
            {
                key: 'be-our-guest',
                title: 'Be Our Guest',
                link: resourceUrl(
                    PILLAR_CODE.winedine + '/service/be-our-guest'
                )
            },
            {
                key: 'be-our-guest-plus',
                title: 'Be Our Guest+',
                link: resourceUrl(
                    PILLAR_CODE.winedine + '/service/be-our-guest-plus'
                )
            },
            {
                key: 'chefs-table',
                title: "Chef's Table",
                link: resourceUrl(PILLAR_CODE.winedine + '/service/chefs-table')
            },
            {
                key: 'by-feature',
                title: '特集から探す',
                link: resourceUrl(PILLAR_CODE.winedine + '/features')
            }
            // {
            //     key: 'by-area',
            //     title: 'エリアから探す',
            //     link: resourceUrl(PILLAR_CODE.winedine + '/categories')
            // }
        ]
    },
    [PILLAR_CODE.wellness]: {
        title: 'WELLNESS',
        link: resourceUrl(PILLAR_CODE.wellness),
        children: [
            {
                key: 'top',
                title: 'TOP',
                link: resourceUrl(PILLAR_CODE.wellness)
            },
            {
                key: 'all',
                title: 'すべて',
                link: resourceUrl(PILLAR_CODE.wellness + '/listing')
            },
            {
                key: 'the-events',
                title: 'THE EVENTS',
                link: resourceUrl(PILLAR_CODE.wellness + '/service/the-events')
            },
            {
                key: 'the-community',
                title: 'THE COMMUNITY',
                link:
                    COMMUNITY_PORTAL_URL ||
                    resourceUrl(PILLAR_CODE.wellness + '/service/the-community')
            },
            {
                key: 'concierge',
                title: 'CONCIERGE',
                link: resourceUrl(PILLAR_CODE.wellness + '/service/concierge')
            },
            // {
            //     key: 'life-planning',
            //     title: 'LIFE PLANNING',
            //     link: resourceUrl(
            //         PILLAR_CODE.wellness + '/service/life-planning'
            //     )
            // },
            {
                key: 'luxury-experience',
                title: 'LUXURY EXPERIENCE',
                link: resourceUrl(
                    PILLAR_CODE.wellness + '/service/luxury-experience'
                )
            },
            {
                key: 'the-multiplay',
                title: 'THE MULTIPLAY',
                link: resourceUrl(
                    PILLAR_CODE.wellness + '/service/the-multiplay-wellness'
                )
            },
            {
                key: 'the-beauty',
                title: 'THE BEAUTY',
                link: resourceUrl(PILLAR_CODE.wellness + '/service/the-beauty')
            },
            {
                key: 'luxury-card',
                title: 'LUXURY CARD',
                link: resourceUrl(PILLAR_CODE.wellness + '/service/luxury-card')
            },
            // {
            //     key: 'premier-order-cleaning',
            //     title: 'PREMIER ORDER CLEANING',
            //     link: resourceUrl(
            //         PILLAR_CODE.wellness + '/service/premier-order-cleaning'
            //     )
            // },
            {
                key: 'by-feature',
                title: '特集から探す',
                link: resourceUrl(PILLAR_CODE.wellness + '/features')
            }
            // {
            //     key: 'by-area',
            //     title: 'エリアから探す',
            //     link: resourceUrl(PILLAR_CODE.wellness + '/categories')
            // }
        ]
    },
    [PILLAR_CODE.shopping]: {
        title: 'SHOPPING',
        link: resourceUrl(PILLAR_CODE.shopping),
        children: [
            {
                key: 'top',
                title: 'TOP',
                link: resourceUrl(PILLAR_CODE.shopping)
            },
            {
                key: 'all',
                title: 'すべて',
                link: resourceUrl(PILLAR_CODE.shopping + '/listing')
            },
            {
                key: 'the-direct',
                title: 'The Direct',
                link: resourceUrl(PILLAR_CODE.shopping + '/service/the-direct')
            },
            {
                key: 'the-time',
                title: 'The Time',
                link: '#',
                children: [
                    {
                        key: 'all',
                        title: 'すべて',
                        link: resourceUrl(
                            `${
                                PILLAR_CODE.shopping
                            }/service/${SERVICE_THE_TIME}`
                        )
                    }
                ]
            },
            // {
            //     key: 'make-a-wish',
            //     title: 'Make A Wish',
            //     link: resourceUrl(PILLAR_CODE.shopping + '/service/make-a-wish')
            // }
            {
                key: 'by-feature',
                title: '特集から探す',
                link: resourceUrl(PILLAR_CODE.shopping + '/features')
            },
            {
                key: 'by-category',
                title: 'カテゴリから探す',
                link: resourceUrl(PILLAR_CODE.shopping + '/categories')
            }
        ]
    },
    [PILLAR_CODE.estore]: {
        title: 'ESTORE',
        link: resourceUrl(PILLAR_CODE.estore),
        children: [
            {
                key: 'all',
                title: 'すべて',
                link: resourceUrl(PILLAR_CODE.estore + '/listing')
            }
        ]
    },

    favorite: {},
    buzz: {
        title: 'BUZZ',
        link: resourceUrl('#'),
        children: [
            {
                key: 'news',
                title: 'News',
                link: resourceUrl(`/buzz/${BUZZ_CATEGORY.news}`)
            },
            {
                key: 'media',
                title: 'Media',
                link: resourceUrl(`/buzz/${BUZZ_CATEGORY.media}`)
            },
            {
                key: 'gallery',
                title: 'Gallery',
                link: resourceUrl(`/buzz/${BUZZ_CATEGORY.gallery}`)
            }
        ]
    },
    membership: {
        title: 'Member Ship',
        link: resourceUrl('#'),
        children: [
            {
                key: 'faq',
                title: 'FAQ',
                link: SITE_LINKS.faq,
                openInNewTab: true
            },
            {
                key: 'legal',
                title: 'Legal',
                link: SITE_LINKS.legal,
                openInNewTab: true
            },
            {
                key: 'support',
                title: 'Support',
                link: SITE_LINKS.support,
                openInNewTab: true
            },
            {
                key: 'sky-point',
                title: 'Sky Points',
                link: SITE_LINKS['sky-point'],
                openInNewTab: true
            },
            {
                key: 'about-us',
                title: 'About Us',
                link: SITE_LINKS['about-us'],
                openInNewTab: true
            }
        ]
    },
    stayInTouch: {
        title: 'Stay in touch',
        link: resourceUrl('#'),
        children: [
            {
                key: 'facebook',
                title: 'Facebook',
                link: SITE_LINKS.facebook,
                openInNewTab: true
            },
            {
                key: 'line',
                title: 'Line',
                link: SITE_LINKS['about-line'],
                openInNewTab: true
            },
            {
                key: 'youtube',
                title: 'Youtube',
                link: SITE_LINKS.youtube,
                openInNewTab: true
            }
        ]
    }
};

function MenuPart({
    menuItem,
    sideStyle,
    toggleSidebar,
    currentMenuKey,
    setCurrentMenuKey,
    currentSubMenuKey,
    setCurrentSubMenuKey,
    timeEvents
}) {
    const initShowCollapse = menuItem.key == currentMenuKey;
    const [showCollapse, setShowCollapse] = useState(initShowCollapse);
    useEffect(() => {
        setShowCollapse(initShowCollapse);
    }, [initShowCollapse]);
    const collapseContainClass = classNames('canvas-list', {
        ['d-none']: !showCollapse
    });

    const collapseExpandClass = classNames(
        'canvas-item-header-name position-relative',
        {
            [sideStyle.collapsed]: showCollapse,
            [sideStyle.expand]: MENU_ITEMS[menuItem.key].children
        }
    );

    return (
        <>
            <a
                className={collapseExpandClass}
                href={menuItem.link}
                onClick={e => {
                    if (!MENU_ITEMS[menuItem.key].children) {
                        return;
                    }

                    e.preventDefault();
                    setShowCollapse(oldShowCollapse => {
                        if (oldShowCollapse) {
                            setCurrentMenuKey('home');
                        } else {
                            setCurrentMenuKey(menuItem.key);
                        }

                        return !oldShowCollapse;
                    });
                }}
            >
                {menuItem.title}
            </a>
            <ul className={collapseContainClass}>
                {MENU_ITEMS[menuItem.key].children &&
                    MENU_ITEMS[menuItem.key].children.map(
                        (childMenuItem, index) => {
                            if (childMenuItem.children) {
                                return (
                                    <li
                                        className="canvas-item h-auto"
                                        key={`child-menu`}
                                    >
                                        <ChildMenuPart
                                            menuItem={childMenuItem}
                                            sideStyle={sideStyle}
                                            toggleSidebar={toggleSidebar}
                                            currentSubMenuKey={
                                                currentSubMenuKey
                                            }
                                            setCurrentSubMenuKey={
                                                setCurrentSubMenuKey
                                            }
                                            timeEvents={timeEvents}
                                        />
                                    </li>
                                );
                            }

                            return (
                                <li
                                    className="canvas-item h-auto"
                                    key={`child-menu-${index}`}
                                >
                                    {childMenuItem.openInNewTab ? (
                                        <TargetBlankLink
                                            href={childMenuItem.link}
                                            className="canvas-item--name"
                                            rel="noopener noreferrer"
                                            onClick={toggleSidebar}
                                        >
                                            {childMenuItem.title}
                                        </TargetBlankLink>
                                    ) : (
                                        <ExternalSupportLink
                                            to={childMenuItem.link}
                                            className="canvas-item--name"
                                            onClick={toggleSidebar}
                                        >
                                            {childMenuItem.title}
                                        </ExternalSupportLink>
                                    )}
                                </li>
                            );
                        }
                    )}
            </ul>
        </>
    );
}

function ChildMenuPart({
    menuItem,
    sideStyle,
    toggleSidebar,
    currentSubMenuKey,
    setCurrentSubMenuKey,
    timeEvents
}) {
    const subMenuItems = [];
    if (timeEvents && timeEvents.length) {
        timeEvents.forEach((event, index) => {
            subMenuItems[index] = {
                key: `the-time-${index}`,
                title: Moment(event.iso_start_date)
                    .locale(process.env.SKY_STOREFRONT_LANGUAGE)
                    .format('MM月DD日(dd) HH時から'),
                link: resourceUrl(
                    `/${PILLAR_CODE.shopping}/service/${SERVICE_THE_TIME}/${
                        event.id
                    }`
                )
            };
        });
    }

    const initShowCollapse = menuItem.key == currentSubMenuKey;
    const [showCollapse, setShowCollapse] = useState(initShowCollapse);
    useEffect(() => {
        setShowCollapse(initShowCollapse);
    }, [initShowCollapse]);
    const collapseContainClass = classNames(
        `canvas-list canvas-list-sub-level ${sideStyle.canvasListSubLevel}`,
        {
            ['d-none']: !showCollapse
        }
    );

    const collapseExpandClass = classNames(
        'canvas-item--name position-relative',
        {
            [sideStyle.collapsed]: showCollapse,
            [sideStyle.expand]: menuItem.children
        }
    );

    const menuItemsHTML = items => {
        return items.map((childMenuItem, index) => (
            <li className="canvas-item h-auto" key={`child-menu-${index}`}>
                {childMenuItem.openInNewTab ? (
                    <TargetBlankLink
                        href={childMenuItem.link}
                        className="canvas-item--name"
                        style={{ paddingLeft: 2 }}
                        rel="noopener noreferrer"
                        onClick={toggleSidebar}
                    >
                        {childMenuItem.title}
                    </TargetBlankLink>
                ) : (
                    <ExternalSupportLink
                        to={childMenuItem.link}
                        className="canvas-item--name"
                        style={{ paddingLeft: 2 }}
                        onClick={toggleSidebar}
                    >
                        {childMenuItem.title}
                    </ExternalSupportLink>
                )}
            </li>
        ));
    };

    return (
        <>
            <a
                className={collapseExpandClass}
                href={menuItem.link}
                onClick={e => {
                    if (!menuItem.children) {
                        return;
                    }
                    e.preventDefault();
                    setShowCollapse(oldShowCollapse => {
                        if (oldShowCollapse) {
                            setCurrentSubMenuKey();
                        } else {
                            setCurrentSubMenuKey(menuItem.key);
                        }

                        return !oldShowCollapse;
                    });
                }}
            >
                {menuItem.title}
            </a>
            <ul className={collapseContainClass}>
                {menuItem.children && menuItemsHTML(menuItem.children)}
                {subMenuItems.length > 0 && menuItemsHTML(subMenuItems)}
            </ul>
        </>
    );
}

export default function Sidebar({
    isSignedIn,
    isLoggingOut,
    currentUser,
    sidebarIsOpening,
    handleSignOut,
    toggleSidebar
}) {
    const siteCanvasClass = classNames('site-wrapper site-canvas', {
        'site-canvas--active': sidebarIsOpening
    });

    const closeCanvasClass = classNames('close-canvas', {
        'close-canvas--active': sidebarIsOpening
    });

    const [{ currentPillarCode }] = useSiteContext();

    const [currentMenuKey, setCurrentMenuKey] = useState('home');
    const [currentSubMenuKey, setCurrentSubMenuKey] = useState(null);

    const { timeEvents } = useSideBar({
        pillarCode: PILLAR_CODE.shopping,
        pillarCode: PILLAR_CODE.estore
    });

    useEffect(() => {
        if (currentPillarCode) {
            setCurrentMenuKey(currentPillarCode);
        }
    }, [currentPillarCode]);

    const mainMenu = MENU_ITEMS.home.main.map((menuItem, index) => (
        <li className="canvas-item h-auto" key={`main-${index}`}>
            <MenuPart
                menuItem={menuItem}
                sideStyle={sideStyle}
                toggleSidebar={toggleSidebar}
                currentMenuKey={currentMenuKey}
                currentSubMenuKey={currentSubMenuKey}
                setCurrentSubMenuKey={setCurrentSubMenuKey}
                setCurrentMenuKey={setCurrentMenuKey}
                timeEvents={timeEvents}
            />
        </li>
    ));

    const logoutMenu = isSignedIn ? (
        <>
            {isLoggingOut ? (
                <LoadingIndicator>Logging out...</LoadingIndicator>
            ) : (
                <li className="canvas-item h-auto">
                    <a
                        className="canvas-item-header-name position-relative"
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            handleSignOut(e);
                        }}
                    >
                        ログアウト
                    </a>
                </li>
            )}
        </>
    ) : null;

    return (
        <div className={siteCanvasClass}>
            {sidebarIsOpening && (
                <div className={sideStyle.sideMask} onClick={toggleSidebar} />
            )}
            <nav className="site-menu" id="site-menu">
                <div className="nav-wrapper">
                    <div className="col">
                        {isSignedIn ? (
                            <div className="user">
                                <div className="user-name" href="#">
                                    Welcome to <br />
                                    The Good Life
                                </div>
                                <div className="user-mypage text-uppercase">
                                    <Link
                                        to={{
                                            pathname: resourceUrl(
                                                '/customer/account'
                                            ),
                                            state: { isOpenMenu: true }
                                        }}
                                        onClick={toggleSidebar}
                                    >
                                        マイページ
                                    </Link>
                                </div>
                                <div className="user-points">
                                    <span>{currentUser.skyPoints.total}</span>
                                    SKY POINTS
                                </div>
                            </div>
                        ) : (
                            <>
                                <LoginLink
                                    toggleSidebar={toggleSidebar}
                                    className="user-img"
                                >
                                    <img src="" alt="" />
                                </LoginLink>
                                <LoginLink
                                    toggleSidebar={toggleSidebar}
                                    className="user-link"
                                >
                                    Login
                                </LoginLink>
                            </>
                        )}
                        <div className="canvas-box text-uppercase">
                            <ul className="canvas-list">
                                {mainMenu}
                                {logoutMenu}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={closeCanvasClass} onClick={toggleSidebar}>
                    <X className="close-icon" size={64} />
                </div>
            </nav>
        </div>
    );
}
