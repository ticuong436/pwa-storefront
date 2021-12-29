import React, { useState } from 'react';
import Slider from 'react-slick';
import carouselClasses from '@skp/components/ProductFullDetail/carousel.css';

const getClassNameForSlideHover = imageNumber => {
    switch (imageNumber) {
        case 1:
            return carouselClasses['w-125'];
        case 2:
            return carouselClasses['w-250'];
        case 3:
            return carouselClasses['w-375'];
        case 4:
            return carouselClasses['w-500'];
        case 5:
            return carouselClasses['w-625'];
        case 6:
            return carouselClasses['w-750'];
        case 7:
            return carouselClasses['w-875'];
        default:
            return '';
    }
};

const HotelImageCarousel = props => {
    const { images } = props;

    const [mainSlide, setMainSlide] = useState();
    const [thumbnailSlide, setThumbnailSlide] = useState();

    const slideContent =
        images.base_images && images.base_images.length
            ? images.base_images.map((image, index) => {
                  const imageURL = image.link;

                  return (
                      <div key={index}>
                          <img src={imageURL} />
                      </div>
                  );
              })
            : '';

    const slideHover =
        images.small_images &&
        images.small_images.map((image, index) => {
            const imageURL = image.link;

            return (
                <div key={index} className="slider-customize__item">
                    <img src={imageURL} />
                </div>
            );
        });

    let centerModePC = true;
    let slidesToShowPC = 7;
    let centerModeSP = true;
    let slidesToShowSP = 3;
    if (images.small_images) {
        if (images.small_images && images.small_images.length < 8) {
            centerModePC = false;
            slidesToShowPC = 8;
        }
    } else {
        if (images && images.length < 8) {
            centerModePC = false;
            slidesToShowPC = 8;
        }
    }
    if (images.small_images) {
        if (images.small_images && images.small_images.length < 4) {
            centerModeSP = false;
            slidesToShowSP = 4;
        }
    } else {
        if (images && images.length < 4) {
            centerModeSP = false;
            slidesToShowSP = 4;
        }
    }
    let settingThumbnailSlide = {
        asNavFor: mainSlide,
        centerMode: centerModePC,
        ref: slider => {
            setThumbnailSlide(slider);
        },
        slidesToShow: slidesToShowPC,
        swipeToSlide: true,
        focusOnSelect: true,
        arrows: false,
        className: 'slider-nav',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    centerMode: centerModeSP,
                    slidesToShow: slidesToShowSP
                }
            }
        ]
    };

    if (images.small_images) {
        if (images.small_images && images.small_images.length < 8) {
            settingThumbnailSlide = {
                ...settingThumbnailSlide,
                slidesToShow: images.small_images.length,
                className:
                    'slider-nav ' +
                    getClassNameForSlideHover(images.small_images.length)
            };
        }
    } else {
        if (images && images.length < 8) {
            settingThumbnailSlide = {
                ...settingThumbnailSlide,
                slidesToShow: images.length,
                className:
                    'slider-nav ' + getClassNameForSlideHover(images.length)
            };
        }
    }

    return (
        <div className="slider slider-customize">
            <Slider
                asNavFor={thumbnailSlide}
                ref={slider => setMainSlide(slider)}
            >
                {slideContent}
            </Slider>

            <Slider {...settingThumbnailSlide}>{slideHover}</Slider>
        </div>
    );
};

export default HotelImageCarousel;
