import React, { useRef } from 'react';
import { useHome } from './useHome';
import Slider from 'react-slick';
import { useRecommendProducts } from './useRecommendProducts';
import { useTranslation } from 'react-i18next';
import ProductBox from './productBox';
import classes from './home.css';
import BannerSlider from './bannerSlider';

export default function HomePage() {
    const { slideBanners, mainBanner, loading: isBannerLoading } = useHome();
    const { t } = useTranslation(['common', 'home']);
    const recommendProducts = useRecommendProducts();

    const recommendSlideSettings = {
        autoplay: true,
        dots: true,
        infinite: true,
        autoplaySpeed: 5000,
        slidesToShow:
            recommendProducts.data.length > 4
                ? 4
                : recommendProducts.data.length,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            }
        ]
    };

    const bannerToolbarRef = useRef(null);

    return (
        <>
            <div className="main-fluid home-main-fluid">
                <BannerSlider
                    isLoading={isBannerLoading}
                    classes={classes}
                    mainBanner={mainBanner}
                    slideBanners={slideBanners}
                    bannerToolbarRef={bannerToolbarRef}
                />
                <div className="container">
                    <div className="recommend-full home-recommend-full">
                        <h1 className="recommend-title">
                            {t('home::Recommendations')}
                        </h1>
                        {!recommendProducts.loading && (
                            <>
                                <Slider
                                    {...recommendSlideSettings}
                                    className={`result row ${
                                        classes.pcDisplay
                                    }`}
                                >
                                    {recommendProducts.data.map(product => (
                                        <div
                                            className="result-item recommend-item col-3"
                                            key={product.id}
                                        >
                                            <ProductBox product={product} />
                                        </div>
                                    ))}
                                </Slider>
                                <div className={`row ${classes.mobileDisplay}`}>
                                    {recommendProducts.data.map(product => (
                                        <div
                                            className="result-item recommend-item col-12"
                                            key={product.id}
                                        >
                                            <ProductBox product={product} />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
