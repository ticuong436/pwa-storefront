import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from '@skp/hooks/useSearch';
import { Link, resourceUrl } from '@skp/drivers';
import stepSearchIcon from 'design/dest/images/search-step.svg';
import { useUserContext } from '@skp/layouts/context/user';

function BannerToolbar({ classes, bannerToolbarRef }) {
    const [{ currentUser, isSignedIn }] = useUserContext();

    const { t } = useTranslation(['common']);

    const {
        searchKeyword,
        setSearchKeyword,
        onSearchSubmit,
        suggestSearch
    } = useSearch();

    const classUlActiveSuggestSearch =
        searchKeyword && suggestSearch.q_list && !!suggestSearch.q_list.length
            ? 'box-search__result d-block'
            : 'box-search__result';

    return (
        <div className={classes.bannerToolbar} ref={bannerToolbarRef}>
            <div className="sologan">
                <h2 className={`sologan-welcome ${classes.mainBannerSlogan}`}>
                    <span className="hide-xs">Welcome to The Good Life</span>
                    <span className="hide-pc">
                        Welcome to
                        <br />
                        The Good Life
                    </span>
                </h2>
                {isSignedIn ? (
                    <>
                        <h3 className="sologan-name hide-xs">
                            <p>
                                <span>{currentUser.salutation}</span>{' '}
                                <span>{currentUser.firstname}</span>{' '}
                                <span>{currentUser.lastname}</span>
                            </p>
                        </h3>
                        <h3 className="sologan-name hide-pc">
                            <p>
                                <span>{currentUser.salutation}</span>{' '}
                                <span>{currentUser.firstname}</span>
                            </p>
                            <p>{currentUser.lastname}</p>
                        </h3>
                    </>
                ) : null}
            </div>
            <div className="user-nav px-2" id="js-box-search-home">
                <div className="box-search">
                    <div className="box-search__form">
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
                        <Link
                            to={resourceUrl(`/search?query=${searchKeyword}`)}
                            className="box-search__icon"
                        >
                            <img src={stepSearchIcon} alt="" />
                        </Link>
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
                                    <Link
                                        className="box-search__link"
                                        onClick={() =>
                                            setSearchKeyword(product.q)
                                        }
                                        to={resourceUrl(
                                            `/search?query=${encodeURIComponent(
                                                product.q
                                            )}`
                                        )}
                                    >
                                        {product.q}
                                    </Link>
                                </li>
                            ))}
                    </ul>
                </div>
                <div className="side-right">
                    <div className="side-point">
                        <span className="side-point__number">
                            {currentUser.skyPoints.total}
                        </span>
                        <span className="side-point__name">SKY POINTS</span>
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
                </div>
            </div>
        </div>
    );
}

export default BannerToolbar;
