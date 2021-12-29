import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import {
    generateUrlFromContainerWidth
    // DEFAULT_WIDTH_TO_HEIGHT_RATIO
} from '@magento/venia-ui/lib/util/images';
import carouselClasses from './carousel.css';
import ReactImageMagnify from '@skp/components/ImageMagnify/ReactImageMagnify';

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

const ProductImageCarousel = props => {
    const { images, type, default_image, displayedImageIndex } = props;

    const enabledImages = images.filter(image => image.disabled == false);

    const IMAGE_WIDTH = 1280;
    const LARGE_IMAGE_WIDTH = 1382;
    const LARGE_IMAGE_HEIGHT = 916;

    const [mainSlide, setMainSlide] = useState();
    const [thumbnailSlide, setThumbnailSlide] = useState();

    const slideContent = enabledImages.length
        ? enabledImages.map(image => {
              const imageURL = new URL(
                  generateUrlFromContainerWidth(image.file, IMAGE_WIDTH, type),
                  location.origin
              ).href;
              const largeImageUrl = new URL(
                  generateUrlFromContainerWidth(
                      image.file,
                      LARGE_IMAGE_WIDTH,
                      type
                  ),
                  location.origin
              ).href;
              return (
                  <div key={image.id}>
                      <ReactImageMagnify
                          {...{
                              smallImage: {
                                  isFluidWidth: true,
                                  src: imageURL,
                                  srcSet: imageURL
                              },
                              largeImage: {
                                  src: largeImageUrl,
                                  width: LARGE_IMAGE_WIDTH,
                                  // when we suppor other size, we have to calc?
                                  // height: LARGE_IMAGE_WIDTH /DEFAULT_WIDTH_TO_HEIGHT_RATIO
                                  height: LARGE_IMAGE_HEIGHT
                              },
                              lensStyle: { backgroundColor: 'rgba(0,0,0,.6)' },
                              imageClassName:
                                  carouselClasses['magnify-customer-image'],
                              enlargedImageClassName:
                                  carouselClasses[
                                      'magnify-customer-enlarged-image'
                                  ]
                          }}
                          {...{
                              isHintEnabled: false,
                              shouldHideHintAfterFirstActivation: false,
                              enlargedImagePosition: 'beside',
                              enlargedImageContainerDimensions: {
                                  width: '56%',
                                  height: '100%'
                              },
                              enlargedImagePortalId: 'id-right-enlarged-target',
                              isEnlargedImagePortalEnabledForTouch: false
                          }}
                      />
                  </div>
              );
          })
        : [
              <div key={1}>
                  <img src={default_image} />
              </div>
          ];

    const slideHover = enabledImages.length
        ? enabledImages.map(image => {
              const imageURL = new URL(
                  generateUrlFromContainerWidth(image.file, IMAGE_WIDTH, type),
                  location.origin
              ).href;

              return (
                  <div key={image.id} className="slider-customize__item">
                      <img src={imageURL} />
                  </div>
              );
          })
        : [
              <div key={1} className="slider-customize__item">
                  <img src={default_image} />
              </div>
          ];

    let centerModePC = true;
    let slidesToShowPC = 7;
    let centerModeSP = true;
    let slidesToShowSP = 3;
    if (slideHover.length < 8) {
        centerModePC = false;
        slidesToShowPC = 8;
    }
    if (slideHover.length < 4) {
        centerModeSP = false;
        slidesToShowSP = 4;
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

    if (slideHover.length < 8) {
        settingThumbnailSlide = {
            ...settingThumbnailSlide,
            slidesToShow: slideHover.length,
            className:
                'slider-nav ' + getClassNameForSlideHover(slideHover.length)
        };
    }

    useEffect(() => {
        if (mainSlide && displayedImageIndex !== null) {
            mainSlide.slickGoTo(displayedImageIndex + 1);
        }
    }, [displayedImageIndex, mainSlide]);

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

export default ProductImageCarousel;
