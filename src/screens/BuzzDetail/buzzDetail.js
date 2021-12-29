import React from 'react';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import useBuzzDetail from './useBuzzDetail';
import { Link } from '@skp/drivers';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import Slider from 'react-slick';
import { SITE_LINKS } from '@skp/config';
import PageTitle from '@skp/components/PageTitle';
import TargetBlankLink from '@skp/components/TargetBlankLink';

const BuzzDetail = () => {
    const { buzzDetail, loading, error } = useBuzzDetail();

    if (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
        return <div>Data Fetch Error</div>;
    }

    if (loading) {
        return <LoadingIndicator />;
    }

    const mediaSlideSettings = {
        customPaging: i => {
            return (
                <div className="detail-item">
                    <div className="detail-item-box">
                        <a className="detail-item--link" href="">
                            <img src={buzzDetail.media[i].path} alt="" />
                        </a>
                    </div>
                </div>
            );
        },
        autoplay: true,
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dotsClass: 'detail-list pt-5',
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            }
        ]
    };

    const description = buzzDetail.description
        .replace(/({{media url)(=)/g, buzzDetail.pathUrl)
        .replace(/}}/g, '');

    return (
        <>
            <PageTitle title={buzzDetail.title} transate={false} />
            <Link className="result-img" to="#">
                <img src={buzzDetail.banner} alt="" />
            </Link>
            <div className="detail">
                <div className="detail-top">
                    <h1 className="detail--title" href="#">
                        {buzzDetail.title}
                    </h1>
                    <div className="detail-date">
                        <span>{buzzDetail.date}</span>
                    </div>
                </div>
                <div className="detail-text">
                    <RichContent html={description} />
                </div>
                <div className="detail-content">
                    <div className="detail-full">
                        <Slider {...mediaSlideSettings}>
                            {buzzDetail.media.map(
                                media =>
                                    (media.type == 'image' && (
                                        <img
                                            key={media.path}
                                            src={media.path}
                                            alt=""
                                        />
                                    )) || (
                                        <div
                                            key={media.path}
                                            dangerouslySetInnerHTML={{
                                                __html: media.html
                                            }}
                                        />
                                    )
                            )}
                        </Slider>
                    </div>
                </div>
                <div className="detail-button">
                    <button type="button" className="button-action">
                        <TargetBlankLink
                            className="button-action"
                            style={{
                                color: 'white'
                            }}
                            href={SITE_LINKS['support']}
                            rel="noopener noreferrer"
                        >
                            Contact Us
                        </TargetBlankLink>
                    </button>
                </div>
            </div>
        </>
    );
};

export default BuzzDetail;
