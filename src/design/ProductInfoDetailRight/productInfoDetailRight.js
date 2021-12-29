import React from 'react';
import {
    bool,
    node,
    number,
    oneOfType,
    shape,
    string,
    boolean
} from 'prop-types';
import classes from './productInfoDetailRight.css';
import platinumIcon from 'design/dest/images/ic-platinum.png';
import { SPECIAL_FONT_SIZE_BY_NAME_XS } from '@skp/config';

function ProductInfoDetailRight({
    product,
    topDescription,
    bottomDescription,
    additionalInfo,
    action,
    actionBadges,
    actionApply
}) {
    return (
        <div className="col-lg-4 col-md-4 product-detail__info">
            <div
                id="id-right-enlarged-target"
                style={{
                    position: 'absolute',
                    zIndex: '100',
                    width: '100%'
                }}
            />
            <div className="product-detail__top">
                <span className="product-detail__cate">
                    {product.pillar_name}
                </span>
                <div className="product-status">
                    {product.is_show_platinum_icon && (
                        <div className="product-status__item">
                            <img src={platinumIcon} alt="img" />
                        </div>
                    )}
                    {product.is_new && (
                        <div className="product-status__item">
                            <div className="reg-hexagon-svg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="35.366"
                                    height="37.925"
                                    viewBox="0 0 35.366 37.925"
                                >
                                    <g
                                        id="Icon_New"
                                        data-name="Icon — New"
                                        transform="translate(0)"
                                    >
                                        <path
                                            id="パス_48"
                                            data-name="パス 48"
                                            d="M446.747,426.637l-13.5,7.474a4.344,4.344,0,0,1-4.185,0l-13.5-7.474a3.99,3.99,0,0,1-2.093-3.477V408.212a3.99,3.99,0,0,1,2.093-3.477l13.5-7.474a4.345,4.345,0,0,1,4.185,0l13.5,7.474a3.99,3.99,0,0,1,2.093,3.477V423.16A3.99,3.99,0,0,1,446.747,426.637Z"
                                            transform="translate(-413.474 -396.724)"
                                            fill="#baa9ad"
                                        />
                                        <text
                                            id="NEW"
                                            transform="translate(18.377 23.187)"
                                            fill="#fff"
                                            fontSize="12"
                                            fontFamily="Lato-Regular, Lato"
                                        >
                                            <tspan x="-14.259" y="0">
                                                NEW
                                            </tspan>
                                        </text>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    )}
                    <div className="product-status__item">
                        <div className="d-flex">{action}</div>
                    </div>
                </div>
            </div>
            <span className="product-detail__line" />
            <h2
                className={
                    SPECIAL_FONT_SIZE_BY_NAME_XS.includes(product.name)
                        ? 'product-detail__title product-detail__title__special'
                        : 'product-detail__title'
                }
            >
                <span>{product.name}</span>
            </h2>
            <span className="product-detail__cate-sub">
                {product.service_name}
            </span>
            <div className="product-noti">
                {bottomDescription && (
                    <p
                        className={classes.productNotiText}
                        dangerouslySetInnerHTML={{
                            __html: bottomDescription
                        }}
                    />
                )}
                {topDescription && (
                    <p
                        className={classes.productNotiText}
                        dangerouslySetInnerHTML={{
                            __html: topDescription
                        }}
                    />
                )}
                <div className="product-countdown">
                    {additionalInfo && (
                        <div className={classes.productCount}>
                            <span className="product-count__name">
                                {additionalInfo}
                            </span>
                        </div>
                    )}
                    {actionApply}
                </div>
            </div>
            {actionBadges}
        </div>
    );
}

ProductInfoDetailRight.propTypes = {
    product: shape({
        id: oneOfType([number, string]).isRequired,
        name: string.isRequired,
        is_new: bool,
        service_name: string,
        pillar_name: string,
        is_show_platinum_icon: boolean,
        detail_middle_category: string
    }).isRequired,
    topDescription: string,
    bottomDescription: string,
    additionalInfo: node,
    /**
     * Action can be wishlist icon or restock delete icon
     */
    action: node,
    detailAction: node,
    actionBadges: node,
    actionApply: node
};

export default ProductInfoDetailRight;
