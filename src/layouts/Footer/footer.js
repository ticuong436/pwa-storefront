import React from 'react';
import { Link, resourceUrl } from '@skp/drivers';
import logo from 'design/dest/images/logo-registration.svg';
import iconMasterCard from 'design/dest/images/icon-mastercard.png';
import iconVisa from 'design/dest/images/icon-visa.png';
import iconAmex from 'design/dest/images/icon-amex.png';
import iconStoreApple from 'design/dest/images/store_icon_apple.png';
import iconStoreGoogle from 'design/dest/images/store_icon_google.png';
import iconSealImage from 'design/dest/images/icon-siteseal_gd_3_h_l_m.png';
import { PILLAR_CODE, SITE_LINKS } from '@skp/config';
import { isRunningInWebview } from '@skp/utils/webview';
import TargetBlankLink from '@skp/components/TargetBlankLink';
import { useRef, useEffect } from "react"
const Footer = () => {
    const verifySeal = () => {
        var bgHeight = '460';
        var bgWidth = '593';
        var url =
            'https://seal.godaddy.com/verifySeal?sealID=nAjNnJHFUbu3sXSK8xP5f2z66kRXtqbF8XfaEfcFXtfEnnYjakQ03Mg9zjfh';
        window.open(
            url,
            'SealVerfication',
            'menubar=no,toolbar=no,personalbar=no,location=yes,status=no,resizable=yes,fullscreen=no,scrollbars=no,width=' +
            bgWidth +
            ',height=' +
            bgHeight
        );
    };
    let is_mobile = window.localStorage.getItem('is_mobile') || false;
    // useEffect(()=>{
    // if (!is_mobile == false ) {
    //     isMobileRef.current.style.display = "none";
    // }
    // if (!is_mobile == true ) {
    //     isMobileRef.current.style.display = "block";
    // }
    // },[is_mobile])
    if (isRunningInWebview()) {
        is_mobile = true;
        return null;
    }

    return (
        <>
            {
                !is_mobile ? <footer className="footer" >
                    <div className="container">
                        <div className="row footer__top">
                            <div className="col-lg-3 col-md-3 footer__imgages">
                                <h1 className="footer__logo">
                                    <Link
                                        className="footer__logo-link"
                                        to={resourceUrl('/')}
                                    >
                                        <img src={logo} alt="" />
                                    </Link>
                                </h1>
                            </div>
                            <div className="col-md-9 footer__info">
                                <div className="row">
                                    <div className="col-md-2 footer__col">
                                        <h3 className="footer__sub">SERVICES</h3>
                                        <ul className="footer__list">
                                            <li>
                                                <Link
                                                    to={resourceUrl(PILLAR_CODE.travel)}
                                                >
                                                    Travel
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={resourceUrl(
                                                        PILLAR_CODE.winedine
                                                    )}
                                                >
                                                    Wine & Dine
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={resourceUrl(
                                                        PILLAR_CODE.wellness
                                                    )}
                                                >
                                                    Wellness
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={resourceUrl(
                                                        PILLAR_CODE.shopping
                                                    )}
                                                >
                                                    Shopping
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-2 footer__col">
                                        <h3 className="footer__sub">QUICK LINKS</h3>
                                        <ul className="footer__list">
                                            <li>
                                                <TargetBlankLink
                                                    href={SITE_LINKS['about-us']}
                                                    rel="noopener noreferrer"
                                                >
                                                    About us
                                                </TargetBlankLink>
                                            </li>
                                            <li>
                                                <a href={SITE_LINKS['sky-point']}>
                                                    SKY POINTS
                                                </a>
                                            </li>
                                            <li>
                                                <a href={SITE_LINKS['buzz']}>Buzz</a>
                                            </li>
                                            <li>
                                                <TargetBlankLink
                                                    href={SITE_LINKS['legal']}
                                                    rel="noopener noreferrer"
                                                >
                                                    Legal
                                                </TargetBlankLink>
                                            </li>
                                            <li>
                                                <TargetBlankLink
                                                    href={SITE_LINKS['faq']}
                                                    rel="noopener noreferrer"
                                                >
                                                    FAQ
                                                </TargetBlankLink>
                                            </li>
                                            <li>
                                                <TargetBlankLink
                                                    href={SITE_LINKS['support']}
                                                    rel="noopener noreferrer"
                                                >
                                                    Support
                                                </TargetBlankLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-2 footer__col">
                                        <h3 className="footer__sub">STAY IN TOUCH</h3>
                                        <ul className="footer__list">
                                            <li>
                                                <TargetBlankLink
                                                    href={SITE_LINKS['facebook']}
                                                    rel="noopener noreferrer"
                                                >
                                                    Facebook
                                                </TargetBlankLink>
                                            </li>
                                            <li>
                                                <TargetBlankLink
                                                    href={SITE_LINKS['about-line']}
                                                    rel="noopener noreferrer"
                                                >
                                                    LINE
                                                </TargetBlankLink>
                                            </li>
                                            <li>
                                                <TargetBlankLink
                                                    href={SITE_LINKS['youtube']}
                                                    rel="noopener noreferrer"
                                                >
                                                    Youtube
                                                </TargetBlankLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-3 footer__col">
                                        <h3 className="footer__sub">GET THE APP</h3>

                                        <ul className="footer__list footer__store">
                                            <li>
                                                <TargetBlankLink
                                                    href={SITE_LINKS['store-apple']}
                                                    rel="noopener noreferrer"
                                                >
                                                    <img
                                                        src={iconStoreApple}
                                                        alt="apple"
                                                    />
                                                </TargetBlankLink>
                                            </li>
                                            <li>
                                                <TargetBlankLink
                                                    href={SITE_LINKS['store-google']}
                                                    rel="noopener noreferrer"
                                                >
                                                    <img
                                                        src={iconStoreGoogle}
                                                        alt="google"
                                                    />
                                                </TargetBlankLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-3 footer__col">
                                        <h3 className="footer__sub">
                                            ACCEPTED PAYMENT
                                        </h3>
                                        <div className="row footer__payment">
                                            <img
                                                className="col-md-3 col-sm-2 col-2"
                                                src={iconVisa}
                                                alt="visa"
                                            />
                                            <img
                                                className="col-md-3 offset-md-1 col-sm-2 offset-sm-1 col-2"
                                                src={iconMasterCard}
                                                alt=""
                                            />
                                            <img
                                                className="col-md-3 offset-md-1 col-sm-2 offset-sm-1 col-2"
                                                src={iconAmex}
                                                alt=""
                                            />
                                        </div>
                                        <br />
                                        <br />
                                        <h3 className="footer__sub">CERTIFICATIONS</h3>
                                        <div className="row">
                                            <div className="col-md-12 col-sm-6 col-6 footer__col footer__certifications">
                                                <img
                                                    src={iconSealImage}
                                                    alt=""
                                                    onClick={() => verifySeal()}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="footer__copyright">
                            <p className="footer__copyright-des">
                                © 2021 SKY PREMIUM INTERNATIONAL PTE. LTD. ALL RIGHTS
                                RESERVED.
                            </p>
                        </div>
                    </div>
                </footer> : null
            }

        </>
    );
};

export default React.memo(Footer);
