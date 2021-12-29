import React, { useMemo, useRef } from 'react';
import defaultBannerImageFromDesign from 'design/dest/images/login-bg.jpg';
import { resourceUrl } from '@skp/drivers';
import BannerToolbar from './bannerToolbar';
import Slider from 'react-slick';
import BannerSlide from './bannerSlide';

function BannerSlider({
    classes,
    mainBanner,
    slideBanners,
    bannerToolbarRef,
    isLoading
}) {
    const defaultBannerImage = useMemo(() => {
        if (isLoading) return null;
        return mainBanner.image || defaultBannerImageFromDesign;
    }, [mainBanner.image, isLoading]);

    const homeSliderRef = useRef(null);

    const onHomeSliderMouseEnter = e => {
        homeSliderRef.current.style.backgroundImage = `url(${
            e.currentTarget.dataset.backgroundImage
        })`;
        bannerToolbarRef.current.style.opacity = 0;
        const slides = homeSliderRef.current.querySelectorAll(
            '.' + classes.slide
        );
        slides.forEach(slide => slide.classList.remove(classes.active));
        e.currentTarget.classList.add(classes.active);
    };

    const onHomeSliderMouseLeave = () => {
        homeSliderRef.current.style.backgroundImage = `url('${defaultBannerImage}')`;
        bannerToolbarRef.current.style.opacity = 1;
        const slides = homeSliderRef.current.querySelectorAll(
            '.' + classes.slide
        );
        slides.forEach(slide => slide.classList.remove(classes.active));
    };

    const mobileSliderSettings = {
        autoplay: true,
        pauseOnHover: true,
        arrows: false,
        dots: true,
        infinite: true,
        autoplaySpeed: 3000,
        fade: true,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const mobileSliders = useMemo(() => {
        let sliders = [];
        if (mainBanner.image) {
            sliders.push(mainBanner);
        }
        if (slideBanners.length) {
            sliders = sliders.concat(slideBanners);
        }

        return sliders;
    }, [mainBanner, slideBanners]);

    return (
        <>
            <Slider {...mobileSliderSettings} className="d-block d-md-none">
                {mobileSliders.map((banner, index) => {
                    const style = {};
                    if (banner.image) {
                        style.backgroundImage = `url('${resourceUrl(
                            banner.image,
                            {
                                type: 'image-banner'
                            }
                        )}')`;
                    }

                    return (
                        <div key={index}>
                            <div
                                className={`banner ${classes.banner}`}
                                style={style}
                            >
                                {banner.is_main_banner ? (
                                    <BannerToolbar
                                        classes={classes}
                                        mainBanner={mainBanner}
                                    />
                                ) : (
                                    <div
                                        className={`${classes.slide} ${
                                            classes.active
                                        }`}
                                    >
                                        <BannerSlide
                                            banner={banner}
                                            classes={classes}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </Slider>
            <div className={`banner ${classes.banner} d-none d-md-block`}>
                <BannerToolbar
                    bannerToolbarRef={bannerToolbarRef}
                    classes={classes}
                    mainBanner={mainBanner}
                />
                <div
                    className={`row ${classes.slider}`}
                    ref={homeSliderRef}
                    style={{
                        backgroundImage: `url('${defaultBannerImage}')`
                    }}
                    onMouseLeave={onHomeSliderMouseLeave}
                >
                    {slideBanners.map((banner, index) => (
                        <div
                            key={index}
                            className={`col-3 ${classes.slide}`}
                            data-background-image={resourceUrl(banner.image, {
                                type: 'image-banner'
                            })}
                            onMouseOver={onHomeSliderMouseEnter}
                            onFocus={onHomeSliderMouseEnter}
                        >
                            <BannerSlide banner={banner} classes={classes} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default BannerSlider;
