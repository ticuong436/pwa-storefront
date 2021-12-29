import React from 'react';
import {
    bool,
    node,
    number,
    oneOfType,
    shape,
    string,
    object
} from 'prop-types';
import classes from './productInfoListItem.css';
import {
    SPECIAL_FONT_SIZE_BY_NAME_XS,
    SPECIAL_FONT_SIZE_BY_NAME_SM
} from '@skp/config';
import ExternalSupportLink from '@skp/components/ExternalSupportLink';

function ProductInfoListItem({
    product,
    mainDescription,
    rightDescription,
    action,
    detailAction,
    additionalInfo,
    detailUrl,
    onProductClick
}) {
    return (
        <div className="mlisting-item">
            <div className={`mlisting-ileft ${classes.imageArea}`}>
                <ExternalSupportLink to={detailUrl} onClick={onProductClick}>
                    <img src={product.image} alt="" />
                </ExternalSupportLink>
                {additionalInfo && (
                    <span className={classes.imageAreaBottomBar}>
                        {additionalInfo}
                    </span>
                )}
            </div>
            <div className="mlisting-iright">
                <div className="mlisting-iright-text">
                    <div className="mlisting-icon">
                        <div className="mlisting-icon__item">
                            {product.is_new && (
                                //<img src={newStatusIcon} alt="img" />
                                <div className="mlisting-icon-hexagon-svg">
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
                            )}
                        </div>
                        <div className="mlisting-icon__item">
                            <div className="d-flex">{action}</div>
                        </div>
                    </div>
                    <div className="mlisting-ititle">
                        <h3 className="mlisting-ititle__text">
                            <ExternalSupportLink
                                to={detailUrl}
                                style={{
                                    fontSize: SPECIAL_FONT_SIZE_BY_NAME_XS.includes(
                                        product.name
                                    )
                                        ? '1.4rem'
                                        : SPECIAL_FONT_SIZE_BY_NAME_SM.includes(
                                              product.name
                                          )
                                        ? null
                                        : null
                                }}
                                onClick={onProductClick}
                            >
                                {product.name}
                            </ExternalSupportLink>
                        </h3>
                        <span className="mlisting-ititle__user">
                            {product.service_name ? (
                                product.service_name
                            ) : (
                                <span className="product-detail__line" />
                            )}
                        </span>
                    </div>
                    <div className="mlisting-ides">
                        <div className="mlisting-ides-left">
                            <div className="mlisting-ides-lbox">
                                <div className="mlisting-ltype">
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: mainDescription
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mlisting-ides-right">
                            <p
                                className="mlisting-rtext"
                                dangerouslySetInnerHTML={{
                                    __html: rightDescription
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="mlisting-iright-button">{detailAction}</div>
            </div>
        </div>
    );
}

ProductInfoListItem.propTypes = {
    product: shape({
        id: oneOfType([number, string]).isRequired,
        name: string.isRequired,
        is_new: bool,
        service_name: string,
        /**
         * Image url
         */
        image: string
    }).isRequired,
    mainDescription: string,
    rightDescription: string,
    detailUrl: oneOfType([
        string,
        shape({
            pathname: string.isRequired,
            state: object
        })
    ]).isRequired,
    /**
     * Action can be wishlist icon or restock delete icon
     */
    action: node,
    detailAction: node
};

export default ProductInfoListItem;
