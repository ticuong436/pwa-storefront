import React, { useEffect, useState, useMemo } from 'react';
import { Link, resourceUrl, useLocation } from '@skp/drivers';
import menuIcon from 'design/dest/images/menu-step.svg';
import cartIcon from 'design/dest/images/cart-step.svg';
import userIcon from 'design/dest/images/user.svg';
import searchIcon from 'design/dest/images/search-step.svg';
import heartIcon from 'design/dest/images/heart.svg';
import logo from 'design/dest/images/logo-registration.svg';
import { useCartIcon } from './useCartIcon';
import { useSearch } from '@skp/hooks/useSearch';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import { useNotificationContext } from '@skp/layouts/context/notification';
import { useTranslation } from 'react-i18next';
import { BUZZ_CATEGORY, PILLAR_CODE } from '@skp/config';
import { isRunningInWebview } from '@skp/utils/webview';
import AlertMessage from '@skp/components/AlertMessage';
import { useSiteContext } from '@skp/layouts/context/site';
import { isInHome } from '@skp/utils/makeUrl';
import { useRef } from 'react';

const HeaderNavLink = ({ to, title, isActive, children }) => {
    const location = useLocation();

    return (
        <li
            className={
                isActive === true || location.pathname === to ? 'active' : null
            }
        >
            <Link to={to}>{title}</Link>
            {children}
        </li>
    );
};



const CLASS_TO_SHOW_USERNAV = 'user-nav--sticky animated fadeInDown';

const Header = ({
    toggleSidebar,
    isLoggingOut,
    handleSignOut,
    currentUser,
    mainContentRef
}) => {
    const { t } = useTranslation(['common']);
    const { itemCount: cartItemCount } = useCartIcon();
    const {
        searchKeyword,
        setSearchKeyword,
        goToSearch,
        onSearchSubmit,
        suggestSearch
    } = useSearch();

    const location = useLocation();
    useEffect(() => {
        setSearchKeyword('');
    }, [setSearchKeyword, location]);

    const [{ info, error }] = useNotificationContext();
    const [{ currentPillarCode }] = useSiteContext();

    const isHome = useMemo(() => isInHome(location.pathname), [
        location.pathname
    ]);

    const [userNavClass, setUserNavClass] = useState(
        !isHome ? CLASS_TO_SHOW_USERNAV : ''
    );
    let is_mobile = window.localStorage.getItem('is_mobile') || false;


    useEffect(() => {
        if (isRunningInWebview()) {
            is_mobile = true
            return;
        }
        // if (!is_mobile == false ) {
        //     isMobileRef.current.style.display = "none";
        // }
        // if (!is_mobile == true ) {
        //     isMobileRef.current.style.display = "block";
        // }
        if (!isHome) {
            setUserNavClass(CLASS_TO_SHOW_USERNAV);
            return;
        }
        if (!mainContentRef.current) {
            return;
        }

        if ( !is_mobile ) {
            const headerHeight = document.getElementById('js-header-area')
                .clientHeight;
            let boxSearchInHomeElTop = 0;
            const boxSearchInHomeEl = mainContentRef.current.querySelector(
                '#js-box-search-home'
            );

            if (boxSearchInHomeEl) {
                boxSearchInHomeElTop = boxSearchInHomeEl.offsetTop;
            }

            const onScroll = () => {
                const winTop =
                    document.body.scrollTop || document.documentElement.scrollTop;
                if (winTop > headerHeight + boxSearchInHomeElTop - 30) {
                    setUserNavClass(CLASS_TO_SHOW_USERNAV);
                } else {
                    setUserNavClass('');
                }
            };

            window.addEventListener('scroll', onScroll);

            return () => window.removeEventListener('scroll', onScroll);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, mainContentRef.current]);

    const alertMessage = (
        <>
            {info && (
                <AlertMessage
                    type="info"
                    marginBottom={false}
                    scrollToTop={true}
                >
                    {info}
                </AlertMessage>
            )}
            {error && (
                <AlertMessage
                    type="error"
                    marginBottom={false}
                    scrollToTop={true}
                >
                    {error}
                </AlertMessage>
            )}
        </>
    );

    if (isRunningInWebview()) {
        return alertMessage;
    }

    const classUlActiveSuggestSearch =
        searchKeyword && suggestSearch.q_list && !!suggestSearch.q_list.length
            ? 'box-search__result d-block'
            : 'box-search__result';




    return (
        <>
            {
                !is_mobile ? <header className="header" id="js-header-area" >
                    <div className="container">
                        <div className="header__inner">
                            <h1 className="header__logo">
                                <a href={resourceUrl('/')}>
                                    <img src={logo} alt="" />
                                </a>
                            </h1>
                            <div className="header__menu" id="menu">
                                <ul>
                                    <HeaderNavLink
                                        to={resourceUrl('/')}
                                        title="Home"
                                    />
                                    <HeaderNavLink
                                        to={resourceUrl(PILLAR_CODE.travel)}
                                        isActive={
                                            currentPillarCode === PILLAR_CODE.travel
                                        }
                                        title="Travel"
                                    >
                                        <div className="menu-lever">
                                            <ul className="sub-menu">
                                                <li>
                                                    <a href="#">HOTELS</a>
                                                </li>
                                                <li>
                                                    <a href="#">HOTELS PLUS</a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        PLATINUM VACATIONS
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        PLATINUM VACATIONS PLUS
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">THE MULTIPLAY</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </HeaderNavLink>
                                    <HeaderNavLink
                                        to={resourceUrl(PILLAR_CODE.winedine)}
                                        isActive={
                                            currentPillarCode ===
                                            PILLAR_CODE.winedine
                                        }
                                        title="Wine & Dine"
                                    >
                                        <div className="menu-lever">
                                            <ul className="sub-menu">
                                                <li>
                                                    <a href="#">BE OUR GUEST</a>
                                                </li>
                                                <li>
                                                    <a href="#">CHEF'S TABLE</a>
                                                </li>
                                                <li>
                                                    <a href="#">POCKET CONCIERGE</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </HeaderNavLink>
                                    <HeaderNavLink
                                        to={resourceUrl(PILLAR_CODE.wellness)}
                                        isActive={
                                            currentPillarCode ===
                                            PILLAR_CODE.wellness
                                        }
                                        title="Wellness"
                                    >
                                        <div className="menu-lever">
                                            <ul className="sub-menu">
                                                <li>
                                                    <a href="#">THE EVENTS</a>
                                                </li>
                                                <li>
                                                    <a href="#">THE COMMUNITY</a>
                                                </li>
                                                <li>
                                                    <a href="#">CONCIERGE</a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        LIFE PLANNING (仮)
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        LUXURY EXPERIENCE
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">THE MULTIPLAY</a>
                                                </li>
                                                <li>
                                                    <a href="#">THE BEAUTY</a>
                                                </li>
                                                <li>
                                                    <a href="#">LUXURY CARD</a>
                                                </li>
                                                {/* <li>
                                        <a href="#">
                                            PREMIER ORDER CLEANING
                                        </a>
                                    </li> */}
                                            </ul>
                                        </div>
                                    </HeaderNavLink>

                                    {<HeaderNavLink
                                        to={resourceUrl(PILLAR_CODE.shopping)}
                                        isActive={
                                            currentPillarCode ===
                                            PILLAR_CODE.shopping
                                        }
                                        title="Shopping"
                                    >
                                        <div className="menu-lever">
                                            <ul className="sub-menu">
                                                <li>
                                                    <a href="#">New category</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </HeaderNavLink>}

                                    <HeaderNavLink
                                        to={resourceUrl(PILLAR_CODE.estore)}
                                        isActive={
                                            currentPillarCode ===
                                            PILLAR_CODE.estore
                                        }
                                        title='Estore'
                                    >
                                    </HeaderNavLink>


                                    {/* <HeaderNavLink
                            to={resourceUrl(PILLAR_CODE.pointmall)}
                            isActive={
                                currentPillarCode ===
                                PILLAR_CODE.pointmall
                            }
                            title="Point Mall"
                        /> 

                        <HeaderNavLink
                            to={resourceUrl('/buzz')}
                            title="Buzz"
                            isActive={
                                location.pathname.indexOf('/buzz') !==
                                -1
                            }
                        >
                            <div className="menu-lever">
                                <ul className="sub-menu">
                                    <li>
                                        <a
                                            href={resourceUrl(
                                                `/buzz/${
                                                    BUZZ_CATEGORY.news
                                                }`
                                            )}
                                        >
                                            NEWS
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href={resourceUrl(
                                                `/buzz/${
                                                    BUZZ_CATEGORY.media
                                                }`
                                            )}
                                        >
                                            MEDIA
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href={resourceUrl(
                                                `/buzz/${
                                                    BUZZ_CATEGORY.gallery
                                                }`
                                            )}
                                        >
                                            GALLERY
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </HeaderNavLink> */ }
                                    <li>
                                        <a
                                            href="#"
                                            onClick={e => {
                                                e.preventDefault();
                                                handleSignOut(e);
                                            }}
                                        >
                                            {isLoggingOut && (
                                                <LoadingIndicator global={true} />
                                            )}{' '}
                                            logout
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="top-customer">
                                <div className="usericon">
                                    <Link
                                        to={resourceUrl('/customer/account')}
                                        className="usericon-link"
                                    >
                                        <img
                                            className="usericon-img"
                                            src={userIcon}
                                            alt=""
                                        />
                                    </Link>
                                </div>
                                <div className="hearticon">
                                    <Link
                                        to={resourceUrl('/customer/wishlist')}
                                        className="hearticon-link"
                                    >
                                        <img
                                            className="hearticon-img"
                                            src={heartIcon}
                                        />
                                    </Link>
                                </div>
                                <div className="minicart">
                                    <Link
                                        to={resourceUrl('/cart')}
                                        className="minicart-link"
                                    >
                                        <img
                                            className="minicart-img"
                                            src={cartIcon}
                                        />
                                        {cartItemCount ? (
                                            <span>{cartItemCount}</span>
                                        ) : null}
                                    </Link>
                                </div>
                            </div>
                            <div className="site-content">
                                <div className="icon-canvas">
                                    <a
                                        className="toggle-nav"
                                        href="#"
                                        onClick={event => {
                                            event.preventDefault();
                                            toggleSidebar();
                                        }}
                                    >
                                        <img src={menuIcon} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`user-nav ${userNavClass}`}>
                        <div className="box-search">
                            <div className="box-search__form">
                                <span className="box-search__icon">
                                    <img src={searchIcon} alt="img" />
                                </span>
                                <input
                                    className="form-search"
                                    type="text"
                                    placeholder={t('common::Search by keyword')}
                                    value={searchKeyword}
                                    onChange={event =>
                                        setSearchKeyword(event.target.value)
                                    }
                                    onKeyDown={event => onSearchSubmit(event)}
                                />
                            </div>
                            <ul className={classUlActiveSuggestSearch}>
                                {searchKeyword &&
                                    suggestSearch.q_list &&
                                    !!suggestSearch.q_list.length &&
                                    suggestSearch.q_list.map(product => (
                                        <li
                                            className="box-search__item"
                                            key={product.q}
                                        >
                                            <a
                                                className="box-search__link cursor-pointer"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    goToSearch(product.q);
                                                }}
                                            >
                                                {product.q}
                                            </a>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        <div className="side-right">
                            <div className="side-point">
                                <span className="side-point__number">
                                    {currentUser.skyPoints.total}
                                </span>
                                <span className="side-point__name">SKY DOLLARS</span>
                            </div>
                            <div
                                className={
                                    currentUser.group == 'PLATINUM'
                                        ? 'side-images-platinum'
                                        : 'side-images-gold'
                                }
                            >
                                <span>{currentUser.group}</span>
                            </div>
                            <div className="side-info">
                                <Link
                                    className="side-info__name"
                                    to={resourceUrl('/customer/account')}
                                >
                                    {currentUser.salutation} {currentUser.firstname}{' '}
                                    {currentUser.lastname}
                                </Link>
                            </div>
                         </div>
                    </div>
                </header> : null
            }



            {alertMessage}
        </>
    );
};

export default Header;
